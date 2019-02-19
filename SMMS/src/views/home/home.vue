<template>
  <div class="home">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>系统信息</span>
      </div>
      <el-alert type="success" title>
        <i class="el-icon-success"></i>商品总数5。已经销售的总金额：890.00。库存商品总价：12504.82
      </el-alert>
      <el-alert type="success" title>
        <i class="el-icon-success"></i>导入数据。
      </el-alert>
      <!-- 左右布局 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <!-- 左侧卡片 -->
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>销售排行</span>
              </div>
              <!-- 商品列表 -->
              <el-table :data="productData" stripe style="width: 100%">
                <el-table-column prop="name" label="商品名称"></el-table-column>
                <el-table-column prop="num" label="数量"></el-table-column>
              </el-table>
            </el-card>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <!-- 右侧卡片 -->
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>缺货的商品</span>
              </div>
              <!-- 商品列表 -->
              <el-table :data="OosData" stripe style="width: 100%">
                <el-table-column prop="name" label="商品名称"></el-table-column>
                <el-table-column prop="inventory" label="库存"></el-table-column>
                <!-- 操作 -->
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">入库</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      productData: [
        {
          num: "14",
          name: "海飞丝去屑洗发水"
        },
        {
          num: "18",
          name: "茅台酒"
        },
        {
          num: "9",
          name: "宽窄"
        },
        {
          num: "21",
          name: "张裕解百纳干红"
        }
      ],
      OosData: [
        {
          inventory: "2",
          name: "我的优乐美"
        },
        {
          inventory: "0",
          name: "娃哈哈"
        },
        {
          inventory: "3",
          name: "云烟"
        }
      ]
    };
  },
  methods:{
      handleEdit(){
          alert("入库成功！")
      }
  }
};
</script>
<style lang="less">
.home {
  .box-card {
    .el-card__header {
      text-align: left;
      font-size: 22px;
      font-weight: 500;
    }
    .el-alert {
      font-size: 14px;
      .el-icon-success {
        padding-right: 10px;
      }
    }
    .el-alert:nth-child(1) {
      margin-bottom: 10px;
    }
    .el-row {
      margin-top: 20px;
      padding-bottom: 20px;
    }
  }
}
</style>