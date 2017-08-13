<template>
  <div class="goods">
    <div class="menu-wrapper" v-el:meun-wrapper>
      <ul>
        <li v-for="item in goods" class="menu-item" :class="{'current':currenIndex===$index}" @click="selectMenu($index,$event)">
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" v-el:foods-wrapper>
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item border-1px">
              <div class="icon">
                <img width="" height="57px" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}</span><span>好评率{{food.rating}}</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>  
                </div> 
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart v-ref:shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
  </div>
</template>

<script>
    import BScroll from 'better-scroll';
    import shopcart from 'components/shopcart/shopcart';// 引入购物车组件
    import cartcontrol from 'components/cartcontrol/cartcontrol';// 引入添加减去数量组件
    const ERR_OK = 0;
    // 导出组件
    export default {
      props: {
        seller: {
          type: Object
        }
      },
      data() {
        return {
          goods: [],
          // 保存每个foods下的每个li的高度
          listHeight: [],
          // scrollY用来保存滚动的高度
          scrollY: 0
        };
      },
      // 计算属性
      computed: {
        // 获取当前的listHeight数组的下标
        currenIndex() {
          for (let i = 0; i < this.listHeight.length; i++) {
            let height1 = this.listHeight[i];// 当前元素的高度
            let height2 = this.listHeight[i + 1];// 当前元素的下一个元素的高度
            // 如果height2没有了说明当前index到了最后一个或者滚动高度大于等于当前的高度并且少于当前元素下个元素高度就返回当前的下标i
            if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
              return i;
            }
          }
          return 0;
        },
        // 计算出所有的food
        selectFoods() {
          let foods = [];
          this.goods.forEach((good) => {
           good.foods.forEach((food) => {
             // 如果食物的数量是有的话就把压入foods数组里
             if (food.count) {
               foods.push(food);
             }
           });
          });
          return foods;
        }
      },
      created() {
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

        this.$http.get('api/goods').then((response) => {
          response = response.body;
          if (response.error === ERR_OK) {
            this.goods = response.data;
            // DOM 更新循环结束之后执行延迟回调
            this.$nextTick(() => {
              this._initScroll();// 调用滑动效果方法
              this._calculateHeight();// 调用滑动联动食物分类效果
            });
          }
        });
      },
      methods: {
        // 点击调用
        selectMenu(index, event) {
          // 解决在pc端调用两次点击事件   event._constructed在移动端为true  pc端为false
          if (!event._constructed) {
            return;
          }
          let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');// 获取元素food-wrapper下class为food-list-hook的元素
          let el = foodList[index];
          // scrollToElement跳转到存入的元素方法
          this.foodsScroll.scrollToElement(el, 300);
        },
        _drop(target) {
          // 访问一个组件，调用它得drop方法
          // 体验优化，异步执行下落动画
          this.$nextTick(() => {
            this.$refs.shopcart.drop(target);
          });
        },
        // 调用滑动鲜果方发
        _initScroll() {
          // $els用来获取元素
          // 实例化BScroll存入元素meun-wrapper
          this.meunScroll = new BScroll(this.$els.meunWrapper, {
            click: true
          });
          // 实例化BScroll存入元素foods-wrapper
          this.foodsScroll = new BScroll(this.$els.foodsWrapper, {
            click: true,
            probeType: 3
          });
          // 监听滚动后返回的坐标
          this.foodsScroll.on('scroll', (pos) => {
            this.scrollY = Math.abs(Math.round(pos.y));// 把y值取整并转为正数
          });
        },
        // 计算元素food-wrapper下class为food-list-hook所有元素的总高度
        _calculateHeight() {
          let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');// 获取元素food-wrapper下class为food-list-hook的元素
          let height = 0;
          this.listHeight.push(height);
          for (let i = 0; i < foodList.length; i++) {
            let item = foodList[i];
            height += item.clientHeight;
            this.listHeight.push(height);
          }
        }
      },
      // 注册组件
      components: {
        shopcart,
        cartcontrol
      },
      events: {
        'cart.add'(target) {
          this._drop(target);
        }
      }
    };
</script>

<style lang="stylus">
 @import "../../common/stylus/mixin";

  .goods
    display flex
    position absolute
    top 174px
    bottom 46px
    width 100%
    overflow hidden
    .menu-wrapper
      flex 0 0 80px
      width 80px
      background-color #f3f5f7
      .menu-item
        display table
        height 54px
        width 56px
        padding: 0 12px;
        line-height 14px
        &.current
          position relative
          margin-top -1px
          z-index 10
          background-color #fff
          font-weight 700
          .text
            border-none()
        .icon
          display inline-block
          vertical-align top
          width 12px
          height 12px
          margin-right 2px
          background-size 12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')  
          &.guarantee
            bg-image('decrease_3')  
          &.invoice
            bg-image('decrease_3') 
          &.special
            bg-image('decrease_3')  
        .text
          display table-cell
          width 56px
          vertical-align middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size 12px
    .foods-wrapper
      flex 1
      .title
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147, 153, 159)
        background #f3f5f7
      .food-item
        display flex
        margin 18px  
        padding 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom 0
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          .name
            margin 2px 0 8px 0
            height 14px
            line-height 14px
            font-size 14px
            color rgb(7, 17, 27)
          .desc, .extra
            line-height 10x
            font-size 10px  
            color rgb(147, 153, 159)  
          .desc
            margin-bottom 8px
            line-height 12px
          .extra
            line-height 10px
            .count
              margin-right 12px
          .price
            font-weight 700
            line-height 24px
            .now
              margin-right 8px
              font-size 14px
              color rgb(240, 20, 20)
            .old
              text-decoration line-through
              font-size 10px   
              color rgb(147, 153, 159) 
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 12px      
</style>
