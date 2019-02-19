<template>
  <div class="accountadd">
    <!-- 左侧卡片 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>添加管理员账号</span>
      </div>
      <el-form
        :model="add"
        status-icon
        :rules="rules"
        ref="add"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="username">
          <el-input type="text" v-model="add.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="text" v-model="add.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPwd">
          <el-input type="text" v-model="add.checkPwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择用户组" prop="usergroup">
          <el-select v-model="add.usergroup" placeholder="请选择用户组">
            <el-option label="管理员" value="管理员"></el-option>
            <el-option label="普通用户" value="普通用户"></el-option>
            <el-option label="游客" value="游客"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btngroup">
          <el-button type="primary" @click="submitForm('add')">添加</el-button>
          <el-button @click="resetForm('add')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
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
        if (this.add.checkPwd !== "") {
          this.$refs.add.validateField("checkPwd");
        }
        callback();
      }
    };
    const checkPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.add.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      add: {
        username: "",
        password: "",
        checkPwd: "",
        usergroup: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 5, message: "账号长度在 3 - 5 位", trigger: "blur" }
        ],
        password: [{ required: true, validator: pass, trigger: "blur" }],
        checkPwd: [{ required: true, validator: checkPass, trigger: "blur" }],
        usergroup: [
          { required: true, message: "请选择用户组", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var params = {
            username: this.add.username,
            password: this.add.password,
            usergroup: this.add.usergroup
          };
          this.axios
            .post(
              "http://127.0.0.1:666/account/accountadd",
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
                this.$router.push("/accountmanage");
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
.accountadd {
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
          .el-select {
            margin-left: -150px;
            width: 150px;
          }
        }
        .btngroup {
          .el-form-item__content {
            margin-left: -50px !important;
          }
        }
      }
    }
  }
}
</style>

