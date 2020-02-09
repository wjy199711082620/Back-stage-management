<template> 
  <div class="app-container">

    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="searchBrandList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.productName" placeholder="商品名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">

      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        @click="addPurchaseRule()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productAttrTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.ruleId}}</template>
        </el-table-column>
        <el-table-column label="商品名称"  align="center">
          <template slot-scope="scope">{{scope.row.productName}}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.productIcon"></template>
        </el-table-column>
        <el-table-column label="最小数量" width="140" align="center">
          <template slot-scope="scope">{{scope.row.minAmount}}</template>
        </el-table-column>
        <el-table-column label="折扣" width="120" align="center">
          <template slot-scope="scope"> <p>{{scope.row.discount}}%</p></template>
        </el-table-column>
        <el-table-column label="价格" width="150" align="center">
          <template slot-scope="scope"> <p>{{scope.row.price}}￥</p></template>
        </el-table-column>

        <el-table-column label="销量" width="140" align="center">
          <template slot-scope="scope">{{scope.row.saleAmount}}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <p>
              <el-switch
                @change="handleNewStatusChange(scope.$index, scope.row)"
                :active-value="true"
                :inactive-value="false"
                v-model="scope.row.activated">
              </el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
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


    <el-dialog title="添加/修改 进货规则" :visible.sync="purchaseRuleDialog" width="50%">
      <el-form :model="purchaseRule"
               ref="flashPromotionForm"
               label-width="150px" size="small">
        <el-form-item label="选择商品">
          <el-select
            v-model="selectProduct"
            filterable
            remote
            reserve-keyword
            placeholder="商品名称/商品货号"
            :remote-method="searchProductMethod">
            <el-option
              v-for="item in selectProductOptions"
              :key="item.productId"
              :label="item.productName"
              :value="item.productId">
              <span style="float: left">{{ item.productName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">NO.{{ item.productId }}</span>
            </el-option>
          </el-select>
          <el-button @click="handleAddProductRelation()">添加</el-button>
          <el-table ref="productRelationTable"
                    :data="purchaseRule.productRelationList"
                    style="width: 100%;margin-top: 20px"
                    border>
            <el-table-column label="ID" align="center"  width="120" >
              <template slot-scope="scope">NO.{{scope.row.productId}}</template>
            </el-table-column>
            <el-table-column label="商品名称" align="center">
              <template slot-scope="scope">{{scope.row.productName}}</template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100">
              <template slot-scope="scope">
                <el-button size="mini"
                           type="text"
                           @click="handleDeleteProductRelation(scope.$index, scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item label="折扣：">
          <el-input v-model="purchaseRule.discount" placeholder="只能输入正整数" style="width: 400px">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最少数量：" prop="minAmount">
          <el-input v-model="purchaseRule.minAmount" style="width: 400px">
          <template slot="append">件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="价格：" prop="prices">
          <el-input v-model.number="purchaseRule.price" style="width: 400px">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销量：" prop="saleAmount">
          <el-input v-model.number="purchaseRule.saleAmount"  style="width: 400px">
            <template slot="append">件</template>
          </el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button  size="small" @click="purchaseRuleDialog = false">取 消</el-button>
        <el-button  size="small" type="primary" @click="handleSelectDialogConfirm()">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>
<script>
  import {fetchList, deletePurchaseRule,createPurchaseRule,updatePurchaseRule} from '@/api/purchaseRule'
  import {fetchList as fetchProductList} from '@/api/product';
  const defaultListQuery = {
      pageNum: 1,
      pageSize: 5,
      productName:null
  };
  const defaultflashPromotion = {
      discount:null,
      minAmount:null,
      price:null,
      saleAmount:null,
      productRelationList:[]
  };
  export default {
    name: 'productAttrList',
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        operateType: null,
        listQuery: Object.assign({}, defaultListQuery),
        purchaseRule:Object.assign({},defaultflashPromotion),
          selectProduct:null,
        multipleSelection: [],
          selectProductOptions:[],
        purchaseRuleDialog:false,
          isEdit:false,
        operates: [
          {
            label: "删除",
            value: "deletePurchaseRule"
          }
        ],
          rules: {
              minAmount: [
                  {type: 'number', required: true, message: '只能输入正整数', trigger: 'blur'}
              ],
              prices: [
                  {type: 'number', required: true, message: '面值只能是数值，0.01-10000，限2位小数', trigger: 'blur'}
              ],
              saleAmount: [
                  {type: 'number', required: true, message: '只能输入正整数', trigger: 'blur'}
              ]
          },
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data;
          this.total = response.total;
        });
      },
        searchBrandList() {
            this.listQuery.pageNum = 1;
            this.getList();
        },
      addPurchaseRule() {
          this.purchaseRuleDialog = true;
          this.isEdit = false;
          this.purchaseRule = Object.assign({},defaultflashPromotion);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleBatchOperate() {
        if (this.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if (this.operateType !== 'deletePurchaseRule') {
          this.$message({
            message: '请选择批量操作类型',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        this.handleDeleteProductAttr(ids);
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
      handleUpdate(index, row) {
          this.purchaseRuleDialog = true;
          this.isEdit = false;
          this.purchaseRule = Object.assign({},row);
          this.purchaseRule.ruleId = row.ruleId;
      },
      handleDeleteProductAttr(ids) {
        this.$confirm('是否要删除该属性', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = new URLSearchParams();
          data.append("ids", ids);
          deletePurchaseRule(data).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        });
      },
      handleDelete(index, row) {
        let ids = [];
        ids.push(row.id);
        this.handleDeleteProductAttr(ids);
      },
      searchProductMethod(query){
          if (query !== '') {
              this.loading = true;
              fetchProductList({productName:query,pageNum: 1,
                  pageSize: 999}).then(response=>{
                  this.loading=false;
                  let productList = response.data;
                  this.selectProductOptions = [];
                  for(let i=0;i<productList.length;i++){
                      let item = productList[i];
                      this.selectProductOptions.push({productId:item.productId,productName:item.productName});
                  }
              });
          } else {
              this.selectProductOptions = [];
          }
      },
      handleAddProductRelation(){
          if(this.selectProduct===null){
              this.$message({
                  message: '请先选择商品',
                  type: 'warning'
              });
              return
          }
          this.purchaseRule.productRelationList.push(this.getProductById(this.selectProduct));
          this.selectProduct=null;
      },
      getProductById(id){
          for(let i=0;i<this.selectProductOptions.length;i++){
              if(id===this.selectProductOptions[i].productId){
                  return this.selectProductOptions[i];
              }
          }
          return null;
      },
      handleDeleteProductRelation(index,row){
          this.purchaseRule.productRelationList.splice(index,1);
      },
      handleSelectDialogConfirm(){
          this.$confirm('是否要确认?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              if (this.isEdit) {
                  updatePurchaseRule(this.purchaseRule.ruleId,this.purchaseRule).then(response => {
                      this.$message({
                          message: '修改成功！',
                          type: 'success'
                      });
                      this.purchaseRuleDialog =false;
                      this.getList();
                  })
              } else {
                  console.log(this.purchaseRule)
                  createPurchaseRule(this.purchaseRule).then(response => {
                      this.$message({
                          message: '添加成功！',
                          type: 'success'
                      });
                      this.purchaseRuleDialog =false;
                      this.getList();
                  })
              }
          })
      },
    },
    filters: {
      inputTypeFilter(value) {
        if (value === 1) {
          return '从列表中选取';
        } else {
          return '手工录入'
        }
      },
      selectTypeFilter(value) {
        if (value === 1) {
          return '单选';
        } else if (value === 2) {
          return '多选';
        } else {
          return '唯一'
        }
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>


