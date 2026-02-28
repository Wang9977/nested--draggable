<template>
  <div>
  <div :style="{'display':'flex'}" v-for="(i,id) in arr" :key="id">
    <div v-for="(j,id2) in i" :key="j+id2">
      <div  @click="change(id,id2)" :style="{'width':'20px','padding':'2px'}">{{arr[id][id2]}}</div>
    </div>
  </div>
  </div>
</template>
<script >
import {ref,onMounted,computed,set} from '@vue/composition-api';
export default {
setup(props){
  const arr = ref( Array.from({ length: 5 }, () => Array(5).fill('x')))
  const change = (i,j)=>{
    const nextVal = arr.value[i][j] === 'x' ? 'y' : 'x';
    arr.value.map((item,id)=>{
      item.map((it,id2)=>{
        if(Math.abs(id-i)===Math.abs(id2-j)){
          set(arr.value[id], id2, nextVal);
        }

      })
    })

    // const size = arr.value.length;

    //   // 优化：只遍历一次行 (O(n))
    //   for (let r = 0; r < size; r++) {
    //     // 计算两条对角线在该行对应的列索引
    //。    i-r=j-c 左上
    //。    i-r=c-j
    //     // 对角线 1: r - c = i - j  =>  c = r - (i - j)
    //     // 对角线 2: r + c = i + j  =>  c = (i + j) - r
    //     const c1 = r - (i - j);
    //     const c2 = (i + j) - r;

    //     // 检查列索引是否越界，并更新
    //     if (c1 >= 0 && c1 < size) {
    //       set(arr.value[r], c1, nextVal);
    //     }
    //     if (c2 >= 0 && c2 < size) {
    //       set(arr.value[r], c2, nextVal);
    //     }
    //   }
  }


  return {
    arr,
    change,
  }
}
}
</script>