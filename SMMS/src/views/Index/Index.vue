<template>
  <div class="index">
    <el-container>
      <el-aside width="200px">
          <Nav></Nav>
      </el-aside>
      <el-container>
        <el-header height="80px">
          <Top></Top>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
        <el-footer height="80px">
          <Bottom></Bottom>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>
<script>
//引入组件
import Nav from "@/components/Nav/Nav.vue";
import Top from "@/components/Top/Top.vue";
import Bottom from "@/components/Bottom/Bottom.vue";
export default {
    components:{//注册主键
        Nav,
        Top,
        Bottom
    }
};
</script>
<style lang="less">
.index {
    height: 100%;
  .el-container {
    height: 100%;
    // 左边导航
    .el-aside {
      background-color: #2d3a4b;
      text-align: center;
    }
    //中间内容
    .el-main {
      background-color: #e9eef3;
      color: #333;
      text-align: center;
    }
    //头部尾部
    .el-header {
      background-color: #fff;
      color: #333;
      line-height: 80px;
    }
    .el-footer {
      background-color: #fff;
      color: #333;
      text-align: left;
      line-height: 80px;
    }
  }
}
</style>
