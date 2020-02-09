<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">

          <el-form-item label="严选商品类型：">
            <el-select v-model="listQuery.commodityType" placeholder="全部" clearable>
              <el-option
                v-for="item in productTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select v-model="listQuery.activated" placeholder="全部" clearable>
              <el-option
                v-for="item in publishStatusOptions"
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
      <el-button
        class="btn-add"
        @click="handleAddCommodity()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="严选商品编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.commodityId}}</template>
        </el-table-column>

        <el-table-column label="严选商品名称" width="140" align="center">
          <template slot-scope="scope">{{scope.row.commodityName}}</template>
        </el-table-column>

        <el-table-column label="严选商品类型" width="120" align="center">
          <template slot-scope="scope">{{scope.row.commodityType| commodityType}}</template>
        </el-table-column>

        <el-table-column label="来源" width="170" align="center">
          <template slot-scope="scope">{{scope.row.companyName}}</template>
        </el-table-column>

        <el-table-column label="商品图片" width="180" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.commodityIcon"></template>
        </el-table-column>

        <el-table-column label="价格/单位" width="186" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{scope.row.rent}}</p>
            <p>单位：{{scope.row.unit}}</p>
          </template>
        </el-table-column>
        <el-table-column label="推荐" width="140" align="center">
          <template slot-scope="scope">
            <p>推荐：
              <el-switch
                @change="handlePublishStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.recommend">
              </el-switch>
            </p>
