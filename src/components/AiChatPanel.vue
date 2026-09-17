<template>
  <div class="chat-view">
    <div class="chat-toolbar">
      <el-button link :icon="ArrowLeft" @click="$emit('back')">历史</el-button>
      <div class="chat-title"><span class="status-dot" /> <span>图书助手</span></div>
      <el-button link :icon="Plus" @click="$emit('new')">新建</el-button>
    </div>
    <div ref="messageList" class="message-list">
      <div v-if="messages.length === 0" class="chat-empty">
        <el-icon><Reading /></el-icon>
        <p>询问馆藏、借阅或书籍资料</p>
      </div>
      <div v-for="(item, index) in messages" :key="item.id || index" :class="['message-row', item.role]">
        <details v-if="item.role === 'thinking'" class="thinking-block" :open="!item.collapsed">
          <summary>
            <span v-if="toolStatus">{{ toolStatus }}</span>
            <span v-else>思考过程</span>
          </summary>
          <div class="thinking-content" v-html="renderText(item.content)" />
        </details>
        <div v-else-if="item.role === 'tool'" class="tool-record"><span class="tool-record-icon">⌁</span>{{ item.content }}</div>
        <div v-else-if="item.content" class="message-bubble" v-html="renderText(item.content)" />
      </div>
    </div>
    <div class="chat-input">
      <el-input
        ref="chatInput"
        :model-value="draft"
        type="textarea"
        :rows="2"
        resize="none"
        maxlength="4000"
        show-word-limit
        placeholder="请输入书籍相关问题"
        @update:model-value="$emit('update:draft', $event)"
        @keydown.enter.exact.prevent="$emit('send')"
      />
      <el-button type="primary" :loading="sending" :disabled="!draft.trim()" @click="$emit('send')">发送</el-button>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import { ArrowLeft, Plus, Reading } from '@element-plus/icons'

const props = defineProps({
  messages: { type: Array, default: () => [] },
  draft: { type: String, default: '' },
  sending: Boolean,
  toolStatus: { type: String, default: '' },
})
defineEmits(['back', 'new', 'send', 'update:draft'])
const messageList = ref(null)
const chatInput = ref(null)

const focusInput = async () => {
  await nextTick()
  chatInput.value?.focus()
}

defineExpose({ focusInput })

const renderText = value => String(value || '').trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')
const scrollToBottom = async () => {
  await nextTick()
  if (messageList.value) messageList.value.scrollTop = messageList.value.scrollHeight
}
watch(() => props.messages.length, scrollToBottom)
watch(() => props.messages.at(-1)?.content, scrollToBottom)
</script>

<style scoped lang="less">
.chat-view { height: 100%; display: flex; flex-direction: column; }
.chat-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 4px 0 14px; border-bottom: 1px solid #e7eef5; }
.chat-title { display: flex; align-items: center; gap: 7px; color: #1f3652; font-weight: 700; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; background: #63c492; box-shadow: 0 0 0 4px rgba(99, 196, 146, .14); }
.message-list { flex: 1; overflow-y: auto; padding: 18px 2px; }
.message-row { display: flex; margin-bottom: 12px; }
.message-row.user { justify-content: flex-end; }
.message-bubble { max-width: 86%; padding: 11px 14px; border: 1px solid #e5edf4; border-radius: 14px; line-height: 1.65; word-break: break-word; background: #fff; color: #303133; box-shadow: 0 4px 12px rgba(38, 77, 112, .05); }
.message-row.user .message-bubble { background: linear-gradient(135deg, #4d9fe8, #347fca); border-color: transparent; color: white; border-bottom-right-radius: 4px; box-shadow: 0 5px 12px rgba(52, 127, 202, .18); }
.message-row.assistant .message-bubble { border-bottom-left-radius: 4px; }
.thinking-block { width: 100%; margin: 0 0 10px; padding: 9px 11px; border: 1px solid #e3edf5; border-radius: 10px; background: #f7fafc; color: #7890a4; font-size: 12px; }
.thinking-block summary { cursor: pointer; color: #6283a0; font-weight: 600; }
.thinking-content { margin-top: 8px; white-space: pre-wrap; line-height: 1.55; }
.tool-record { margin: 0 0 10px; padding: 7px 10px; border-radius: 8px; background: #eef7fd; color: #4c86ad; font-size: 12px; }
.tool-record-icon { display: inline-block; margin-right: 6px; color: #409eff; }
.chat-empty { height: 100%; display: grid; place-content: center; justify-items: center; color: #9aa3af; }
.chat-empty .el-icon { font-size: 34px; color: #409eff; }
.chat-input { display: flex; align-items: flex-end; gap: 8px; padding-top: 14px; border-top: 1px solid #e7eef5; }
.chat-input .el-input { flex: 1; }
.chat-input :deep(.el-textarea__inner) { border-radius: 10px; border-color: #dce8f1; box-shadow: none; }
.chat-input :deep(.el-textarea__inner:focus) { border-color: #76b5e5; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>