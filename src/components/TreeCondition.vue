<template>
  <section  class="tree-condition" :class="level>0 ? 'tree-display__bg' : ''">
    <div v-if="level && genTree.tags.length" class="tree-condition__head">
      <div class="tree-condition__head__title">条件组{{ level }}层，id：{{ localTree.groupId }}</div>
      <div @click="onDelGroup(genTree.tags)">删除</div>
    </div>
    <div class="tree-display" >
      <template v-if="genTree.tags.length">
        <div class="tree-display__op" v-if="genTree.tags.length>1">
          <i class="op-line"></i>
          <div class="op-name" @click="changeOpt">{{ genTree.operator }}</div>
        </div>
        <div class="tree-display__list">
          <draggable
            class="drag-wrapper"
            :value="genTree.tags || []"
            @input="onInput($event,genTree,level)"
            @add="addComponent($event,genTree.tags,level)"
            @remove="removeComponent($event,genTree.tags,level)"
            v-bind="dragOption"
          >
          <div v-for="(tag, idx) in genTree.tags"  :key="tag.level+''+idx">
            <!-- 外层 -->
            <div v-if="!tag.tags " class="tag-item" >
              <single-card  :tree="genTree" :tag="tag" :index="idx" :closable="false" :level="level" @onExpand="onExpand" @onDel="onDel"/>
            </div>
            <TreeCondition v-else  :tree="tag" :level="level+1" @nodeChange="nodeChange"  />
          </div>
        </draggable>
        </div>
      </template>
      <template v-else-if="!genTree.tags">
        <single-card :tree="tree" :tag="tree" :closable="false" @onDel="onDel" :level="level"/>
      </template>
    </div>
  </section>
</template>
<script>
import SingleCard from './SingleCard.vue'
import Draggable from 'vuedraggable'
import { cloneDeep } from 'lodash'



export default {
  name: 'TreeCondition',
  components: {
    SingleCard,
    TreeCondition: this,
    Draggable
  },
  props: {
    tree: Object,
    level: Number,
    groupId: Number
  },
  data(){
    return {
      localTree: this.tree,
      // groupId:1
    }
  },
  computed: {
    dragOption () {
      return {
        animation: 50,
        group: {
          name: '1',
          pull: true,
          put: true
        },
        ghostClass: 'ghost'
      }
    },
    genTree(){
      return  this.tree
    }
  },
  watch:{
    // genTree:{
    //   handler(tree){

    //   },
    //   deep:tree
    // }
  },
  methods:{

    onInput(val,genTree,level){
      this.$nextTick(()=> {
        this.localTree.tags = val
        this.$emit('nodeChange',this.localTree)
      })
    },
    changeOpt(){
      this.localTree.operator = this.localTree.operator==='且'?'或':'且'
    },

    onExpand(val){ // 扩展为条件框
      this.localTree?.tags?.forEach((e,idx) => {
        if(e.uid === val.uid ){
          this.localTree.tags[idx] = {
            level:val.level+1,
            operator:'且',
            tags:[{...val,level:val.level+1}],
            groupId:val.groupId+1
          }
        }
      });
      this.localTree.groupId = val.groupId
      this.$nextTick(()=>{
        this.$emit('nodeChange',this.localTree)
      })

    },
    onDel(val){
      this.$nextTick(()=>{
        const idx = this.localTree?.tags?.findIndex(it=>it.uid===val.uid)
        if(idx>-1){
          this.localTree.tags.splice(idx,1)
        }

        this.$emit('nodeChange',this.localTree)
      })
    },
    onDelGroup(tags){
      this.localTree.tags=[]
      this.nodeChange()
    },
    nodeChange(tree){
    console.log(tree,111)
    if(!this.localTree?.tags?.length || (tree && !Object.keys(tree).length)) this.localTree= {}
    console.log(this.localTree);
    this.$emit('nodeChange',this.localTree)
    },
    addComponent(event,tags,level){
      // 当前组件 从外层添加到内层
      if(level === 1){  // 当前组件  从外层添加到内层 将当前组件level置 1，同时增加且操作符
        tags.forEach(it => it.level=level)
        this.localTree.operator='且'
      }
      else if(level === 0 ){ // 当前组件 从内层添加到外层 将当前组件level置 0
        this.$nextTick(()=>{
          const idx = tags.findIndex(it=> it?.tags?.length===0)
          if(idx>-1){
            tags.splice(idx,1)
          }
        })
        this.tree.tags.forEach(it => it.level=level)
      }
    },
    removeComponent(event,tags,level){

    }
  },

}
</script>
<style lang="scss" scoped>
@import './style-var.scss';

.tree-condition {
  border-radius: 8px;
  width:100%;

  &__head {
    display:flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    margin-bottom: 4px;



    &__title {
      font-weight: 500;
      font-size: 14px;
      height: 20px;
      line-height: 20px;
    }
  }

.tree-display {
  display: flex;
  flex-direction: row;

  border-radius: 12px;
  margin-bottom: 6px;

  &__bg {
    background: $color-tree-bg;
    padding: 16px;
    margin-bottom: 6px;
  }
  &__op {
    width: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 14px 0 24px 12px;
    .op-line {
      display: block;
      height: 100%;
      border: 1px solid #4D80F0;
      border-right: none;
      width: 15px;
    }
    .op-name {
      margin-left: -26px;
      background: $color-primary;
      color: #fff;
      display: block;
      width: 24px;
      height: 24px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: $font-size-mini;
    }
  }
  &__list {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
}
}
</style>
