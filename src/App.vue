<template>
  <div class="app">
    <div class="header">
      <h1>嵌套拖拽</h1>
      <button class="btn-add" @click="addLabel">+ 添加卡片</button>
    </div>
    <div class="wrapper">
      <CombineArea :initTreeData="treeData" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import CombineArea from './components/CombineArea.vue'

const treeData = reactive({
  level: 0,
  operator: '且',
  tags: []
})

const uid = ref(0)

const addLabel = () => {
  treeData.tags.push({
    uid: uid.value++,
    name: `卡片 ${uid.value}`,
    valueDesc: '描述信息'
  })
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f0f2f5;
  color: #333;
  padding: 40px 20px;
}

.app {
  max-width: 680px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h1 {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
  }
}

.btn-add {
  padding: 8px 16px;
  background: transparent;
  color: #1890ff;
  border: 1px solid #1890ff;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #fff;
    background: #1890ff;
    border-color: #1890ff;
  }
}

.wrapper {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}
</style>
