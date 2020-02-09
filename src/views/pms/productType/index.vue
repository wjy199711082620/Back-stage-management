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
          <el-form-item label="类型名称：">
            <el-input v-model="listQuery.typeName" class="input-width" placeholder="类型名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="层级">
        <el-select v-model="listQuery.level">
          <el-option
            v-for="type in levelOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
        </el-form>

      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加类型</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="flashTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.typeId}}</template>
        </el-table-column>
        <el-table-column label="类型名称" align="center">
          <template slot-scope="scope">{{scope.row.typeName}}</template>
        </el-table-column>
        <el-table-column label="排序位置" align="center">
          <template slot-scope="scope">{{scope.row.sortIndex}}</template>
        </el-table-column>
        <el-table-column label="级别" align="center">
          <template slot-scope="scope">{{scope.row.level | levelFilter}}</template>
        </el-table-column>
        <el-table-column label="父级编号" align="center">
          <template slot-scope="scope">{{scope.row.parentId}}</template>
        </el-table-column>
        <el-table-column label="图片" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.imageUrl"></template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="添加/修改类型"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="flashPromotion"
               ref="flashPromotionForm"
               label-width="150px" size="small">
        <el-form-item label="类型名称：">
          <el-input v-model="flashPromotion.typeName" style="width: 210px"></el-input>
        </el-form-item>
        <el-form-item label="层级：">
        <el-select v-model="flashPromotion.level">
          <el-option
            v-for="type in levelOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="上级分类：" v-if="flashPromotion.level == 2">
          <el-select v-model="flashPromotion.parentId"
                     placeholder="请选择分类">
            <el-option
              v-for="item in firstProductTypeList"
              :key="item.id"
              :label="item.typeName"
              :value="item.typeId">
            </el-option>
          </el-select>
        </el-form-item>

         <el-form-item label="排序位置：">
          <el-input v-model="flashPromotion.sortIndex" style="width: 210px"></el-input>
        </el-form-item>

        <el-form-item label="商品图片">
          <el-upload
            action="none"
            :show-file-list="false"
            :on-change="tirggerTypeIcon"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="flashPromotion.imageUrl" :src="flashPromotion.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {fetchList, updateStatus, deleteFlash, createFlash, updateFlash} from '@/api/productType';
  import {formatDate} from '@/utils/date';
  import { uploadPath } from '@/api/storage'

  const defaultLevelOptions=[

    {
      label: '一级类目',
      value: 1
    },
    {
      label: '二级类目',
      value: 2
    },

  ];

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    keyword: null
  };
  const defaultFlashPromotion = {
    typeName: null,
    parentId: null,
    level: null,
    sortIndex: null,
    file: null
  };
  export default {
    name: 'flashPromotionList',
    data() {
      return {
        uploadPath,
        listQuery: Object.assign({}, defaultListQuery),
        firstProductTypeList:[],
        list: null,
        levelOptions:Object.assign({},defaultLevelOptions),
        total: null,
        listLoading: false,
        dialogVisible: false,
        flashPromotion: Object.assign({}, defaultFlashPromotion),
        isEdit: false
      }
    },
    created() {
      this.getList();

    },
    filters: {
        levelFilter(value) {
            if (value === 1) {
                return '一级';
            } else if (value === 2) {
                return '二级';
            }
        },
      formatActiveStatus(row) {
        let nowTime = new Date().getTime();
        if (nowTime >= row.startDate && nowTime <= row.endDate) {
          return '活动进行中';
        } else if (nowTime > row.endDate) {
          return '活动已结束';
        } else {
          return '活动未开始';
        }
      },
      formatDate(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd')
      }

    },
    methods: {
      tirggerTypeIcon(file){
        console.log('tirggerTypeIcon')
          this.flashPromotion.file=file.raw;
          if (window.createObjectURL!=undefined) { // basic
          this.flashPromotion.imageUrl = window.createObjectURL(file.raw) ;
        } else if (window.URL!=undefined) { // mozilla(firefox)
          this.flashPromotion.imageUrl = window.URL.createObjectURL(file.raw) ;
        } else if (window.webkitURL!=undefined) { // webkit or chrome
        this.flashPromotion.imageUrl= window.webkitURL.createObjectURL(file.raw) ;
        }
      },
        getFirstProductTypeList() {
            fetchList({pageSize: 100, pageNum: 1}).then(response => {
                this.firstProductTypeList = response.data;
            });
        },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
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
      handleAdd() {
        this.getFirstProductTypeList();
        this.dialogVisible = true;
        this.isEdit = false;
        this.flashPromotion = Object.assign({},defaultFlashPromotion);
      },
      handleShowSessionList() {
        this.$router.push({path: '/sms/flashSession'})
      },
      handleStatusChange(index, row) {
        this.$confirm('是否要修改该状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateStatus(row.id, {status: row.status}).then(response => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          });
          this.getList();
        });
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该类型?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteFlash(row.typeId).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          });
        });
      },
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.isEdit = true;
        this.flashPromotion = Object.assign({},row);
      },
      handleDialogConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.isEdit) {
            console.log(this.flashPromotion)
           let formData = new FormData();
          formData.append('typeName', this.flashPromotion.typeName);
          formData.append('parentId', this.flashPromotion.parentId);
          formData.append('level', this.flashPromotion.level);
          formData.append('sortIndex', this.flashPromotion.sortIndex);
          formData.append('file', this.flashPromotion.file);

            updateFlash(this.flashPromotion.typeId,formData).then(response => {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getList();
            })
          } else {
                let a = new FormData();
         a.append('typeName', this.flashPromotion.typeName);
          a.append('parentId', this.flashPromotion.parentId);
          a.append('level', this.flashPromotion.level);
          a.append('sortIndex', this.flashPromotion.sortIndex);
          a.append('file', this.flashPromotion.file);
            createFlash(a).then(response => {
              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getList();
            })
          }
        })
      },
      handleSelectSession(index,row){
        this.$router.push({path:'/sms/selectSession',query:{flashPromotionId:row.id}})
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data;
          this.total = response.total;
        });
      }
    }
  }
</script>
<style></style>