<!--            <p>积分：
              <el-switch
                @change="handleNewStatusChange(scope.$index, scope.row)"
                :active-value="true"
                :inactive-value="false"
                v-model="scope.row.isScoreProduct">
              </el-switch>
            </p>-->
          </template>
        </el-table-column>


        <el-table-column label="品牌" width="145" align="center">
          <template slot-scope="scope">{{scope.row.brand}}</template>
        </el-table-column>


        <el-table-column label="上下架状态" width="140" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.activated | verifyStatusFilter}}</p>
          </template>
        </el-table-column>

        <el-table-column label="上下架" width="140" align="center">
          <template slot-scope="scope">
            <p>上下架：
              <el-switch
                @change="handlePublishActivatedChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="2"
                v-model="scope.row.activated">
              </el-switch>
            </p>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                @click="handleShowProduct(scope.$index, scope.row)">查看
              </el-button>
              <el-button
                size="mini"
                @click="handleUpdateProduct(scope.$index, scope.row)">编辑
              </el-button>
            </p>
            <p>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)">删除
              </el-button>
            </p>
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
    <el-dialog
      title="编辑货品信息"
      :visible.sync="editSkuInfo.dialogVisible"
      width="40%">
      <span>商品货号：</span>
      <span>{{editSkuInfo.productSn}}</span>
      <el-input placeholder="按sku编号搜索" v-model="editSkuInfo.keyword" size="small" style="width: 50%;margin-left: 20px">
        <el-button slot="append" icon="el-icon-search" @click="handleSearchEditSku"></el-button>
      </el-input>
      <el-table style="width: 100%;margin-top: 20px"
                :data="editSkuInfo.stockList"
                border>
        <el-table-column label="SKU编号" align="center">
          <template slot-scope="scope">
           {{scope.row.stockId}}
          </template>
        </el-table-column>
        <el-table-column property="value" label="货品规格">
          <template slot-scope="scope">
            <el-tag v-for="tag in scope.row.specifications" :key="tag">
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="销售价格" width="100" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.salePrice"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="商品库存"
          width="80"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stock"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="库存预警值"
          width="100"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.lowStock"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSkuInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSkuConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
    import {
        fetchList,
        updateDeleteStatus,
        updateNewStatus,
        updateRecommendStatus,
        updateCommodityRecommendStatus,
        updateCommodityActivated,
        batchUpdateRecommendStatus,
        batchDeleteRecommendStatus,
        batchUpdatePublishStatus,
        batchDelete
    } from '@/api/commodity'
  import {fetchList as fetchSkuStockList,update as updateSkuStockList} from '@/api/skuStock'


    const defaultListQuery = {
        keyword: null,
        pageNum: 1,
        pageSize: 5,
        companyId: null,
        publishStatus: null,
        verifyStatus: null,
        productSn: null,
        productCategoryId: null,
        brandId: null,
        activated: null,
        commodityName: null,
        commodityType: null

    };
  export default {
    name: "productList",
    data() {
      return {
        editSkuInfo:{
          dialogVisible:false,
          productId:null,
          productSn:'',
          productAttributeCategoryId:null,
          stockList:[],
          keyword:null,
          specifications: [ '标准' ],
        },
        operates: [
          {
            label: "商品上架",
            value: "publishOn"
          },
          {
            label: "商品下架",
            value: "publishOff"
          },
          {
            label: "设为推荐",
            value: "recommendOn"
          },
          {
            label: "取消推荐",
            value: "recommendOff"
          },
          {
            label: "删除",
            value: "recycle"
          }
        ],
        operateType: null,
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        selectProductCateValue: null,
        multipleSelection: [],
          productTypeOptions: [{
              value: 1,
              label: '灯光'
          }, {
              value: 2,
              label: '音响'
          }, {
              value: 3,
              label: '视频'
          }],
        brandOptions: [],
        publishStatusOptions: [{
          value: 1,
          label: '上架'
        }, {
          value: 2,
          label: '下架'
        }],
        verifyStatusOptions: [{
          value: 2,
          label: '审核通过'
        }, {
          value: 1,
          label: '待审核'
        }]
      }
    },
    created() {
      this.getList();
      //this.getBrandList();
    },
    watch: {
      selectProductCateValue: function (newValue) {
        if (newValue != null && newValue.length == 2) {
          this.listQuery.productType = newValue[1];
        } else {
          this.listQuery.productType = null;
        }

      }
    },
      filters: {
          commodityType(type) {
              if (type === 1) {
                  return '灯光 ';
              } else if (type === 2) {
                  return '音响';
              } else {
                  return '视频';
              }
          },
          verifyStatusFilter(value) {
              if (value === 1) {
                  return '上架';
              } else if (value === 2) {
                  return '下架';
              } else {
                  return '未上架';
              }
          }
      },
    methods: {
      getProductSkuSp(row, index) {
        if (index === 0) {
          return row.sp1;
        } else if (index === 1) {
          return row.sp2;
        } else {
          return row.sp3;
        }
      },
        getList() {
            this.listLoading = true;
            console.log("-------------userIcon"+this.$store.getters.userIcon);
            //主办方身份
            if (this.$store.getters.roles === 4) {
                this.listQuery.companyId = this.$store.getters.userId;
            }
            fetchList(this.listQuery).then(response => {
                this.listLoading = false;
                this.list = response.data;
                this.total = response.total;
                this.brandOptions = [];
                for (let i = 0; i < this.list.length; i++){
                    const split = this.list[i].commodityIcon.split(",")[0];
                    this.list[i].commodityIcon = split;
                }
            });
        },
/*      getBrandList() {
        fetchBrandList({pageNum: 1, pageSize: 100}).then(response => {
          this.brandOptions = [];
          let brandList = response.data;
          for (let i = 0; i < brandList.length; i++) {
            this.brandOptions.push({label: brandList[i].brandName, value: brandList[i].brandId});
          }
        });
      },*/
      handleShowSkuEditDialog(index,row){
        this.editSkuInfo.dialogVisible=true;
        this.editSkuInfo.productId=row.productId;
        this.editSkuInfo.productSn=row.productSn;
        this.editSkuInfo.specifications = row.specifications;
        this.editSkuInfo.keyword=null;
        fetchSkuStockList(row.productId,{keyword:this.editSkuInfo.keyword}).then(response=>{
          this.editSkuInfo.stockList=response.data;
        });
      },
      handleSearchEditSku(){
        fetchSkuStockList(this.editSkuInfo.productId,{stockId:this.editSkuInfo.keyword}).then(response=>{
          this.editSkuInfo.stockList=response.data;
        });
      },
      handleEditSkuConfirm(){
        if(this.editSkuInfo.stockList==null||this.editSkuInfo.stockList.length<=0){
          this.$message({
            message: '暂无sku信息',
            type: 'warning',
            duration: 1000
          });
          return
        }
        this.$confirm('是否要进行修改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
            console.log(this.editSkuInfo)
          updateSkuStockList(this.editSkuInfo.productId,this.editSkuInfo.stockList).then(response=>{
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
            this.editSkuInfo.dialogVisible=false;
          });
        });
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleAddCommodity() {
        this.$router.push({path:'/wms/addCommodity'});
      },
      handleBatchOperate() {
        if(this.operateType==null){
          this.$message({
            message: '请选择操作类型',
            type: 'warning',
            duration: 1000
          });
          return;
        }
          if (this.multipleSelection == null || this.multipleSelection.length < 1) {
              this.$message({
                  message: '请选择要操作的商品',
                  type: 'warning',
                  duration: 1000
              });
              return;
          }
          this.$confirm('是否要进行该批量操作?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              let ids = [];
              for (let i = 0; i < this.multipleSelection.length; i++) {
                  ids.push(this.multipleSelection[i].productId);
              }
              switch (this.operateType) {
                  case this.operates[0].value:

                      this.batchUpdatePublishStatus(2, ids);
                      break;
                  case this.operates[1].value:

                      this.batchUpdatePublishStatus(4, ids);
                      break;
                  case this.operates[2].value:
                      console.log("设为推荐");
                      this.batchUpdateRecommendStatus(1, ids);
                      break;
                  case this.operates[3].value:
                      console.log("取消推荐");
                      this.batchDeleteRecommendStatus(0, ids);
                      break;
                  case this.operates[4].value:
                      console.log("批量删除")
                      this.batchDelete(ids);
                      break;
                  case this.operates[5].value:

                      //this.updateNewStatus(0,ids);
                      break;
                  case this.operates[6].value:
                      break;
                  case this.operates[7].value:

                      //this.updateDeleteStatus(1,ids);
                      break;
                  default:
                      break;
              }
              this.getList();
          });
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
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handlePublishStatusChange(index, row) {
            let ids = [];
            ids.push(row.commodityId);
            this.updatePublishStatus(row.recommend, ids);
        },
        handlePublishActivatedChange(index, row) {
            let ids = [];
            ids.push(row.commodityId);
            this.updatePublishActivated(row.activated, ids);
        },
        handleNewStatusChange(index, row) {
            let ids = [];
            ids.push(row.productId);
            this.updateNewStatus(row.isScoreProduct, ids);
        },
        handleRecommendStatusChange(index, row) {
            let ids = [];
            ids.push(row.id);
            this.updateRecommendStatus(row.recommandStatus, ids);
        },
        handleResetSearch() {
            this.selectProductCateValue = [];
            this.listQuery = Object.assign({}, defaultListQuery);
        },
        handleDelete(row) {
            this.$confirm('是否要进行删除操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.updateDeleteStatus(row.commodityId);
                this.getList();
            });
        },
        handleUpdateProduct(index, row) {
            this.$router.push({path: '/wms/updateCommodity', query: {commodityId: row.commodityId, queryType: 2}});
        },
        handleShowProduct(index, row) {

            this.$router.push({path: '/wms/updateCommodity', query: {commodityId: row.commodityId, queryType: 2}});
        },
        handleShowVerifyDetail(index, row) {
            console.log("handleShowVerifyDetail", row);
        },
        handleShowLog(index, row) {
            console.log("handleShowLog", row);
        },
        updatePublishStatus(recommend, ids) {
            let params = new URLSearchParams();
            params.append('commodityId', ids);
            params.append('recommend', recommend);
            updateCommodityRecommendStatus(params).then(response => {
                this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                });
            });
        },
        updatePublishActivated(activated, ids) {
            let params = new URLSearchParams();
            params.append('commodityId', ids);
            params.append('activated', activated);
            updateCommodityActivated(params).then(response => {
                this.$message({
                    message: '商品上下架状态修改成功',
                    type: 'success',
                    duration: 1000
                });
            });
        },
        updateNewStatus(newStatus, ids) {
            let params = new URLSearchParams();
            params.append('ids', ids);
            params.append('isScoreProduct', newStatus);

            updateNewStatus(params).then(response => {
                this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                });
            });
        },
        updateRecommendStatus(recommendStatus, ids) {
            let params = new URLSearchParams();
            params.append('ids', ids);
            params.append('recommendStatus', recommendStatus);
            updateRecommendStatus(params).then(response => {
                this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                });
            });
        },
        batchDeleteRecommendStatus(recommendStatus, ids) {
            let params = new URLSearchParams();
            params.append('ids', ids);
            params.append('recommendStatus', recommendStatus);
            batchDeleteRecommendStatus(params).then(response => {
                this.$message({
                    message: '设置成功',
                    type: 'success',
                    duration: 1000
                });
            });
        },
        batchUpdateRecommendStatus(recommendStatus, ids) {
            let params = new URLSearchParams();
            params.append('ids', ids);
            params.append('recommendStatus', recommendStatus);
            batchUpdateRecommendStatus(params).then(response => {
                this.$message({
                    message: '设置成功',
                    type: 'success',
                    duration: 1000
                });
            });
        },
        batchUpdatePublishStatus(isOnSale, ids) {
            let params = new URLSearchParams();
            params.append('ids', ids);
            params.append('isOnSale', isOnSale);
            batchUpdatePublishStatus(params).then(response => {
                this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                });
            });
        },
        batchDelete(ids) {
            let params = new URLSearchParams();
            params.append('productIds', ids);

            batchDelete(params).then(response => {
                this.$message({
                    message: '删除成功',
                    type: 'success',
                    duration: 1000
                });
                this.getList();
            });
        },
        updateDeleteStatus(ids) {
            let params = new URLSearchParams();
            params.append('commodityId', ids);
            updateDeleteStatus(params).then(response => {
                this.$message({
                    message: '删除成功',
                    type: 'success',
                    duration: 1000
                });
            });
            this.getList();
        }
    }
  }
</script>
<style></style>


