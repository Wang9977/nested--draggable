<template>
  <section class="tree" :class="`level-${level}`" :data-level="level">
    <div v-if="level && treeData.tags?.length" class="tree__header">
      <span class="tree__tag">条件组 {{ level }}</span>
      <span class="tree__del" @click="onDelGroup">删除组</span>
    </div>
    
    <div class="tree__body">
      <div v-if="treeData.tags?.length > 1" class="tree__op">
        <div class="tree__line"></div>
        <button class="tree__btn" @click="changeOpt">{{ treeData.operator }}</button>
        <div class="tree__line"></div>
      </div>
      
      <draggable
        :list="treeData.tags"
        group="shared"
        :item-key="(item) => item.groupId ? `g-${item.groupId}` : `c-${item.uid}`"
        :animation="150"
        class="tree__list"
        ghost-class="ghost"
        @start="onDragStart"
        @end="onDragEnd"
        @add="onDragAdd"
        @remove="onDragRemove"
        @change="onDragChange"
        :move="onMove"
      >
        <template #item="{ element: tag }">
          <div v-if="!tag.tags" class="item">
            <div class="item__info">
              <span class="item__title">{{ tag.name }}</span>
              <span class="item__desc">{{ tag.valueDesc }}</span>
            </div>
            <div class="item__action">
              <span v-if="tag.level < maxLevel" class="item__link" @click="onExpand(tag)">扩展</span>
              <span class="item__link item__link--del" @click="onDel(tag)">删除</span>
            </div>
          </div>
          <TreeCondition v-else :tree="tag" :level="level + 1" :maxLevel="maxLevel" :getNextGroupId="getNextGroupId" @nodeChange="handleChildChange" @exceedMaxLevel="onExceedMaxLevel" />
        </template>
      </draggable>
    </div>
  </section>
</template>

<script setup>
import { reactive, watch, inject } from 'vue'
import draggable from 'vuedraggable'

const props = defineProps({
  tree: Object,
  level: Number,
  maxLevel: {
    type: Number,
    default: 5
  },
  getNextGroupId: Function
})

const emit = defineEmits(['nodeChange', 'exceedMaxLevel'])
const treeData = reactive(props.tree)
let dragItem = null

watch(() => props.tree, v => Object.assign(treeData, v), { deep: true, immediate: true })

const onDragStart = (evt) => {
  dragItem = evt.item._underlying_vm_
}

const onDragEnd = () => {
  dragItem = null
}

const getTargetLevel = (evt) => {
  const targetEl = evt.relatedContext?.component?.$el
  if (!targetEl) return 0
  
  const treeListEl = targetEl.closest('.tree__list')
  if (!treeListEl) return 0
  
  const parentTree = treeListEl.closest('.tree')
  if (!parentTree) return 0
  
  const parentLevel = parseInt(parentTree.dataset.level, 10)
  
  const childTree = treeListEl.querySelector('.tree')
  if (childTree) {
    return parseInt(childTree.dataset.level, 10)
  }
  
  return parentLevel
}

const onMove = (evt) => {
  const draggedContext = evt.draggedContext
  const draggedElement = draggedContext.element
  
  if (draggedElement && draggedElement.tags) {
    let maxCardLevel = draggedElement.level
    const checkLevels = (tags, relativeLevel) => {
      tags.forEach(tag => {
        if (tag.tags) {
          checkLevels(tag.tags, relativeLevel + 1)
        } else {
          maxCardLevel = Math.max(maxCardLevel, relativeLevel)
        }
      })
    }
    checkLevels(draggedElement.tags, draggedElement.level + 1)
    
    const targetLevel = getTargetLevel(evt)
    const newGroupLevel = targetLevel + 1
    const levelDiff = newGroupLevel - draggedElement.level
    const maxNewCardLevel = maxCardLevel + levelDiff
    
    if (maxNewCardLevel > props.maxLevel) {
      emit('exceedMaxLevel')
      return false
    }
  }
  return true
}

const onDragAdd = (evt) => {
  emit('nodeChange', treeData)
}

const onDragRemove = (evt) => {
  emit('nodeChange', treeData)
}

const onDragChange = (evt) => {
  if (evt.moved) {
    const groupIds = treeData.tags.map(t => t.groupId)
    const duplicates = groupIds.filter((id, idx) => groupIds.indexOf(id) !== idx)
    
    if (duplicates.length > 0) {
      const seen = new Set()
      const newTags = []
      for (let i = treeData.tags.length - 1; i >= 0; i--) {
        const tag = treeData.tags[i]
        if (!seen.has(tag.groupId)) {
          seen.add(tag.groupId)
          newTags.unshift(tag)
        }
      }
      treeData.tags = newTags
    }
    
    treeData.tags.forEach(tag => {
      if (!tag.tags) {
        tag.level = props.level + 1
      }
    })
  }
  if (evt.added) {
    const addedItem = evt.added.element
    if (addedItem && addedItem.tags) {
      const newGroupLevel = props.level + 1
      addedItem.level = newGroupLevel
      const updateLevels = (tags, level) => {
        tags.forEach(tag => {
          if (tag.tags) {
            tag.level = level
            updateLevels(tag.tags, level + 1)
          } else {
            tag.level = level
          }
        })
      }
      updateLevels(addedItem.tags, newGroupLevel + 1)
    } else if (addedItem) {
      addedItem.level = props.level + 1
    }
  }
}

