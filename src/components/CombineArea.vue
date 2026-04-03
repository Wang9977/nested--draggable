<template>
  <TreeCondition 
    :tree="tree" 
    :level="0" 
    :maxLevel="maxLevel"
    :getNextGroupId="getNextGroupId"
    @nodeChange="handleNodeChange"
    @exceedMaxLevel="onExceedMaxLevel"
  />
</template>

<script setup>
import { reactive, watch, provide } from 'vue'
import TreeCondition from './TreeCondition.vue'

const props = defineProps({
  initTreeData: Object,
  isEdit: Boolean,
  maxLevel: {
    type: Number,
    default: 5
  }
})

let groupIdCounter = 1

const getNextGroupId = () => {
  return groupIdCounter++
}

provide('getNextGroupId', getNextGroupId)

const tree = reactive(props.initTreeData || {
  level: 0,
  operator: '且',
  tags: []
})

watch(() => props.initTreeData, (newVal) => {
  if (newVal) {
    Object.assign(tree, newVal)
  }
}, { deep: true })

const filterNode = (treeNode) => {
  if (treeNode.tags) {
    treeNode.tags = treeNode.tags.filter(it => !it?.tags || !it.level || (it.tags && it.tags.length))
  }
  if (treeNode?.tags?.length) {
    treeNode.tags.forEach(node => filterNode(node))
  } else if (typeof treeNode.uid !== 'number') {
    delTree(tree, treeNode.groupId, treeNode.level)
  }
}

const handleNodeChange = () => {
  filterNode(tree)
}

const delTree = (treeNode, targetGroupId, targetLevel) => {
  if (treeNode.tags) {
    const idx = treeNode.tags.findIndex(item => item.groupId === targetGroupId && item.level === targetLevel)
    if (idx === -1) {
      treeNode.tags.forEach(it => delTree(it, targetGroupId, targetLevel))
    } else {
      treeNode.tags.splice(idx, 1)
      if (!treeNode.tags.length) {
        filterNode(treeNode)
      }
    }
  }
}

const emit = defineEmits(['exceedMaxLevel'])

const onExceedMaxLevel = () => {
  emit('exceedMaxLevel')
}
</script>
