<template>
  <div class="stockmanage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>库存管理</span>
      </div>
      <el-row>
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <el-select v-model="manage.classify" placeholder="选择分类">
              <el-option label="食品" value="food"></el-option>
              <el-option label="洗护用品" value="clean"></el-option>
              <el-option label="香烟" value="smoke"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">
            <el-form
              :model="manage"
              status-icon
              ref="manage"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="关键字：" prop="search">
                <el-input
                  type="text"
                  v-model="manage.search"
                  autocomplete="off"
                  style="width:300px"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="grid-content bg-purple" style="line-height:40px">(商品名称，条形码)&nbsp;
            <el-button type="primary" @click="search">查询</el-button>
          </div>
        </el-col>
      </el-row>

      <hr>
      <!-- 商品列表 -->
      <el-table :data="productData" stripe style="width: 100%">
        <el-table-column prop="mask" label="商品条形码"></el-table-column>
        <el-table-column prop="productname" label="商品名称"></el-table-column>
        <el-table-column prop="purchaseprice" label="进价"></el-table-column>
         <el-table-column prop="promotionprice" label="入库"></el-table-column>
        <el-table-column prop="librarynum" label="库存"></el-table-column>
       
        <el-table-column prop="productprice" label="已售"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="productEdit(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" @click="productDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="text-algin:left">
        <el-pagination
          @size-change="handlePageSizi"
          @current-change="handleCurrentPage"
          :current-page="currentPage"
          :page-sizes="[1, 3, 5, 10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <!-- 回填表单框 -->
      <el-dialog title="修改用户信息" :visible.sync="flag" width="450px">
        <el-form
          label-position="right"
          label-width="80px"
          :model="productEditData"
          ref="productEditData"
        >
          <el-form-item label="条形码">
            <el-input v-model="productEditData.mask" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="商品名">
            <el-input v-model="productEditData.productname" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-select v-model="productEditData.classify" placeholder="请选择分类">
              <el-option label="食品" value="食品"></el-option>
              <el-option label="洗护用品" value="洗护用品"></el-option>
              <el-option label="烟酒" value="烟酒"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="售价">
            <el-input v-model="productEditData.productprice" style="width:200px"></el-input>&emsp;元
          </el-form-item>
          <el-form-item label="促销价">
            <el-input v-model="productEditData.promotionprice" style="width:200px"></el-input>&emsp;元
          </el-form-item>
          <el-form-item label="市场价">
            <el-input v-model="productEditData.marketprice" style="width:200px"></el-input>&emsp;元
          </el-form-item>
          <el-form-item label="库存">
            <el-input v-model="productEditData.librarynum" style="width:200px"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="flag = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit('productEditData')">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      //搜索数据
      manage: {
        classify: "",
        search: ""
      },
      flag: false, //编辑回填框显示隐藏
      productData: [], //页面请求数据
      currentPage: 1, //当前页码
      pageSize: 3, //每页显示条数
      total: 0, //数据总条数
      //编辑回填数据
      productEditData: {
        //id:v.id,
        mask: "",
        classify: "",
        productname: "",
        productprice: "",
        marketprice: "",
        librarynum: "",
        promotionprice: ""
      },
      editId: 0, //回填的数据id
      //表单验证规则
      rules: {
        classify: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        mask: [{ required: true, message: "请输入条形码", trigger: "blur" }],
        productname: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        productprice: [
          { required: true, message: "请输入商品售价", trigger: "blur" }
        ]
      }
    };
  },
  //生命周期
  created() {
    // 自动发送请求 获取所有用户账号数据
    this.getProductList();
  },
  methods: {
    //请求列表显示
    getProductList() {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      };
      this.axios
        .post("http://127.0.0.1:666/product/goodslist", qs.stringify(params))
        .then(response => {
          let { dataArr, total } = response.data;
          console.log(dataArr)
          this.productData = dataArr;
          this.total = total;
          if (!dataArr.length && this.currentPage > 1) {
            this.currentPage -= 1;
            this.getProductList();
          } else {
            this.$message.error(reason);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //分页
    handlePageSizi(val) {
      //console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getProductList();
    },
    handleCurrentPage(val) {
      this.currentPage = val;
      this.getProductList();
    },
    //查询
    search() {
      alert("查询");
    },
    //编辑
    productEdit(id) {
      this.axios
        .get(`http://127.0.0.1:666/product/goodsedit?id=${id}`)
        .then(response => {
          console.log(response.data[0]);
          let {
            mask,
            classify,
            productname,
            productprice,
            marketprice,
            librarynum,
            promotionprice
          } = response.data[0];

          this.productEditData.mask = mask;
          this.productEditData.classify = classify;
          this.productEditData.productname = productname;
          this.productEditData.productprice = productprice;
          this.productEditData.marketprice = marketprice;
          this.productEditData.librarynum = librarynum;
          this.productEditData.promotionprice = promotionprice;

          this.flag = true;
          this.editId = id;
        })

        .catch(err => {
          console.log(err);
        });
    },
    //保存修改
    saveEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            mask: this.productEditData.mask,
            classify: this.productEditData.classify,
            productname: this.productEditData.productname,
            productprice: this.productEditData.productprice,
            marketprice: this.productEditData.marketprice,
            librarynum: this.productEditData.librarynum,
            promotionprice: this.productEditData.promotionprice,
            editId: this.editId
          };
          this.axios
            .post(
              `http://127.0.0.1:666/product/goodseditsave`,
              qs.stringify(params)
            )
            .then(response => {
              let { error_code, reason } = response.data;
              if (error_code === 0) {
                this.$message({
                  message: reason,
                  type: "success"
                });
                //刷新页面
                this.getProductList();
              } else {
                this.$message.error(reason);
              }
              //关闭数据回填框
              this.flag = false;
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    //删除
    productDelete(id) {
      this.$confirm("是否删除该数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .get(`http://127.0.0.1:666/product/goodsdelete?id='${id}'`)
            .then(response => {
              let { error_code, reason } = response.data;
              if (error_code === 0) {
                this.$message({
                  message: reason,
                  type: "success"
                });
                //刷新商品列表页面
                this.getProductList();
              } else {
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
<style lang="less">
.stockmanage {
  .box-card {
    .el-row {
      text-align: left;
    }
    hr {
      border: 2px solid #ccc;
    }
    .el-card__header {
      text-align: left;
      font-size: 22px;
      font-weight: 500;
    }
    .el-dialog {
      .el-dialog__body {
        text-align: left;
        .el-form {
          .el-input {
            -width: 300px;
          }
          .el-input--suffix {
            width: 200px;
          }
        }
      }
    }
  }
}
</style>




  





