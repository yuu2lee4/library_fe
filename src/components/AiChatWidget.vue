<template>
  <div class="ai-widget">
    <el-button class="ai-trigger" type="primary" circle @click="openWidget">
      <el-icon><ChatDotRound /></el-icon>
    </el-button>

    <el-drawer v-model="drawerVisible" title="AI 图书助手" direction="rtl" size="390px">
      <div v-if="!activeConversationId" class="history-view">
        <AiChatHistory :conversations="conversations" :loading="loadingHistory" @new="startConversation" @open="openConversation" @delete="removeConversation" />
      </div>

      <div v-else class="chat-view">
        <AiChatPanel ref="chatPanel" :messages="messages" :draft="draft" :sending="sending" :tool-status="toolStatus" @update:draft="draft = $event" @back="backToHistory" @new="startConversation" @send="submitMessage" />
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ChatDotRound } from '@element-plus/icons'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { fetch as apiFetch } from '@/assets/js/fetch'
import AiChatHistory from './AiChatHistory.vue'
import AiChatPanel from './AiChatPanel.vue'

const drawerVisible = ref(false)
const loadingHistory = ref(false)
const sending = ref(false)
const conversations = ref([])
const messages = ref([])
const activeConversationId = ref('')
const draft = ref('')
const toolStatus = ref(null)
const thinkingMessage = ref(null)
const chatPanel = ref(null)
let answerBuffer = ''
let answerFrame = 0

const isPersistedConversation = () => activeConversationId.value && activeConversationId.value !== 'new'

const loadHistory = async () => {
  loadingHistory.value = true
  try {
    conversations.value = await apiFetch({ method: '/ai/conversations', type: 'get' })
  } finally {
    loadingHistory.value = false
  }
}

const openWidget = async () => {
  drawerVisible.value = true
  await loadHistory()
}

const startConversation = () => {
  activeConversationId.value = 'new'
  messages.value = []
  draft.value = ''
  toolStatus.value = null
  thinkingMessage.value = null
  nextTick(() => chatPanel.value?.focusInput())
}

const openConversation = async id => {
  messages.value = await apiFetch({ method: `/ai/conversations/${id}/messages`, type: 'get' })
  activeConversationId.value = id
  nextTick(() => chatPanel.value?.focusInput())
}

const backToHistory = async () => {
  activeConversationId.value = ''
  await loadHistory()
}

const removeConversation = async id => {
  try {
    await ElMessageBox.confirm('删除后无法恢复，确定删除这段对话吗？', '删除聊天', { type: 'warning' })
    await apiFetch({ method: `/ai/conversations/${id}`, type: 'delete' })
    if (activeConversationId.value === id) startConversation()
    await loadHistory()
    ElMessage.success('聊天已删除')
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') ElMessage.error(error.message || '删除失败')
  }
}

const submitMessage = async () => {
  const content = draft.value.trim()
  if (!content || sending.value) return
  draft.value = ''
  sending.value = true
  messages.value.push({ role: 'user', content })
  toolStatus.value = null
  thinkingMessage.value = { role: 'thinking', content: '', collapsed: true }
  messages.value.push(thinkingMessage.value)
  const assistantMessage = { role: 'assistant', content: '' }
  messages.value.push(assistantMessage)
  const getAssistantIndex = () => messages.value.findIndex(item => item === assistantMessage)
  answerBuffer = ''

  const flushAnswer = () => {
    if (answerBuffer) {
      assistantMessage.content += answerBuffer
      answerBuffer = ''
    }
    answerFrame = 0
  }

  const scheduleAnswer = content => {
    answerBuffer += content
    if (!answerFrame) answerFrame = requestAnimationFrame(flushAnswer)
  }

  const controller = new AbortController()
  try {
    await fetchEventSource('/api/ai/chat', {
      method: 'POST',
      credentials: 'include',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      body: JSON.stringify({ message: content, ...(isPersistedConversation() ? { conversationId: activeConversationId.value } : {}) }),
      onmessage(event) {
        const data = JSON.parse(event.data)
        if (event.event === 'conversation') activeConversationId.value = data.conversationId
        if (event.event === 'thinking') toolStatus.value = '正在分析问题…'
        if (event.event === 'thinking_delta' && thinkingMessage.value) thinkingMessage.value.content += data.content || ''
        if (event.event === 'tool_call') {
          toolStatus.value = `正在调用：${toolLabel(data.tool)}`
          messages.value.splice(getAssistantIndex(), 0, { role: 'tool', content: toolStatus.value, tool: data.tool, status: 'running' })
        }
        if (event.event === 'tool_result') {
          toolStatus.value = '工具返回结果，正在整理回答…'
          const toolMessage = messages.value.findLast(item => item.role === 'tool' && item.status === 'running')
          if (toolMessage) {
            toolMessage.content = `${toolMessage.content.replace('正在调用', '已调用')}（已完成）`
            toolMessage.status = 'done'
          }
        }
        if (event.event === 'answer_delta') scheduleAnswer(data.content || '')
        if (event.event === 'answer') {
          flushAnswer()
          if (!assistantMessage.content) assistantMessage.content = data.content || ''
        }
        if (event.event === 'done') {
          flushAnswer()
          assistantMessage.content = assistantMessage.content.trim()
          toolStatus.value = null
          thinkingMessage.value = null
        }
        if (event.event === 'error') throw new Error(data.message || 'AI 请求失败')
      },
      onclose() {
        if (!activeConversationId.value) throw new Error('AI 连接提前关闭')
      },
      onerror(error) {
        throw error
      },
    })
  } catch (error) {
    if (answerFrame) cancelAnimationFrame(answerFrame)
    answerFrame = 0
    answerBuffer = ''
    const assistantIndex = getAssistantIndex()
    if (assistantIndex !== -1) messages.value.splice(assistantIndex, 1)
    const thinkingIndex = messages.value.findIndex(item => item.role === 'thinking')
    if (thinkingIndex !== -1) messages.value.splice(thinkingIndex, 1)
    toolStatus.value = null
    ElMessage.error(error.message || 'AI 请求失败')
  } finally {
    flushAnswer()
    sending.value = false
    await loadHistory()
  }
}

const toolLabel = tool => ({
  book_db_query: '馆藏数据库',
  get_my_borrowed_books: '我的借阅记录',
  web_search: '网络搜索',
}[tool] || tool || '图书工具')
</script>

<style scoped lang="less">
.ai-trigger { position: fixed; right: 32px; bottom: 32px; z-index: 1000; width: 54px; height: 54px; box-shadow: 0 8px 22px rgba(64, 158, 255, .28); }
.ai-trigger::before { content: ''; position: absolute; inset: -6px; border: 1px solid rgba(64, 158, 255, .22); border-radius: 50%; animation: pulse 2.4s infinite; }
:deep(.el-drawer__header) { margin-bottom: 0; padding: 22px 22px 16px; background: linear-gradient(135deg, #f7fbff, #ffffff); border-bottom: 1px solid #edf3f8; }
:deep(.el-drawer__title) { color: #1f3652; font-size: 18px; font-weight: 700; }
:deep(.el-drawer__body) { padding: 0 18px 18px; background: #fbfcfe; }
@keyframes pulse { 0%, 100% { transform: scale(.92); opacity: .75; } 50% { transform: scale(1.08); opacity: 0; } }
@media (max-width: 600px) { .ai-trigger { right: 18px; bottom: 18px; } }
</style>