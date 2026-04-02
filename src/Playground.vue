<template>
  <div class="playground">
    <Teleport to="body">
      <div v-if="showToast" class="toast">复制成功</div>
      <div v-if="showExceedToast" class="toast toast--error">层级超出限制，请先删除条件组或增加最大层级</div>
    </Teleport>
    <aside class="sidebar sidebar--left">
      <div class="sidebar__header">
        <h3>逻辑组合</h3>
        <button class="btn-add" @click="addLabel">+ 添加卡片</button>
      </div>
      <div class="sidebar__content">
        <CombineArea :initTreeData="treeData" :maxLevel="maxLevel" @exceedMaxLevel="showExceedToastMsg" />
      </div>
    </aside>

    <aside class="sidebar sidebar--right">
      <div class="sidebar__header">
        <h3>JSON 结构</h3>
        <div class="sidebar__actions">
          <button class="btn-action" @click="applyJson">应用</button>
          <button class="btn-action" @click="copyJson">复制</button>
        </div>
      </div>
      <div class="sidebar__content">
        <div class="config-section">
          <div class="config-item">
            <label>最大层级</label>
            <input 
              type="number" 
              v-model.number="maxLevel" 
              min="1" 
              max="10"
              class="config-input"
            />
          </div>
        </div>
        <div class="json-tip">
          <p>修改 JSON 后点击<strong>应用</strong>按钮可反显到左侧树</p>
        </div>
        <textarea 
          v-model="jsonInput" 
          class="json-editor"
          placeholder="输入 JSON 数据..."
        ></textarea>
        <div v-if="jsonError" class="json-error">{{ jsonError }}</div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import CombineArea from './components/CombineArea.vue'

const treeData = reactive({
  level: 0,
  operator: '且',
  tags: []
})

const uid = ref(0)
const jsonInput = ref('')
const jsonError = ref('')
const maxLevel = ref(4)

const jsonStr = computed(() => JSON.stringify(treeData, null, 2))

watch(jsonStr, (val) => {
  jsonInput.value = val
}, { immediate: true })

const showToast = ref(false)
const showExceedToast = ref(false)

const showExceedToastMsg = () => {
  showExceedToast.value = true
  setTimeout(() => { showExceedToast.value = false }, 2500)
}

const addLabel = () => {
  treeData.tags.push({
    uid: uid.value++,
    name: `卡片 ${uid.value}`,
    valueDesc: '描述信息',
    level: 1
  })
}

const applyJson = () => {
  try {
    const parsed = JSON.parse(jsonInput.value)
    jsonError.value = ''
    setDefaultLevel(parsed, 1)
    Object.assign(treeData, parsed)
  } catch (e) {
    jsonError.value = 'JSON 格式错误'
  }
}

const setDefaultLevel = (node, level) => {
  if (!node) return
  if (node.tags) {
    node.tags.forEach(tag => {
      if (tag.tags) {
        tag.tags.forEach(t => setDefaultLevel(t, level + 1))
      } else {
        tag.level = tag.level || level
      }
    })
  }
}

const copyJson = async () => {
  await navigator.clipboard.writeText(jsonInput.value)
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 2000)
}
</script>

<style lang="scss" scoped>
.playground {
  display: flex;
  height: calc(100vh - 40px);
  background: #f0f2f5;
  gap: 16px;
  padding: 20px;
}

.sidebar {
  background: #fff;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  &--left {
    flex: 1;
  }

  &--right {
    width: 360px;
    flex-shrink: 0;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    background: #fafafa;

    h3 {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
    }
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }

  &__actions {
    display: flex;
    gap: 8px;
  }
}

.badge {
  background: #1890ff;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 10px;
}

.btn-add {
  padding: 6px 12px;
  background: transparent;
  color: #1890ff;
  border: 1px solid #1890ff;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #fff;
    background: #1890ff;
    border-color: #1890ff;
  }
}

.btn-action {
  padding: 4px 10px;
  background: transparent;
  color: #666;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background: #f0f0f0;
    color: #333;
  }
}

.json-editor {
  width: 100%;
  height: calc(100% - 120px);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.6;
  color: #24292e;
  background: #f6f8fa;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  resize: none;
  outline: none;

  &:focus {
    border-color: #1890ff;
  }
}

.config-section {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 12px;

  label {
    font-size: 13px;
    color: #666;
  }
}

.config-input {
  width: 80px;
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: #1890ff;
  }
}

.json-tip {
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 12px;
  font-size: 12px;
  color: #ad6800;

  p {
    margin: 0;
  }
}

.json-error {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 8px;
}
</style>

<style>
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  z-index: 9999;
  max-width: 300px;
  text-align: center;

  &--error {
    background: rgba(255, 77, 79, 0.9);
  }
}
</style>
