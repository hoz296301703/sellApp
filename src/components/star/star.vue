<template>
    <div class="star" :class="starType">
        <span v-for="itemclass in itemClasses" :class="itemclass" class="star-item" track-by="$index"></span>    
    </div> 
</template>

<script>
    const LENGTH = 5;
    const CLS_ON = 'on';
    const CLS_HALF = 'half';
    const CLS_OFF = 'off';
    export default {// 导出组件
       props: {
            size: {
                type: Number// 使用组件时存入图片的尺寸然后就用哪套尺寸的样式
            },
            score: {
                type: Number// 存入评分
            }
       },
       computed: {// 计算属性
            starType() {
                return 'star-' + this.size;
            },
            itemClasses() {
                let result = [];
                let score = Math.floor(this.score * 2) / 2;
                let hasDecimal = score % 1 !== 0;
                let integer = Math.floor(score);
                // 压入全星类名on
                for (let i = 0; i < integer; i++) {
                    result.push(CLS_ON);
                }
                // 如果有小数就压入半星，最多一个
                if (hasDecimal) {
                    result.push(CLS_HALF);
                }
                // 补全空星
                while (result.length < LENGTH) {
                    result.push(CLS_OFF);
                }
                return result;// 返回itemClasses数组
            }
       }
    };
</script>

<style lang="stylus">
    @import "../../common/stylus/mixin.styl"
    .star
      .star-item
        display inline-block
        background-repeat no-repeat
      &.star-48
        .star-item
          width 20px
          height 20px
          margin-right 22px
          background-size 20px 20px
          &:last-child
            margin-right 0
          &.on
            bg-image('star48_on')
          &.half
            bg-image('star48_half')
          &.off
            bg-image('star48_off')    
      &.star-36  
        .star-item
          width 15px
          height 15px
          margin-right 6px
          background-size 15px 15px
          &:last-child
            margin-right 0
          &.on
            bg-image('star36_on')
          &.half
            bg-image('star36_half')
          &.off
            bg-image('star36_off')    
      &.star-24  
        .star-item
          width 10px
          height 10px
          margin-right 3px
          background-size 10px 10px
          &:last-child
            margin-right 0
          &.on
            bg-image('star24_on')
          &.half
            bg-image('star24_half')
          &.off
            bg-image('star24_off')
</style>