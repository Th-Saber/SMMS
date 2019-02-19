<template>
  <div class="accountmanage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>账号管理</span>
      </div>
      <!-- 内容部分 -->
      <el-table
        :data="tableData"
        ref="multipleTable"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="username" label="用户名称"></el-table-column>
        <el-table-column prop="usergroup" label="用户组"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{ scope.row.ctime | filterCtime }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
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
      <!-- 回填表单弹出框 -->
      <el-dialog title="修改用户信息" :visible.sync="flag" width="400px">
        <el-form :model="accountEdit" :rules="rules" ref="accountEdit">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="accountEdit.username" autocomplete="off" style="width:250px"></el-input>
          </el-form-item>
          <el-form-item label="用户组" prop="usergroup" label-width="64px">
            <el-select v-model="accountEdit.usergroup" placeholder="请选择用户组" style="width:250px">
              <el-option label="管理员" value="管理员"></el-option>
              <el-option label="普通用户" value="普通用户"></el-option>
              <el-option label="游客" value="游客"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="flag = false">取 消</el-button>
          <el-button type="primary" @click="editSave('accountEdit')">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 批量删除按钮组 -->
      <div style="margin-top: 20px;text-align:left;">
        <el-button @click="batchDelete">批量删除</el-button>
        <el-button @click="cancelSelect()">取消选择</el-button>
      </div>
    </el-card>
  </div>
</template>


<script>
// 引入moment模块
import moment from "moment";
// 引入qs模块
import qs from "qs";
export default {
  data() {
    return {
      tableData: [], //表格数据
      multipleSelection: [], //选中的项目数据
      // 分页数据
      currentPage: 1, // 当前页
      total: 10, // 数据总条数
      pageSize: 3, // 每页条数
      //编辑回填数据
      accountEdit: {
        username: "",
        usergroup: ""
      },
      // 编辑模态框的显示和隐藏
      flag: false,
      editId: 0, //回填的数据id
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 5, message: "账号长度在 3 - 5 位", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    // 自动发送请求 获取所有用户账号数据
    this.getAccountList();
  },
  methods: {
    // 请求数据
    getAccountList() {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      };
      this.axios
        .post(
          "http://127.0.0.1:666/account/accountmanage",
          qs.stringify(params)
        )
        .then(response => {
          //console.log(response.data)
          let { data, total } = response.data;
          this.tableData = data;
          this.total = total;
          if (!data.length && this.currentPage > 1) {
            this.currentPage -= 1;
            this.getAccountList();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //分页
    // 每页多少条
    handlePageSizi(val) {
      //console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getAccountList();
    },
    // 当前页
    handleCurrentPage(val) {
      //console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getAccountList();
    },
    //修改数据
    handleEdit(id) {
      this.editId = id;
      this.axios
        .get(`http://127.0.0.1:666/account/accountedit?id='${id}'`)
        .then(response => {
          let result = response.data[0];
          this.accountEdit.username = result.username;
          this.accountEdit.usergroup = result.usergroup;
          this.flag = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //保存修改
    editSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            username: this.accountEdit.username,
            usergroup: this.accountEdit.usergroup,
            editId: this.editId
          };
          this.axios
            .post(
              `http://127.0.0.1:666/account/accounteditsave`,
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
                this.getAccountList();
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
    //删除数据
    handleDelete(id) {
      this.$confirm("是否删除该数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .get(`http://127.0.0.1:666/account/accountdelete?id='${id}'`)
            .then(response => {
              let { error_code, reason } = response.data;
              if (error_code === 0) {
                this.$message({
                  message: reason,
                  type: "success"
                });
                //跳转到主页面
                this.getAccountList();
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
    },
    //批量删除
    batchDelete() {
      let selectedId = this.multipleSelection.map(v => v.id);
      if (!selectedId.length) {
        this.$message({
          message: "请勾选后再进行操作！",
          type: "warning"
        });
        return;
      }
      this.$confirm("此操作将删除所选中的数据，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .get(`http://127.0.0.1:666/account/accountbatchDelete`, {
              params: {
                selectedId
              }
            })
            .then(response => {
              console.log(response.data);
              let { error_code, reason } = response.data;
              if (error_code === 0) {
                this.$message({
                  message: reason,
                  type: "success"
                });
                //刷新页面数据
                this.getAccountList();
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
    },
    // 取消选择
    cancelSelect() {
      this.$refs.multipleTable.clearSelection();
    },
    //选项改变
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
  // 过滤器
  filters: {
    // 过滤时间的函数
    filterCtime(ctime) {
      return moment(ctime).format("YYYY/MM/DD HH:mm:ss");
    }
  }
};
</script>
<style lang="less">
.accountmanage {
  .box-card {
    .el-card__header {
      text-align: left;
      font-size: 22px;
      font-weight: 500;
    }
    .el-dialog {
      .el-form-item {
        .el-form-item__error {
          margin-left: 88px;
        }
      }
    }
  }
}
</style>