<template>
  <section class="single-card" :class="tag.level >0 ? 'single-card__bg' : ''">
    <div class="single-card__head">
      <div class="single-card__head__title">{{ labelName }}</div>
      <div class="single-card__head__opt">
        <p @click="toExpand" >扩展</p>
        <p @click="toDel" style="margin-left:10px">删除</p>

      </div>
    </div>
    <div  class="desc"> {{ labelDesc }}</div>

  </section>

</template>

<script>
import { computed,ref } from '@vue/composition-api';

let groupId = 0
export default {
  name:'SingleCard',
  props:{
    tag:Object,
    tree:Object,
    level:Number,
  },


  setup(props,ctx){
    const labelName = computed(() => props.tag.name)
    const labelDesc = computed(() => props.tag.valueDesc)



    const toExpand = () => {
      ctx.emit('onExpand',{...props.tag,level: props.level,groupId:groupId})
      groupId++
    }

    const toDel = () => {
      ctx.emit('onDel',props.tag)
    }



    return {
      groupId,
      labelDesc,
      labelName,
      toExpand,
      toDel,

    }


  }

}
</script>

<style lang="scss" scoped>
.single-card {
  width: 100%;
  background-color: #F7F7F7;
  border-radius: 8px;
  margin-bottom: 8px;
  padding: 16px;

  &__bg {
    background-color: #fff;
    width: calc(100% - 32px);
  }

  &__head {
    display:flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;

    &__opt {
      font-size: 12px;
      display: flex;
    }

    &__title {
      font-weight: 500;
      font-size: 14px;
      height: 20px;
      line-height: 20px;


    }
  }
  .desc{
    font-size:12px;
    color:#999;
  }
}

</style>