<template>
    <div class="passwordmodify">
         <!-- 左侧卡片 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>修改账号密码</span>
      </div>
      <el-form
        :model="modify"
        status-icon
        :rules="rules"
        ref="modify"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="原密码" prop="oldpwd">
          <el-input type="text" v-model="modify.oldpwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newpwd">
          <el-input type="text" v-model="modify.newpwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPwd">
          <el-input type="text" v-model="modify.checkPwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item style="margin-left:-150px;">
          <el-button type="primary" @click="submitForm('modify')">修改</el-button>
          <el-button @click="resetForm('modify')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>


<script>
import qs from "qs"
export default {
  data() {
    // 包含特殊字符的函数
    const checkSpecificKey = str => {
      var specialKey =
        "[`~!#$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
      for (var i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) != -1) {
          return false;
        }
      }
      return true;
    };
    const oldpass = (rule,value,callback)=>{
      if(!value){
        callback(new Error("请输入原密码"))
      }else{
        const username = window.localStorage.getItem("username");
        this.axios.get(`http://127.0.0.1:666/account/checkOldPwd?oldpwd=${value}&username=${username}`)
        .then(response =>{
          let{error_code,reason} = response.data;
          if(error_code===0){
            callback();
          }else{
            callback(new Error(reason))
          }
        })
        .catch(err=>{
          console.log(err)
        })
      }
    }
    //验证新密码
    const newpass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (value.length < 3 || value.length > 6) {
        callback(new Error("密码长度 3 - 6 位"));
      } else if (!checkSpecificKey(value)) {
        callback(new Error("密码不能包含特殊字符"));
      } else {
        if (this.modify.checkPwd !== "") {
          this.$refs.modify.validateField("checkPwd");
        }
        callback();
      }
    };
    //确认新密码
    const checkPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.modify.newpwd) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      modify: {
        oldpwd: "",
        newpwd: "",
        checkPwd: ""
      },
      rules: {
        oldpwd: [
          { required: true,validator: oldpass, trigger: "blur" }
        ],
        newpwd: [{ required: true, validator: newpass, trigger: "blur" }],
        checkPwd: [{ required: true, validator: checkPass, trigger: "blur" }]
      }
    };
  },
  methods: {
    //点击提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params ={
            oldpwd:this.modify.oldpwd,
            newpwd:this.modify.newpwd,
            username:window.localStorage.getItem("username")
          }
          this.axios.post("http://127.0.0.1:666/account/savenewpwd",qs.stringify(params))
          .then(response=>{
            //console.log(response.data)
            let{error_code,reason} = response.data;
            if(error_code===0){
             // 清除token
                window.localStorage.removeItem("token");

                // 弹出提示
                this.$message({
                  type: "success",
                  message: reason
                });
                setTimeout(() => {
                  // 跳转到登录页面
                  this.$router.push("/login");
                }, 1000);
            }else{
              this.$message.error(reason);
            }
          })
          .catch(err =>{
            console.log(err)
          })
        } else {
          this.$message.error("修改失败！请检查输入是否正确")
          return false;
        }
      });
    },
    // 点击重置按钮 触发这个函数
    resetForm(formName) {
      // this.$refs.loginForm.resetFields() 获取整个表单组件 调用重置方法
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="less">
.passwordmodify {
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
          .el-button{
              
          }
        }
      }
    }
  }
}
</style>