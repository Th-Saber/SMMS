
<template>
    <div class="stockadd">
    <!-- 左侧卡片 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>添加库存</span>
      </div>
      <el-form
        :model="product"
        status-icon
        :rules="rules"
        ref="product"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="商品条形码" prop="mask">
          <el-input type="text" v-model="product.mask" autocomplete="off"/>
          <el-button type="primary" class="addmask">生成条形码</el-button>
        </el-form-item>
          <el-form-item label="数量" prop="librarynum">
          <el-input type="text" v-model="product.librarynum" autocomplete="off" style="width:150px"></el-input>
          <span class="msg" v-show="flag">计重商品单位为千克</span>
        </el-form-item>
        <el-form-item label="进价" prop="purchaseprice" style="margin-top:30px;">
          <el-input
            type="text"
            v-model="product.purchaseprice"
            autocomplete="off"
            style="width:150px"
          ></el-input>&emsp;元
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
      const librarynum = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入商品数量"),this.flag=false);
      } else {
        callback();
        this.flag=true
      }
    };
    return {
      product: {
        mask: "",
        librarynum: "",
        purchaseprice: ""
      },
      flag:true,
      rules: {
        mask: [{ required: true, message: "请生成条形码", trigger: "blur" }],
        librarynum: [
          { required: true, validator: librarynum, trigger: "blur" }
        ],
        purchaseprice: [
          { required: true, message: "请输入商品进价", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    addmask() {},
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var params = {
            mask: this.product.mask,
            purchaseprice: this.product.purchaseprice,
            librarynum: this.product.librarynum
          };
          this.axios
            .post(
              "http://127.0.0.1:666/product/stockadd",
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
                this.$router.push("/stockmanage");
              } else {
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.$message.error("添加商品失败！请仔细核对信息");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less">
.stockadd {
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
        }
      }
    }
  }
}
</style>






