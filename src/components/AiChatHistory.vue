<template>
  <div class="history-view">
    <div class="history-heading">
      <div><span class="eyebrow">LIBRARY AI</span><strong>最近对话</strong></div>
      <el-button type="primary" :icon="Plus" @click="$emit('new')">新建聊天</el-button>
    </div>
    <el-empty v-if="!loading && conversations.length === 0" description="还没有聊天记录" />
    <el-skeleton v-if="loading" :rows="4" animated />
    <div v-else class="history-list">
      <div v-for="item in conversations" :key="item._id" class="history-item" @click="$emit('open', item._id)">
        <div class="history-item-main">
          <strong>{{ item.title || '新对话' }}</strong>
          <small>{{ formatDate(item.lastMessageAt || item.updatedAt) }}</small>
        </div>
        <el-button link type="danger" :icon="Delete" @click.stop="$emit('delete', item._id)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Delete, Plus } from '@element-plus/icons'
import { format } from 'date-fns'

defineProps({
  conversations: { type: Array, default: () => [] },
  loading: Boolean,
})
defineEmits(['new', 'open', 'delete'])

const formatDate = value => value ? format(new Date(value), 'MM-dd HH:mm') : ''
</script>

<style scoped lang="less">
.history-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 4px 0 18px; }
.history-heading > div { display: grid; gap: 5px; }
.history-heading strong { color: #1f3652; font-size: 19px; }
.eyebrow { color: #6d9fc8; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; }
.history-list { display: grid; gap: 8px; }
.history-item { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 15px 12px; border: 1px solid #e7eef5; border-radius: 12px; background: #fff; box-shadow: 0 4px 12px rgba(38, 77, 112, .04); cursor: pointer; transition: transform .2s, background .2s, border-color .2s, box-shadow .2s; }
.history-item:hover { background: #f7fbff; border-color: #a9d2f4; box-shadow: 0 8px 18px rgba(38, 77, 112, .09); transform: translateY(-1px); }
.history-item-main { min-width: 0; display: grid; gap: 5px; }
.history-item-main strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.history-item-main small { color: #9aa3af; }
</style>