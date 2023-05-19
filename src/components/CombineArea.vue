<template>
  <tree-condition  :tree="tree" :level="0" @nodeChange="nodeChange" :key="id"></tree-condition>
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
    const nodeChange = (data) => {
      if(!(data?.tags?.length)){
        tree = {}
      } else {
        const filterTags = data?.tags?.filter(it=> !(it.tags && !it.tags.length && it.level===1))
        tree.tags = filterTags
      }
      id.value +=1
    }
    return {
      id,
      tree,
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