<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="groupon"
             :rules="rules"
             ref="couponFrom"
             label-width="180px"
             size="small">

      <el-form-item label="人数要求：" prop="numberLimitation">
        <el-input v-model.number="groupon.numberLimitation" placeholder="只能输入正整数" class="input-width">
          <template slot="append">人</template>
        </el-input>
      </el-form-item>
      <el-form-item label="商品数量：" prop="provideNumber">
        <el-input v-model.number="groupon.provideNumber" placeholder="只能输入正整数" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="原价：" prop="originalPrice">
        <el-input v-model.number="groupon.originalPrice" placeholder="面值只能是数值，限2位小数" class="input-width">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="拼团价：" prop="currentPrice">
        <el-input v-model.number="groupon.currentPrice" placeholder="面值只能是数值，限2位小数" class="input-width">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input v-model.number="groupon.sortIndex" placeholder="值越大越靠前" class="input-width">
        </el-input>
      </el-form-item>
      <el-form-item label="开始时间段：">
        <el-date-picker type="datetime" placeholder="选择日期及时间" v-model="groupon.startTime" class="input-width"
                        value-format="timestamp"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间段：">
        <el-date-picker type="datetime" placeholder="选择日期及时间" v-model="groupon.endTime" class="input-width"
                        value-format="timestamp"></el-date-picker>
      </el-form-item>
      <el-form-item label="选择商品：" prop="productId">
        <el-button type="text" @click="handleSelectProduct">打开 Dialog</el-button>

        <el-dialog title="选择商品：" :visible.sync="selectDialogVisible" width="70%" height="70%">
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
     

      </el-form-item>

      <el-form-item label="备注：">
        <el-input
          class="input-width"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="groupon.description">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('couponFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('couponFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
    import {createGroupon, getGroupon, updateGroupon} from '@/api/groupon';
    import {fetchList as fetchProductList} from '@/api/product';

    const defaultGroupon = {
        numberLimitation: 0,
        provideNumber: 0,
        originalPrice: null,
        currentPrice: null,
        sortIndex: 0,
        startTime: null,
        endTime: null,
        description: null,
        productId:null,
    };
    export default {
        name: 'GrouponDetail',
        props: {
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                groupon: Object.assign({}, defaultGroupon),
                rules: {
                    numberLimitation: [
                        {type: 'number', required: true, message: '只能输入正整数', trigger: 'blur'}
                    ],
                    provideNumber: [
                        {type: 'number', required: true, message: '只能输入正整数', trigger: 'blur'}
                    ],
                    originalPrice: [
                        {type: 'number', required: true, message: '只能是数值，0.01-10000，限2位小数', trigger: 'blur'}
                    ],
                    productId: [{required: true, message: '请选择商品', trigger: 'blur'}],
                    currentPrice: [
                        {type: 'number', required: true, message: '只能是数值，0.01-10000，限2位小数', trigger: 'blur'}
                    ]
                },
                selectDialogVisible:false,
                selectProductOptions: [],
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
                  data:{

                  }
            }
        },
        created() {
            if (this.isEdit) {
                getGroupon(this.$route.query.id).then(response => {
                    this.groupon = response.data;
                    console.log(this.groupon)
                });
            }
        },
        methods: {
           handleSelectProduct(){
        this.selectDialogVisible=true;
        this.getDialogList();
      },
       handleDialogSelectionChange(val){
        console.log(val[0].productId)
        this.groupon.productId = val[0].productId;
        console.log(val)
      },
      handleSelectDialogConfirm(){
            this.selectDialogVisible=false;

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
       getDialogList(){
        fetchProductList(this.dialogData.listQuery).then(response=>{
          this.dialogData.list=response.data;
          this.dialogData.total=response.total;
        })
      },
        dateUtil(d){
            d = new Date(d)
            let resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate());
            let resTime = this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds());
            return resDate+' '+resTime;
        },
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('是否提交数据', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            if (this.isEdit) {
                                updateGroupon(this.$route.query.id, this.groupon).then(response => {
                                    this.$refs[formName].resetFields();
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success',
                                        duration: 1000
                                    });
                                    this.$router.back();
                                });
                            } else {
                              console.log(this.groupon)
                               let formData = new FormData();
                               formData.append('productId',this.groupon.productId);
                               formData.append('numberLimitation',this.groupon.numberLimitation);
                               formData.append('provideNumber',this.groupon.provideNumber);
                               formData.append('originalPrice',this.groupon.originalPrice);
                               formData.append('currentPrice',this.groupon.currentPrice);
                               formData.append('description',this.groupon.description);
                               formData.append('sortIndex',this.groupon.sortIndex);
                               formData.append('startTime',this.groupon.startTime);
                               formData.append('endTime',this.groupon.endTime);
                                createGroupon(formData).then(response => {
                                    this.$refs[formName].resetFields();
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success',
                                        duration: 1000
                                    });
                                    this.$router.back();
                                });
                            }
                        });
                    } else {
                        this.$message({
                            message: '验证失败',
                            type: 'error',
                            duration: 1000
                        });
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.groupon = Object.assign({}, defaultGroupon);
            },
            searchProductMethod(query) {
                if (query !== '') {
                    this.loading = true;
                    fetchProductList({
                        productName: query, pageNum: 1,
                        pageSize: 999
                    }).then(response => {
                        this.loading = false;
                        let productList = response.data;
                        this.selectProductOptions = [];
                        for (let i = 0; i < productList.length; i++) {
                            let item = productList[i];
                            this.selectProductOptions.push({
                                productId: item.productId,
                                productName: item.productName,
                                productSn: item.productId
                            });
                        }
                    });
                } else {
                    this.selectProductOptions = [];
                }
            }

        }
    }
</script>
<style scoped>
  .input-width {
    width: 60%;
  }
</style>


