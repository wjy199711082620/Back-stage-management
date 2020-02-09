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
          <el-form-item label="技术人员名称：">
            <el-input v-model="listQuery.userName" class="input-width" placeholder="技术人员名称"></el-input>
          </el-form-item>
          <el-form-item label="技术人员职业：" label-width="180px">
            <el-select v-model="listQuery.technologyOccupation" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in typeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.activated" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in activatedOptions"
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
      <!--<el-button size="mini" class="btn-add" @click="handleAdd()">添加广告</el-button>-->
    </el-card>
    <div class="table-container">
      <el-table ref="homeAdvertiseTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="技术人员id" width="100" align="center">
          <template slot-scope="scope">{{scope.row.userId}}</template>
        </el-table-column>

        <el-table-column label="技术人员昵称" width="135" align="center">
          <template slot-scope="scope">{{scope.row.realName}}</template>
        </el-table-column>

        <el-table-column label="技术人员头像" width="160" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.userIcon"></template>
        </el-table-column>

        <el-table-column label="技术人员职业" width="160" align="center">
          <template slot-scope="scope">{{scope.row.technologyOccupation | formatType}}</template>
        </el-table-column>

        <el-table-column label="技术人员性别" width="134" align="center">
          <template slot-scope="scope">{{scope.row.technologyGender | genderType}}</template>
        </el-table-column>

        <el-table-column label="技术人员年龄" width="134" align="center">
          <template slot-scope="scope">{{scope.row.technologyAge}}</template>
        </el-table-column>

        <el-table-column label="工作经验" width="120" align="center">
          <template slot-scope="scope">{{scope.row.workExperience}}</template>
        </el-table-column>

        <el-table-column label="联系方式" width="180" align="center">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>

        <el-table-column label="荣耀值" width="140" align="center">
          <template slot-scope="scope">{{scope.row.glory}}</template>
        </el-table-column>

        <el-table-column label="默认状态/推荐状态" width="135" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleUpdateRecommend(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.isRecommend">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="120" align="center">
          <template slot-scope="scope">{{scope.row.activated| activatedType}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">审核
            </el-button>
<!--            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>-->
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
  </div>
</template>
<script>
    import {
        fetchList,
        updateStatus,
        handleUpdateRecommend,
        deleteHomeAdvertise,
        deleteTechnology,
        batchDeleteHomeAdvertise,
        batchDeleteTechnology
    } from '@/api/technology';
    import {formatDate} from '@/utils/date';

    const defaultListQuery = {
        pageNum: 1,
        pageSize: 5,
        userName: null,
        type: null,
        endTime: null,
        activated: null,
        technologyOccupation: null
    };
  const defaultTypeOptions = [
      {
          label: '灯光师',
          value: 1
      },
      {
          label: '音响师',
          value: 2
      },
      {
          label: '视频师',
          value: 3
      },
      {
          label: '项目经理',
          value: 4
      },
      {
          label: '搭建',
          value: 5
      },
      {
          label: '舞美',
          value: 6
      }
  ];

  const defaultActivatedOptions = [
      {
          label: '审核失败',
          value: 2
      },
      {
          label: '审核通过',
          value: 1
      },
      {
          label: '审核中',
          value: 0
      }
  ];

  export default {
    name: 'homeAdvertiseList',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        typeOptions: Object.assign({}, defaultTypeOptions),
        activatedOptions: Object.assign({}, defaultActivatedOptions),
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
        operateType: null
      }
    },
    created() {
      this.getList();
    },
    filters:{
      formatType(type){
        if(type===1){
          return '灯光师 ';
        }else if(type===2){
          return '音响师';
        }else if(type===3){
          return '视频师';
        }else if(type===4){
          return '项目经理';
        }else if(type===5){
          return '搭建';
        }else {
            return '舞美';
        }
      },
        genderType(type) {
            if (type === 1) {
                return '男 ';
            } else {
                return '女';
            }
        },
        activatedType(type) {
            if (type === 0) {
                return '待审核 ';
            } else if (type === 1) {
                return '审核通过';
            } else {
                return '审核不通过';
            }
        },
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
        handleUpdateRecommend(index, row) {

            this.$confirm('是否要修改技术人员推荐状态?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                handleUpdateRecommend(row.userId, {isRecommend: row.isRecommend}).then(response => {
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
        handleDelete(index, row) {

            this.deleteTechnology(row.userId);
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
          ids.push(this.multipleSelection[i].userId);
        }
          console.log(" operateType " + this.operateType);
        if(this.operateType===0){
          //删除
            console.log("进入批量删除！！");
          this.batchDeleteHomeAdvertise(ids);
        }else {
          this.$message({
            message: '请选择批量操作类型',
            type: 'warning',
            duration: 1000
          });
        }
      },
      handleAdd(){
        this.$router.push({path: '/sms/addAdvertise'})
      },
      handleUpdate(index,row){
        this.$router.push({path: '/wms/technologyDetail', query: {userId: row.userId}})
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data;
          this.total = response.total;
        })
      },
      deleteHomeAdvertise(ids){
        this.$confirm('是否要删除该广告?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params=new URLSearchParams();
          params.append("ids",ids);
          deleteHomeAdvertise(params).then(response=>{
            this.getList();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          });
        })
      },
        deleteTechnology(id) {
            this.$confirm('是否要删除该技术人员?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = new URLSearchParams();
                console.log("id+++",id);
                params.append("userId", id);
                deleteTechnology(params).then(response => {
                    this.getList();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                });
            })
        },
      batchDeleteHomeAdvertise(ids){
          this.$confirm('是否要删除这些技术人员?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              let params = new URLSearchParams();
              params.append("userIds",ids);
              batchDeleteTechnology(params).then(response=>{
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
<style scoped>
  .input-width {
    width: 203px;
  }
</style>


