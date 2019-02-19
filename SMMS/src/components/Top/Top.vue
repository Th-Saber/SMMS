<template>
  <div class="top">
    <el-row>
      <el-col :span="12">
        <div class="title">
          <i class="el-icon-menu"></i>
          华联超市管理系统
        </div>
      </el-col>
      <el-col :span="12">
        <div class="top-right">
          <el-row>
            <el-col :span="18">欢迎您!
              <el-dropdown @command="handleCommand">
                <!-- 名字 -->
                <span class="username el-dropdown-link">
                  {{ username }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <!-- 下拉菜单 -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                  <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
            <el-col :span="6">
              <div class="avatar">
                <img width="100%" height="100%" :src="imgUrl">
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgUrl: "http://127.0.0.1:8080/timg.jpg",
      username: ""
    };
  },
  methods: {
    handleCommand(command) {
      // 如果点击的是退出
      if (command === "logout"){
        // 清除token
        window.localStorage.removeItem("token");
        // 弹出提示
        this.$message({
          type: "success",
          message: "退出登陆成功！"
        });
        setTimeout(() => {
          // 跳转到登录页面
          this.$router.push("/login");
        }, 500);
      }
    }
  },
  created() {
    // 显示当前登录的用户
    this.username = window.localStorage.getItem("username");
  }
};
</script>

<style lang="less">
.top {
  // background-color: red;
  border-bottom: 2px solid green;
  .title {
    text-align: left;
    font-size: 28px;
    font-weight: 600;
  }
  .top-right {
    color: #2d3a4b;
    text-align: right;
    .username {
      font-weight: 600;
      font-size: 18px;
    }
    .avatar {
      width: 60px;
      height: 60px;
      margin-top: 12px;
      margin-left: 30px;
      border-radius: 50%;
      img {
        border-radius: 50%;
      }
    }
  }
}
</style>


