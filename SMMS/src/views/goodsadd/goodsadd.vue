<template>
    <div class="goodsadd">
    <!-- 左侧卡片 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>添加商品</span>
      </div>
      <el-form
        :model="product"
        status-icon
        :rules="rules"
        ref="product"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="所属分类" prop="classify">
          <el-select v-model="product.classify" placeholder="选择分类">
            <el-option label="食品" value="食品"></el-option>
            <el-option label="洗护用品" value="洗护用品"></el-option>
            <el-option label="烟酒" value="烟酒"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品条形码" prop="mask">
          <el-input type="text" v-model="product.mask" autocomplete="off"/>
          <el-button type="primary" class="addmask">生成条形码</el-button>
        </el-form-item>
        <el-form-item label="商品名称" prop="productname">
          <el-input
            type="text"
            v-model="product.productname"
            autocomplete="off"
            style="width:150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品售价" prop="productprice">
          <el-input
            type="text"
            v-model="product.productprice"
            @click="marketprice"
            autocomplete="off"
            style="width:150px"
          ></el-input>&emsp;元
        </el-form-item>
        <el-form-item label="市场价" prop="marketprice">
          <el-input
            type="text"
            v-model="product.marketprice"
            
            autocomplete="off"
            style="width:150px"
          ></el-input>&emsp;元
          <span class="msg">默认市场价为售价的1.2倍</span>
        </el-form-item>
        <el-form-item label="商品进价" prop="purchaseprice" style="margin-top:30px;">
          <el-input
            type="text"
            v-model="product.purchaseprice"
            autocomplete="off"
            style="width:150px"
          ></el-input>&emsp;元
        </el-form-item>
        <el-form-item label="入库数量" prop="librarynum">
          <el-input type="text" v-model="product.librarynum" autocomplete="off" style="width:150px"></el-input>
          <span class="msg">计重商品单位为千克</span>
        </el-form-item>
        <el-form-item label="商品重量" prop="purchaseweight" style="margin-top:30px;">
          <el-input
            type="text"
            v-model="product.purchaseweight"
            autocomplete="off"
            style="width:150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品单位" prop="purchaseunit">
          <el-input
            type="text"
            v-model="product.purchaseunit"
            autocomplete="off"
            style="width:150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="会员优惠">
          <el-radio-group v-model="product.discounts">
            <el-radio label="享受"></el-radio>
            <el-radio label="不享受"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否促销" :prop="promotionpriceshow()">
          <el-radio-group v-model="product.promotion">
            <el-radio label="启用"></el-radio>
            <el-radio label="禁用"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="促销价" prop="promotionprice" v-show="flag">
          <el-input
            type="text"
            v-model="product.promotionprice"
            autocomplete="off"
            style="width:150px"
          ></el-input>&emsp;元
        </el-form-item>
        <el-form-item label="商品简介">
          <el-input type="textarea" v-model="product.productmsg"></el-input>
          <span class="msg">不超过两百个汉字</span>
        </el-form-item>
        <el-form-item style="margin-top:30px;">
          <el-button type="primary" @click="submitForm('product')">添加</el-button>
          
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>


<script>
import qs from "qs";
export default {
  data() {
    return {
      product: {
        classify: "",
        mask: "",
        productname: "",
        productprice: "",
        marketprice: "",
        purchaseprice: "",
        librarynum: "",
        purchaseweight: "",
        purchaseunit: "",
        discounts: "",
        promotion: "",
        promotionprice:"",
        productmsg: ""
      },
      flag:true,
      rules: {
        classify: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        mask: [{ required: true, message: "请生成条形码", trigger: "blur" }],
        productname: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        productprice: [
          { required: true, message: "请输入商品售价", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    promotionpriceshow(){
      if(this.product.promotion==="启用"){
        this.flag = true;
      }else{
        this.flag = false;
      }
    },
    addmask() {},
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var params = {
            classify: this.product.classify,
            mask: this.product.mask,
            productname: this.product.productname,
            productprice: this.product.productprice,
            marketprice: this.product.marketprice,
            purchaseprice: this.product.purchaseprice,
            librarynum: this.product.librarynum,
            purchaseweight: this.product.purchaseweight,
            purchaseunit: this.product.purchaseunit,
            discounts: this.product.discounts,
            promotion: this.product.promotion,
            promotionprice: this.product.promotionprice,
            productmsg: this.product.productmsg
          };
          this.axios
            .post(
              "http://127.0.0.1:666/product/goodsadd",
              qs.stringify(params)
            )
            .then(response => {
              let { error_code, reason } = response.data;
              if (error_code === 0) {
                this.$message({
                  message: reason,
                  type: "success"
                });
                //跳转到主页面
                this.$router.push("/goodsmanage");
              } else {
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.$message.error("添加账户失败！请仔细核对信息");
          return false;
        }
      });
    }
  },
  //计算属性
  computed: {
    //输入单价的时候自动回填市场价
    marketprice(){
      let newPrice = this.product.productprice*1.2;
      newPrice = newPrice.toFixed(2);
      return this.product.marketprice= newPrice;
    },
  }
};
</script>
<style lang="less">
.goodsadd {
  .box-card {
    .el-card__header {
      text-align: left;
      font-size: 22px;
      font-weight: 500;
    }
    .el-card__body {
      .el-form {
        width: 400px;
        .el-form-item {
          text-align: left;
          width: 400px;
          position: relative;
          .el-input__inner {
          }
          .el-select {
            width: 150px;
          }
          .addmask {
            position: absolute;
            right: -120px;
            top: 0;
          }
          .msg {
            position: absolute;
            bottom: -30px;
            left: 0;
            color: rgb(146, 141, 141);
          }
          .el-button {
          }
        }
      }
    }
  }
}
</style>