const changeOpt = () => {
  treeData.operator = treeData.operator === '且' ? '或' : '且'
}

const getNextGroupId = inject('getNextGroupId', props.getNextGroupId || (() => 1))

const onExpand = (tag) => {
  const i = treeData.tags.findIndex(t => t.uid === tag.uid && !t.groupId)
  if (i > -1) {
    const newCard = JSON.parse(JSON.stringify(tag))
    newCard.level = tag.level + 1
    const newGroupId = getNextGroupId()
    const newUid = newGroupId
    
    treeData.tags[i] = {
      uid: newUid,
      level: tag.level + 1,
      operator: '且',
      tags: [newCard],
      groupId: newGroupId
    }
    emit('nodeChange', treeData)
  }
}

const onDel = (tag) => {
  const i = treeData.tags.findIndex(t => t.uid === tag.uid)
  if (i > -1) {
    treeData.tags.splice(i, 1)
    emit('nodeChange', treeData)
  }
}

const onDelGroup = () => {
  treeData.tags = []
  emit('nodeChange', treeData)
}

const getMaxCardLevel = (group) => {
  let max = 0
  if (group.tags) {
    group.tags.forEach(tag => {
      if (tag.tags) {
        const childMax = getMaxCardLevel(tag)
        max = Math.max(max, childMax)
      } else {
        max = Math.max(max, tag.level || 1)
      }
    })
  }
  return max
}

const updateGroupLevels = (group, level) => {
  group.level = level
  if (group.tags) {
    group.tags.forEach(tag => {
      if (tag.tags) {
        updateGroupLevels(tag, level + 1)
      } else {
        tag.level = level + 1
      }
    })
  }
}

const updateCardLevels = (tags, level) => {
  tags.forEach(tag => {
    if (tag.tags) {
      updateCardLevels(tag.tags, level + 1)
    } else {
      tag.level = level
    }
  })
}

const onExceedMaxLevel = () => emit('exceedMaxLevel')
const handleChildChange = () => emit('nodeChange', treeData)
</script>

<style lang="scss">
.tree {
  margin-bottom: 12px;
  border-radius: 8px;
  padding: 16px;

  &.level-1 { background: rgba(0, 0, 0, 0.01); border: 1px solid rgba(0, 0, 0, 0.06); }
  &.level-2 { background: rgba(0, 0, 0, 0.03); border: 1px solid rgba(0, 0, 0, 0.08); }
  &.level-3 { background: rgba(0, 0, 0, 0.05); border: 1px solid rgba(0, 0, 0, 0.10); }
  &.level-4 { background: rgba(0, 0, 0, 0.08); border: 1px solid rgba(0, 0, 0, 0.12); }
  &.level-5 { background: rgba(0, 0, 0, 0.10); border: 1px solid rgba(0, 0, 0, 0.14); }
  &.level-6 { background: rgba(0, 0, 0, 0.12); border: 1px solid rgba(0, 0, 0, 0.16); }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  &__tag {
    font-size: 12px;
    color: #666;
    font-weight: 500;
    background: rgba(0, 0, 0, 0.04);
    padding: 2px 8px;
    border-radius: 4px;
  }

  &__del {
    font-size: 12px;
    color: #999;
    cursor: pointer;
    &:hover { color: #333; }
  }

  &__body {
    display: flex;
    gap: 12px;
  }

  &__op {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 8px;
  }

  &__line {
    width: 2px;
    flex: 1;
    min-height: 16px;
    background: #999;
    opacity: 0.4;
  }

  &__btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #666;
    color: #fff;
    border: none;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    flex-shrink: 0;
    margin: 4px 0;

    &:hover {
      background: #333;
    }
  }

  &__list {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 40px;
  }
}

.item {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 10px 14px;
  cursor: grab;
  transition: all 0.15s;

  &:hover {
    background: #fafafa;
    border-color: #d9d9d9;
  }

  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__title {
    font-size: 13px;
    font-weight: 500;
    color: #1a1a1a;
  }

  &__desc {
    font-size: 12px;
    color: #999;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__action {
    display: flex;
    gap: 12px;
    margin-left: 16px;
  }

  &__link {
    font-size: 12px;
    color: #666;
    cursor: pointer;
    &:hover { color: #333; }
    &--del:hover { color: #ff4d4f; }
  }
}

.ghost {
  background: #f0f0f0;
  border: 2px dashed #999;
  border-radius: 6px;
}
</style>
