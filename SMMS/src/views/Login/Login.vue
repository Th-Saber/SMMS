<template>
  <div class="login">
    <div class="login-wrapper">
      <!-- 登录标题 -->
      <h1 class="title">
        <i class="el-icon-menu"></i>
        华联超市管理系统-登陆
      </h1>
      <el-form
        :model="login"
        status-icon
        :rules="rules"
        ref="login"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="username">
          <el-input type="text" v-model="login.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="text" v-model="login.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPwd">
          <el-input type="text" v-model="login.checkPwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('login')">登陆</el-button>
          <el-button @click="resetForm('login')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import qs from "qs";
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
    const pass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 3 || value.length > 6) {
        callback(new Error("密码长度 3 - 6 位"));
      } else if (!checkSpecificKey(value)) {
        callback(new Error("密码不能包含特殊字符"));
      } else {
        if (this.login.checkPwd !== "") {
          console.log("111");
          this.$refs.login.validateField("checkPwd");
        }
        callback();
      }
    };
    const checkPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.login.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      login: {
        username: "",
        password: "",
        checkPwd: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 5, message: "账号长度在 3 - 5 位", trigger: "blur" }
        ],
        password: [{ required: true, validator: pass, trigger: "blur" }],
        checkPwd: [{ required: true, validator: checkPass, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            username: this.login.username,
            password: this.login.password
          };
          this.axios.post("http://127.0.0.1:666/login/loginCheck",qs.stringify(params))
          .then(response=>{
            let {error_code,reason,token,username} = response.data;
            if(error_code===0){
              //把令牌储存到本地浏览器里面
              window.localStorage.setItem('token', token);
              window.localStorage.setItem('username', username);
              this.$message({
                message: reason,
                type: "success"
              });
              //跳转到主页面
              this.$router.push("/");
            }else{
              this.$message.error(reason)
            }
          })
          .catch(err=>{
            console.log(err)
          })
        
        } else {
          this.$message.error("登陆失败！请检查用户名密码");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created(){
    this.login.username = window.localStorage.getItem("username")
  }
};
</script>
<style lang="less">
    
    .login{
      height: 100%;
      width: 100%;
      background-color: #2d3a4b;
      .login-wrapper {
        width: 500px;
        height: 350px;
        border-radius: 8px;
        background-color: rgba(0, 0, 0, 0.2);
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        padding: 30px 50px 0 10px;
        .title {
          font-size: 20px;
          margin-left: 60px;
          margin-bottom: 20px;
          color: #ffffff;
        }
        .el-form {
          .el-form-item {
            .el-form-item__label {
              color: #ffffff;
            }
          }
        }
      }
    }
</style>
