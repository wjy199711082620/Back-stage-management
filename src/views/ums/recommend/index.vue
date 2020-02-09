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
          <el-form-item label="商品名称：">
            <el-input v-model="listQuery.productName" class="input-width" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="推荐状态：">
            <el-select v-model="listQuery.activated" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in recommendOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleSelectProduct()">选择商品</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="newProductTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="120" align="center">
          <template slot-scope="scope">{{scope.row.productId}}</template>
        </el-table-column>
        <el-table-column label="商家ID" width="120" align="center">
          <template slot-scope="scope">{{scope.row.userId}}</template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">{{scope.row.productName}}</template>
        </el-table-column>
        <el-table-column label="是否推荐" width="200" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleRecommendStatusChange(scope.$index, scope.row)"
              :active-value="true"
              :inactive-value="false"
              v-model="scope.row.activated">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="160" align="center">
          <template slot-scope="scope">{{scope.row.sortIndex}}</template>
        </el-table-column>
        <el-table-column label="状态" width="160" align="center">
          <template slot-scope="scope">{{scope.row.activated | formatRecommendStatus}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleEditSort(scope.$index, scope.row)">设置排序
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
    <el-dialog title="选择商品" :visible.sync="selectDialogVisible" width="50%">
      <el-form>
<!--        <el-form-item label="商家ID" prop="userId">
          <el-input v-model="dialogData.userId" style="width: 400px" align="right" size="small" placeholder="输入商家ID"></el-input>
        </el-form-item>-->

        <el-form-item label="开始时间：" prop="startTime">
          <el-date-picker
            type="datetime"
            placeholder="选择日期"
            v-model="dialogData.startDate"></el-date-picker>
        </el-form-item>
        <el-form-item label="到期时间：" prop="endTime">
          <el-date-picker
            type="datetime"
            placeholder="选择日期"
            v-model="dialogData.endDate"></el-date-picker>
        </el-form-item>

      </el-form>
      <el-input v-model="dialogData.listQuery.productName"
                style="width: 250px;margin-bottom: 20px"
                size="small"
                placeholder="商品名称搜索" align="right">
        <el-button slot="append" icon="el-icon-search" @click="handleSelectSearch()"></el-button>
      </el-input>

      <el-table :data="dialogData.list"
                @selection-change="handleDialogSelectionChange" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">{{scope.row.productName}}</template>
        </el-table-column>
        <el-table-column label="货号" width="160" align="center">
          <template slot-scope="scope">NO.{{scope.row.productId}}</template>
        </el-table-column>
        <el-table-column label="价格" width="120" align="center">
          <template slot-scope="scope">￥{{scope.row.salePrice}}</template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleDialogSizeChange"
          @current-change="handleDialogCurrentChange"
          layout="prev, pager, next"
          :current-page.sync="dialogData.listQuery.pageNum"
          :page-size="dialogData.listQuery.pageSize"
          :page-sizes="[5,10,15]"
          :total="dialogData.total">
        </el-pagination>
      </div>
      <div style="clear: both;"></div>
      <div slot="footer">
        <el-button  size="small" @click="selectDialogVisible = false">取 消</el-button>
        <el-button  size="small" type="primary" @click="handleSelectDialogConfirm()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置排序"
               :visible.sync="sortDialogVisible"
               width="40%">
      <el-form :model="sortDialogData"
               label-width="150px">
        <el-form-item label="排序：">
          <el-input v-model="sortDialogData.sortIndex" style="width: 200px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="sortDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleUpdateSort" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {fetchList,updateStatus,deleteRecommend,createRecommend,updateRecommend} from '@/api/recommend';
  import {fetchList as fetchProductList} from '@/api/product';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    productName: null,
    activated: null
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
  export default {
    name: 'recommend',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        recommendOptions: Object.assign({}, defaultRecommendOptions),
        list: null,
        total: null,
        listLoading: false,
        multipleSelection: [],
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
          userId:null,
          list: null,
          total: null,
          multipleSelection:[],
          listQuery:{
            productName: null,
            pageNum: 1,
            pageSize: 5
          }
        },
        sortDialogVisible:false,
        sortDialogData:{sortIndex:0,recommendId:null},
        rules: {
              userId: [{ required: true, message: '商家编号不能为空', trigger: 'blur' }]
        },
      }
    },
    created() {
      this.getList();
    },
    filters:{
      formatRecommendStatus(status){
        if(status===true){
          return '推荐中';
        }else{
          return '未推荐';
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
      handleRecommendStatusChange(index,row){
        this.updateRecommendStatus(row.recommendId,row.activated);
      },
      handleDelete(index,row){
        this.deleteProduct(row.recommendId);
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
          ids.push(this.multipleSelection[i].recommendId);
        }
        if (this.operateType === 0) {
          //设为推荐
          this.updateRecommendStatus(ids,true);
        } else if (this.operateType === 1) {
          //取消推荐
          this.updateRecommendStatus(ids,false);
        } else if(this.operateType===2){
          //删除
          this.deleteProduct(ids);
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
      handleDialogSizeChange(val) {
        this.dialogData.listQuery.pageNum = 1;
        this.dialogData.listQuery.pageSize = val;
        this.getDialogList();
      },
      handleDialogCurrentChange(val) {
        this.dialogData.listQuery.pageNum = val;
        this.getDialogList();
      },
      handleDialogSelectionChange(val){
        this.dialogData.multipleSelection = val;
      },
      handleSelectDialogConfirm(){
        if (this.dialogData.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let productIds = [];
        for (let i = 0; i < this.dialogData.multipleSelection.length; i++) {
            productIds.push(this.dialogData.multipleSelection[i].productId);
        }
        this.$confirm('使用要进行添加操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            const start = this.dateUtil(this.dialogData.startDate);
            const end = this.dateUtil(this.dialogData.endDate);

            let params=new URLSearchParams();
            params.append("productIds",productIds);
            params.append("userId",this.dialogData.userId);
            params.append("startDate",start);
            params.append("endDate",end);
          createRecommend(params).then(response=>{
            this.selectDialogVisible=false;
            this.dialogData.multipleSelection=[];
            this.getList();
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
          });
        });
      },
        dateUtil(d){
            d = new Date(d)
            let resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate());
            let resTime = this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds());
            return resDate+' '+resTime;
        }
        ,
        p(s) {
            return s < 10 ? '0' + s : s
        },
      handleEditSort(index,row){
        this.sortDialogVisible=true;
        this.sortDialogData.sortIndex=row.sortIndex;
        this.sortDialogData.recommendId=row.recommendId;
      },
      handleUpdateSort(){
        this.$confirm('是否要修改排序?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateRecommend(this.sortDialogData.recommendId,this.sortDialogData).then(response=>{
            this.sortDialogVisible=false;
            this.getList();
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          });
        })
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data;
          this.total = response.total;
        })
      },
      updateRecommendStatus(ids,status){
        this.$confirm('是否要修改推荐状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params=new URLSearchParams();
          params.append("ids",ids);
          params.append("activated",status);
          updateStatus(params).then(response=>{
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
      deleteProduct(ids){
        this.$confirm('是否要删除该推荐?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params=new URLSearchParams();
          params.append("ids",ids);
          deleteRecommend(params).then(response=>{
            this.getList();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          });
        })
      },
      getDialogList(){
        fetchProductList(this.dialogData.listQuery).then(response=>{
          this.dialogData.list=response.data;
          this.dialogData.total=response.total;
        })
      }
    }
  }
</script>
<style></style>
