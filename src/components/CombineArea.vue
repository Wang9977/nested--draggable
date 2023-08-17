<template >
  <tree-condition  :tree="tree" :level="0" @nodeChange="nodeChange" :key="id"  :groupId.sync="groupId"></tree-condition>
</template>

<script>

import TreeCondition  from './TreeCondition.vue'
import { ref,reactive } from '@vue/composition-api';


export default {
  components:{
    TreeCondition,
  },

  props:{
    initTreeData: Object,
    isEdit: Boolean
  },
  setup(props,ctx){
    let tree = props?.initTreeData? reactive(props.initTreeData):reactive(treeData)

    const id= ref(1)

    const groupId = ref(1)

    const filterNode = (treeNode)=>{ // 过滤子节点是空数组的情况
      if(treeNode.tags) treeNode.tags = treeNode?.tags?.filter(it=> (!it?.tags || !it.level || (it.tags && it.tags?.length )))
      if(treeNode?.tags?.length){
         treeNode.tags.forEach((node)=> filterNode(node))
      } else if(typeof treeNode.uid !== 'number') {
        // 删除子树条件组
        delTree(tree,treeNode.groupId,treeNode.level) // 找到子节点是空数组的上一层进行删除
      }

    }
    const delTree=(treeNode,groupId,level)=>{ // groupId&level 唯一标识
      if(treeNode.tags){
        let idx  = treeNode.tags?.findIndex(item=> item.groupId === groupId && item.level=== level )
        if(idx === -1){
          treeNode.tags.forEach(it=>{
            delTree(it,groupId,level)
          })
        } else {
          treeNode?.tags?.splice(idx,1)
          if(!treeNode.tags.length){
            filterNode(treeNode) //
          }
        }
      }
    }


    const nodeChange = (data) => {
      filterNode(tree)
      id.value +=1
    }
    return {
      id,
      tree,
      groupId,
      nodeChange,
      dragOption:{
        animation: 50,
        group: {
          name: '1',
          pull: false, // 不允许拖出当前组
          put: true
        },
        ghostClass: 'ghost'
      }
    }
  }


}
</script>

<style>

</style>