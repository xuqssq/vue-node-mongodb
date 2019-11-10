<!-- 新增地址 -->
<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>addNewAddress</span>
    </nav-bread>
    <div class="box">
    <input type="text" placeholder="请输入收货人姓名" v-model="userName">
    <input type="text" placeholder="请输入收货人地址" v-model="streetName">
    <input type="text" placeholder="请输入邮政编码" v-model="postCode">
    <input type="text" placeholder="请输入收货人联系号码" v-model="tel">
    <a href="javascript:;"  class="btn btn--m" @click="addNewAddress()">确认</a>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
import axios from 'axios'
import NavHeader from './../components/header'
import NavFooter from './../components/footer'
import NavBread from './../components/navBread'
export default {
  data () {
    return {
        userName:'',
        streetName:'',
        postCode:'',
        tel:'',
    };
  },
  components:{
        NavHeader,
        NavFooter,
        NavBread,
        },
  methods: {
      addNewAddress(){
          axios.post('/users/addNewAddress',{
                userName:this.userName,
                streetName:this.streetName,
                postCode:this.postCode,
                tel:this.tel,
          }).then((request)=>{
              let res = request.data
                if(res.status=='1'){
                      this.$router.push({
                        path:'/address'
                    })
                }else{
                    alert(res.result)
                }
          })
      }
  }
}

</script>
<style>
.box{
    width: 100%;
    font-size: 20px;
}
.box input{
    width: 100%;
    height: 100px;
}
.btn{
    width: 100%;
}
</style>