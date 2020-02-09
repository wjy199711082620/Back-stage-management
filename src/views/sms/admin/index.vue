<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
		  </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="用户名：">
            <el-input v-model="listQuery.adminName" class="input-width" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item label="角色：">
            <el-select v-model="listQuery.roleId" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in roleOptions"
                         :key="item.roleId"
                         :label="item.roleName"
                         :value="item.roleId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
	   <el-button size="mini" class="btn-add" @click="handleAdd()">添加管理员</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="newProductTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="120" align="center">
          <template slot-scope="scope">{{scope.row.adminId}}</template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">{{scope.row.adminName}}</template>
        </el-table-column>
        <el-table-column label="描述" width="160" align="center">
          <template slot-scope="scope">{{scope.row.description}}</template>
        </el-table-column>
        <el-table-column label="账号" align="center">
          <template slot-scope="scope">{{scope.row.account}}</template>
        </el-table-column>
		<el-table-column label="角色" align="center">
          <template slot-scope="scope">{{scope.row.roleId | formatRole}}</template>

        </el-table-column>
        <el-table-column label="联系方式" width="160" align="center">
          <template slot-scope="scope">{{scope.row.mobile}}</template>
        </el-table-column>

        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog title="添加/修改 管理员"
               :visible.sync="sortDialogVisible"
               width="40%">
      <el-form :model="sortDialogData"
               label-width="100px">

		<el-form-item label="姓名：">
          <el-input v-model="sortDialogData.adminName" style="width: 400px"></el-input>
        </el-form-item>
		 <el-form-item label="邮箱：">
          <el-input v-model="sortDialogData.email" style="width: 400px"></el-input>
        </el-form-item>
		 <el-form-item label="账号：">
          <el-input v-model="sortDialogData.account" style="width: 400px"></el-input>
        </el-form-item>
		 <el-form-item label="密码：">
          <el-input v-model="sortDialogData.password" style="width: 400px"></el-input>
        </el-form-item>
		<el-form-item label="手机号：">
          <el-input v-model="sortDialogData.mobile" style="width: 400px"></el-input>
        </el-form-item>
		 <el-form-item label="部门ID：">
          <el-input v-model="sortDialogData.deptId" style="width: 400px"></el-input>
        </el-form-item>
		 <el-form-item label="角色：">
		  <el-select v-model="sortDialogData.roleId" placeholder="全部" clearable class="input-width" style="width: 400px">
              <el-option v-for="item in roleOptions"
                         :key="item.roleId"
                         :label="item.roleName"
                         :value="item.roleId">
              </el-option>
            </el-select>
        </el-form-item>
		 <el-form-item label="昵称：">
          <el-input v-model="sortDialogData.nickName" style="width: 400px"></el-input>
        </el-form-item>

		<el-form-item label="描述：">
          <el-input
          class="input-width"
          type="textarea"
          :rows="2"
          placeholder="请输入描述内容"
          v-model="sortDialogData.description" style="width: 400px">
        </el-input>
		</el-form-item>

      </el-form>
      <span slot="footer">
        <el-button @click="sortDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
    import {fetchList as fetchAdminList, createAdmin, updateAdmin, deleteAdmin} from '@/api/admin';
    import {allRole} from '@/api/role' ;
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    adminName: null,
      roleId: null
  };
  const defaultRecommendOptions = [
    {
      label: '未推荐',
      value: 0
    },
    {
      label: '推荐中',
      value: 1
    }
  ];
  const defaultTypeOptions=[
      {
          label: '财务管理员',
          value: 1
      },
      {
          label: '运营管理员',
          value: 2
      },
      {
          label: '超级管理员',
          value: 3
      }
      ];
   const defaultFlashPromotion = {
	id: null,
    title: null,
    startDate: null,
    endDate: null,
    status: 0
  };
  export default {
    name: 'hotProductList',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        recommendOptions: Object.assign({}, defaultRecommendOptions),
        list: null,
        total: null,
        listLoading: false,
		multipleSelection: [],
		roleOptions:[],
        operates: [
          {
            label: "设为推荐",
            value: 0
          },
          {
            label: "取消推荐",
            value: 1
          },
          {
            label: "删除",
            value: 2
          }
        ],
        operateType: null,
        selectDialogVisible:false,
        dialogData:{
          list: null,
          total: null,
          multipleSelection:[],
          listQuery:{
            keyword: null,
            pageNum: 1,
            pageSize: 5
          }
        },
        sortDialogVisible:false,
        sortDialogData:Object.assign({}, defaultFlashPromotion)
      }
    },
    created() {
	  this.getList();
        allRole().then(response=>{
            this.roleOptions =response.data;
        })
    },
    filters:{

      formatRecommendStatus(status){
        if(status===1){
          return '已处理';
        }else{
          return '未处理';
        }
      },
        formatRole(type){
            for(let i=0;i<defaultTypeOptions.length;i++){
                if(type===defaultTypeOptions[i].value){
                    return defaultTypeOptions[i].label;
                }
            }
            return '';
        },

      formatReportType(type){
        if(type===1){
          return '违法行为';
        }else if(type===2){
          return '涉黄';
        }else{
          return '其他';
        }
      }

    },
    methods: {
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleDelete(index,row){
        this.deleteAdmin(row.id);
      },
      handleBatchOperate(){
        if (this.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        if (this.operateType === 0) {
          //设为推荐
          this.updateRecommendStatusStatus(ids,1);
        } else if (this.operateType === 1) {
          //取消推荐
          this.updateRecommendStatusStatus(ids,0);
        } else if(this.operateType===2){
          //删除
          this.deleteAdmin(ids);
        }else {
          this.$message({
            message: '请选择批量操作类型',
            type: 'warning',
            duration: 1000
          });
        }
      },
      handleSelectProduct(){
        this.selectDialogVisible=true;
        this.getDialogList();
      },
      handleSelectSearch(){
        this.getDialogList();
      },
      handleAdd(index,row){
		this.sortDialogVisible=true;
        this.isEdit = false;
        this.sortDialogData = Object.assign({},defaultFlashPromotion);
	  },
	   handleUpdate(index, row) {
       this.sortDialogVisible=true;
        this.isEdit = true;
        this.sortDialogData = Object.assign({},row);
      },
      handleDialogConfirm(){
       this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.isEdit) {

            updateAdmin(this.sortDialogData.adminId,this.sortDialogData).then(response => {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.sortDialogVisible =false;
              this.getList();
            })
          } else {

            createAdmin(this.sortDialogData).then(response => {
              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              this.sortDialogVisible =false;
              this.getList();
            })
          }
        })
      },
      getList() {
        this.listLoading = true;
        fetchAdminList(this.listQuery).then(response => {
         this.listLoading = false;
          this.list = response.data;
          this.total = response.total;
        })
      },
      updateRecommendStatusStatus(ids,status){
        this.$confirm('是否要修改推荐状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params=new URLSearchParams();
          params.append("ids",ids);
          params.append("recommendStatus",status);
          updateRecommendStatus(params).then(response=>{
            this.getList();
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'success',
            message: '已取消操作!'
          });
          this.getList();
        });
      },
      deleteAdmin(ids){
        this.$confirm('是否要删除该管理员?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params=new URLSearchParams();
          params.append("ids",ids);
            deleteAdmin(params).then(response=>{
            this.getList();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          });
        })
	  },
    }
  }
</script>
<style></style>
