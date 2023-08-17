<template>
  <div class="hello-world">
    <div><el-button type="primary" @click="addLabel">添加</el-button></div>
    <!---
    <div><el-button type="primary" @click="changeEdit">编辑反显</el-button></div>
    --->

    <div class="wrapper">
      <combine-area :isEdit="isEdit" :initTreeData="treeData"></combine-area>
    </div>
  </div>
</template>

<script>
import CombineArea from './components/CombineArea.vue'
import { ref,reactive } from '@vue/composition-api';

export default {
  name: 'HelloWorld',
  components: {
    CombineArea
  },
  setup(){
    let treeData =  reactive({level:0,operator:'且',tags:[]})

    const uid = ref(0)

    const addLabel = ()=>{
      const item = {
        uid: uid.value,
        name: "卡片" + uid.value,
        valueDesc: "卡片详细信息",
      }
      uid.value++

      treeData.tags.push(item)

    }
    const isEdit = ref(false)
    const changeEdit = ()=>{
      isEdit.value = !isEdit.value
      if( isEdit.value) {
        treeData.tags = []
        treeData.tags =treeDataMock.tags
        treeData.operator = treeDataMock.operator
      }
    }

    return {
      treeData,
      isEdit,
      addLabel,
      changeEdit
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.hello-world{
  .wrapper{
    width: 360px;
    border-radius: 8px;
    background-color: #fff;
    padding: 0 20px;
    position: relative;
  }
}

</style>
