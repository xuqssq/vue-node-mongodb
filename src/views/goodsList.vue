<!--  -->
<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
        <span>goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
        <div class="container">
            <div class="filter-nav">
                <span class="sortby">Sort by:</span>
                <a href="javascript:void(0)" class="default cur">Default</a>
                <a href="javascript:void(0)" class="price" @click="sortGoods()">Price 
                    <svg class="icon icon-arrow-short" v-bind:class="{'sort-up':!sortFlag}">
                        <use xlink:href="#icon-arrow-short"></use>
                    </svg>
                </a>
                <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
            </div>
            <div class="accessory-result">
                <!-- filter -->
                <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
                    <dl class="filter-price">
                    <dt>Price:</dt>
                    <dd><a href="javascript:void(0)" :class="{'cur':priceCheck=='all'}" @click="priceCheck='all'">All</a></dd>
                    <dd v-for="(price,index) in priceFilter">
                        <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{'cur':priceCheck==index}">{{price.startPrice}} - {{price.endPrice}}</a>
                    </dd>
                    </dl>
                </div>

            <!-- search result accessories list -->
                <div class="accessory-list-wrap">
                    <div class="accessory-list col-4">
                        <ul>
                            <li v-for="(item,index) in goodsList">
                                <div class="pic">
                                    <a href="#"><img v-lazy="item.productImage" alt=""></a>
                                </div>
                                <div class="main">
                                    <div class="name">{{item.productName}}</div>
                                    <div class="price">{{item.salePrice}}</div>
                                    <div class="btn-area">
                                    <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class='load-more' v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                        <img src="../assets/103.gif" v-show="loading">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <Modal v-bind:mdShow='mdShow' v-on:close="closeModal">
        <p slot="message">
            请先登录，否则无法加入购物车~
        </p>
        <div slot="btnGroup">
            <a href="javascript:;" @click="mdShow = false" class="btn btn--m">关闭</a>
        </div>
    </Modal>
     <Modal v-bind:mdShow='mdShowCar' v-on:close="closeModal">
        <p slot="message">
             <svg class="icon-status-ok">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
            </svg>
            <span>加入购物车成功！</span>
        </p>
        <div slot="btnGroup">
            <a href="javascript:;" @click="mdShowCar = false" class="btn btn--m">继续购物</a>
            <router-link href="javascript:;"  class="btn btn--m" to="/cart">进入购物车</router-link>
        </div>
    </Modal>   
    <navFooter></navFooter>
  </div>
</template>

<script>
import './../assets/css/base.css'
import './../assets/css/product.css'
import navHeader from '@/components/header'
import navFooter from '@/components/footer'
import navBread from '@/components/navBread'
import axios from 'axios'
import Modal from './../components/Modal'

export default {
  data () {
    return {
        busy:true,
        goodsList:[],
        sortFlag:true,
        page:1,
        pageSize:8,
        loading:false,
        mdShow:false,
        mdShowCar:false,
        priceFilter:[
            {startPrice:'0.00',endPrice:'500.00'},
            {startPrice:'500.00',endPrice:'1000.00'},
            {startPrice:'1000.00',endPrice:'10000.00'},
            {startPrice:'10000.00',endPrice:'1000000.00'},
        ],
        priceCheck:'all',
        filterBy:false,
        overLayFlag:false
    };
  },

  components: {
      navHeader,
      navFooter,
      navBread,
      Modal
  },

//   computed: {},

  mounted:function(){
      this.getGoodsList()
  },

  methods: {
      getGoodsList(flag){
          var param ={
              page:this.page,
              pageSize:this.pageSize,
              sort:this.sortFlag?1:-1,
              priceLevel:this.priceCheck
          }
          this.loading=true;
          axios.get('/goods/list',{
              params:param
              }).then((response)=>{
              let res = response.data;
              this.loading=false;
              if(res.status == "0"){
                  if(flag){
                      this.goodsList=this.goodsList.concat(res.result.list);
                      if(res.result.count == 0){
                          this.busy =true
                      }else{
                          this.busy =false
                      }
                  }else{
                      this.goodsList=res.result.list
                      this.busy =false
                  }
              }else{
                  this.goodsList=[];
              }
          })
      },
      showFilterPop(){
          this.filterBy=true;
          this.overLayFlag=true
      },
      setPriceFilter(index){
            this.priceCheck=index;
            this.closePop();
            this.page = 1;
            this.getGoodsList();
      },
      closePop(){
          this.filterBy=false;
          this.overLayFlag=false
      },

      sortGoods(){
          this.sortFlag = !this.sortFlag;
          this.page = 1;
          this.getGoodsList();
      },
      loadMore(){
            this.busy = true;
            setTimeout(() => {
                this.page++;
                this.getGoodsList(true)
            }, 500);
      },
      addCart(productId){
          axios.post('/goods/addCart',{
              productId:productId
          }).then((res)=>{
              var res = res.data;
            //   console.log(res)
              if(res.status==0){
                 this.mdShowCar=true  
                 this.$store.commit("updateCartCount",1)               
              }else{
                 this.mdShow=true 
              }
          })
      },
      closeModal(){
          this.mdShow = false;
      }
  }
}

</script>
<style>
.list-wrap ul::after{
    clear:both;
    content: '';
    height: 0;
    display: block;
    visibility: hidden;
}
.load-more{
    height: 100px;
    line-height: 100px;
    text-align: center;
}
.icon-arrow-short{
    transition: all .3s ease-out;
}
.sort-up{
    transform:rotate(180deg);
    transition: all .3s ease-out;
}
</style>