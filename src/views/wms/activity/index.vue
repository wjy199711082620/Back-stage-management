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
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px" >
          <el-form-item label="活动名称：">
            <el-input v-model="listQuery.activityTheme" class="input-width" placeholder="活动名称"></el-input>
          </el-form-item>

          <el-form-item label="活动状态：">
            <el-select v-model="listQuery.activated" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in activityTypeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="是否免费：">
            <el-select v-model="listQuery.isFree" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in activityFreeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="活动类型：">
            <el-select v-model="listQuery.activityType" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in activityTypeOptions"
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
      <!--<el-button size="mini" class="btn-add" @click="handleAdd()">添加活动</el-button>-->
    </el-card>
    <div class="table-container">
      <el-table ref="homeAdvertiseTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="活动id" width="100" align="center">
          <template slot-scope="scope">{{scope.row.activityId}}</template>
        </el-table-column>

        <el-table-column label="活动主题" width="220" align="center">
          <template slot-scope="scope">{{scope.row.activityName}}</template>
        </el-table-column>

        <el-table-column label="活动封面" width="200" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.activityIcon"></template>
        </el-table-column>

        <el-table-column label="活动报名费用" width="112" align="center">
          <template slot-scope="scope">
            {{scope.row.signUpPrice}}元
          </template>
        </el-table-column>

        <el-table-column label="活动时间" width="310" align="center">
            <template slot-scope="scope">{{scope.row.activityStartTime|formatTime}}  至  {{scope.row.activityEndTime|formatTime}}</template>
        </el-table-column>

        <el-table-column label="活动地址" width="200" align="center">
            <template slot-scope="scope">{{scope.row.activityLocation}}</template>
        </el-table-column>

        <el-table-column label="活动咨询电话" width="120" align="center">
            <template slot-scope="scope">{{scope.row.activityPhone}}</template>
        </el-table-column>

        <el-table-column label="活动报名人数" width="100" align="center">
            <template slot-scope="scope">{{scope.row.signUpCount}}</template>
        </el-table-column>

        <el-table-column label="活动状态" width="130" align="center">
            <template slot-scope="scope">{{scope.row.activityStatus | formatStatus}}</template>
        </el-table-column>

        <el-table-column label="操作" width="130"  align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleUpdate(scope.$index, scope.row)"
              circle></el-button>
<!--            <el-button size="mini"
                       @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>-->
<!--            <el-button size="mini"
                       type="danger"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>-->
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)"
              circle>
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
  </div>
</template>
<script>
    import {
        fetchList,
        handleUpdateRecommend,
        deleteHomeAdvertise,
        deleteActivity,
        batchDeleteCompany
    } from '@/api/activity';
    import {formatDate} from '@/utils/date';

    const defaultListQuery = {
        pageNum: 1,
        pageSize: 5,
        activated: null,
        activityTheme: null,
        isFree: null,
        activityType: null,
        companyId: null
    };

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
    const defaultFreeOptions = [
        {
            label: '免费',
            value: 1
        },
        {
            label: '不免费',
            value: 0
        }
    ];
    const defaultActivityTypeOptions = [
        {
            label: '截止报名',
            value: 3
        }, {
            label: '已结束',
            value: 2
        }, {
            label: '正在进行',
            value: 1
        },
        {
            label: '未开始',
            value: 0
        }
    ];

  export default {
    name: 'homeAdvertiseList',
    data() {
        return {
            listQuery: Object.assign({}, defaultListQuery),
            activatedOptions: Object.assign({}, defaultActivatedOptions),
            activityFreeOptions: Object.assign({}, defaultFreeOptions),
            activityTypeOptions: Object.assign({}, defaultActivityTypeOptions),
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
        formatTime(time) {
            if (time == null || time === '') {
                return 'N/A';
            }
            let date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
        },
        formatStatus(activityStatus) {
            if (activityStatus === 0) {
                return '未开始';
            } else if (activityStatus === 1) {
                return '正在进行';
            } else if (activityStatus === 2) {
                return '已结束';
            } else if (activityStatus === 3) {
                return '截止报名';
            } else {
                return '待处理';
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

            this.deleteActivity(row.activityId);
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
          ids.push(this.multipleSelection[i].companyId);
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
        handleAdd() {
            this.$router.push({path: '/wms/addActivity'})
        },
        handleUpdate(index, row) {
            this.$router.push({path: '/wms/updateActivity', query: {activityId: row.activityId}})
        },
        handleShowActivity(index, row) {
            this.$router.push({path: '/wms/companyDetail', query: {companyId: row.companyId}})
        },
        getList() {
            this.listLoading = true;

            if (this.$route.query.companyId == undefined) {
                this.listQuery.companyId = '';
            } else {

                this.listQuery.companyId = this.$route.query.companyId;

            }
            if (this.$route.query.activated == null) {
                this.listQuery.activated = '';
            } else {

                this.listQuery.activated = this.$route.query.activated;

            }
            console.log("companyId："+ this.listQuery.companyId);

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
        deleteActivity(id) {
            this.$confirm('是否要删除改该活动?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = new URLSearchParams();

                params.append("activityId", id);
                deleteActivity(params).then(response => {
                    this.getList();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                });
            })
        },
      batchDeleteHomeAdvertise(ids){
          this.$confirm('是否要删除这些主办方?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              let params = new URLSearchParams();
              params.append("companyIds",ids);
              batchDeleteCompany(params).then(response=>{
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


