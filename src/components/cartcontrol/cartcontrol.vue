<template>
  <div class="cartcontrol">
      <!-- 定义动画，名为move  -->
      <div class="cart-decrease" v-show="food.count>0" @click="decreaseCart" transition="move">
          <span class="inner icon-remove_circle_outline"></span>
      </div>
      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
      <div class="cart-add icon-add_circle" @click="addCart"></div>
  </div>
</template>

<script>
    import Vue from 'vue';
    export default {
        props: {
            food: {
                type: Object
            }
        },
        created() {},
        // 这块放得是方法
        methods: {
            // 添加数量
            addCart(event) {
                if (!event._constructed) {
                    return;
                }
                if (!this.food.count) {
                    Vue.set(this.food, 'count', 1);// 为vue.food添加一个count属性
                } else {
                    this.food.count++;
                }
                // 把event.target事件传播到父组件的cart.add事件参数为event.target
                this.$dispatch('cart.add', event.target);
            },
            // 减少数量
            decreaseCart(event) {
                if (!event._constructed) {
                    return;
                }
                if (this.food.count) {
                   this.food.count--;
                }
            }
        }
    };
</script>

<style lang="stylus">
    .cartcontrol
      font-size 0
      .cart-decrease
        display inline-block
        padding 6px
        transition all 0.4s linear
        // 动画名 move 显示的效果
        &.move-transition
          opacity 1
          //  translate3d取值，x,y,z偏移的长度  
          transform translate3d(0, 0, 0)
        .inner
          display inline-block
          line-height 24px
          font-size 24px
          color rgb(0, 160, 220)
          transition all 0.4s linear
          // 旋转效果初始状态
          transform rotate() 
        // 动画进入状态和结束状态
        &.move-enter, &.move-leave
          opacity 0
          transform translate3d(24px, 0, 0)
          .inner
            // 旋转效果进入状态和结束状态
            transform rotate(360deg) 
      .cart-count
        display inline-block
        vertical-align top
        width 12px
        padding-top 6px
        line-height 24px
        text-align center
        font-size 10px
        color rgb(147, 153, 159)
      .cart-add
        display inline-block
        padding 6px
        line-height 24px
        font-size 24px
        color rgb(0, 160, 220)
</style>
