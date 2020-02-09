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
          <el-form-item label="权限名称：">
            <el-input v-model="listQuery.authorityName" class="input-width" placeholder="权限名称"></el-input>
          </el-form-item>
          <el-form-item label="广告位置：">
            <el-select v-model="listQuery.type" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in typeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="到期时间：">
            <el-date-picker
              class="input-width"
              v-model="listQuery.endTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()">添加权限</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="homeAdvertiseTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="120" align="center">
          <template slot-scope="scope">{{scope.row.authorityId}}</template>
        </el-table-column>
        <el-table-column label="权限名称" align="center">
          <template slot-scope="scope">{{scope.row.pageName}}</template>
        </el-table-column>
        <el-table-column label="权限标识"  align="center">
          <template slot-scope="scope">{{scope.row.pageNameEn}}</template>
        </el-table-column>
        <el-table-column label="请求url"  align="center">
          <template slot-scope="scope">{{scope.row.pageUrl}}</template>
        </el-table-column>
		<el-table-column label="父节点"  align="center">
          <template slot-scope="scope">{{scope.row.parentId}}</template>
        </el-table-column>
		<el-table-column label="层级"  align="center">
          <template slot-scope="scope">{{scope.row.level}}</template>
        </el-table-column>
        <el-table-column label="状态" width="120" align="center">
          <template slot-scope="scope">{{scope.row.activated}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
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
	 <el-dialog title="添加/修改 权限"
               :visible.sync="authorityVisible"
               width="40%">
      <el-form :model="authorityDialogData"
               label-width="100px">

		<el-form-item label="权限名称：">
          <el-input v-model="authorityDialogData.pageName" style="width: 400px"></el-input>
        </el-form-item>
		 <el-form-item label="权限标识：">
          <el-input v-model="authorityDialogData.pageNameEn" style="width: 400px"></el-input>
        </el-form-item>
		 <el-form-item label="请求url：">
          <el-input v-model="authorityDialogData.pageUrl" style="width: 400px"></el-input>
        </el-form-item>
		 <el-form-item label="父节点：">
          <el-input v-model="authorityDialogData.parentId" style="width: 400px"></el-input>
        </el-form-item>
		<el-form-item label="层级：">
          <el-input v-model="authorityDialogData.level" style="width: 400px"></el-input>
        </el-form-item>
		 <el-form-item label="状态：">
          <el-input v-model="authorityDialogData.activated" style="width: 400px"></el-input>
        </el-form-item>
		<el-form-item label="描述：">
          <el-input
          class="input-width"
          type="textarea"
          :rows="2"
          placeholder="请输入描述内容"
          v-model="authorityDialogData.description" style="width: 400px">
        </el-input>
		</el-form-item>

      </el-form>
      <span slot="footer">
        <el-button @click="authorityVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {fetchList,createAuthority,updateAuthority,deleteAuthority} from '@/api/authority';
  import {formatDate} from '@/utils/date';
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    name: null,
    type: null,
    endTime:null
  };
  const defaultTypeOptions = [
    {
      label: 'PC首页轮播',
      value: 0
    },
    {
      label: 'APP首页轮播',
      value: 1
    }
  ];
   const defaultAuthorityPromotion = {
	id: null,
    title: null,
    startDate: null,
    endDate: null,
    status: 0
  };
  export default {
    name: 'homeAuthorityList',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        typeOptions: Object.assign({}, defaultTypeOptions),
        list: null,
        total: null,
        listLoading: false,
        multipleSelection: [],
        operates: [
          {
            label: "删除",
            value: 0
          }
        ],
        operateType: null,
	  authorityVisible:false,
      authorityDialogData:Object.assign({}, defaultAuthorityPromotion)
	  }
    },
    created() {
      this.getList();
    },
    filters:{
      formatTime(time){
        if(time==null||time===''){
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
    },
    methods: {
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
	  },
	  handleAdd(index,row){
		this.authorityVisible=true;
        this.isEdit = false;
        this.authorityDialogData = Object.assign({},defaultAuthorityPromotion);
	  },
	   handleUpdate(index, row) {
       this.authorityVisible=true;
        this.isEdit = true;
        this.authorityDialogData = Object.assign({},row);
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
        this.deleteHomeAdvertise(row.bannerId);
	  },
	   handleDialogConfirm(){
       this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.isEdit) {

            updateAuthority(this.authorityDialogData.authorityId,this.authorityDialogData).then(response => {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.authorityVisible =false;
              this.getList();
            })
          } else {

            createAuthority(this.authorityDialogData).then(response => {
              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              this.authorityVisible =false;
              this.getList();
            })
          }
        })
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
        if(this.operateType===0){
          //删除
          this.deleteHomeAdvertise(ids);
        }else {
          this.$message({
            message: '请选择批量操作类型',
            type: 'warning',
            duration: 1000
          });
        }
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data;
          this.total = response.total;
        })
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>


