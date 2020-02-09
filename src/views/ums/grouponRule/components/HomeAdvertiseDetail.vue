<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="homeAdvertise"
             :rules="rules"
             ref="homeAdvertiseFrom"
             label-width="150px"
             size="small">
      <el-form-item label="商品名称：" prop="name">
        <el-button size="mini" class="btn-add" @click="selectProduct()">选择商品</el-button>

        <el-input v-model="homeAdvertise.productName" class="input-width"></el-input>
      </el-form-item>

      <el-form-item label="初始价格：" prop="name">
        <el-input v-model="homeAdvertise.originalPrice" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="团购价格：" prop="name">
        <el-input v-model="homeAdvertise.grouponPrice" class="input-width"></el-input>
      </el-form-item>

      <el-form-item label="人数限制：" prop="name">
        <el-input v-model="homeAdvertise.numberLimitation" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="总数量：" prop="name">
        <el-input v-model="homeAdvertise.provideNumber" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="开始时间：">
          <el-date-picker
            v-model="homeAdvertise.startTime"
            type="date"
            value-format="timestamp"
            format="yyyy 年 MM 月 dd 日"
            placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
      <el-form-item label="结束时间：">
          <el-date-picker
            v-model="homeAdvertise.endTime"
            type="date"
            value-format="timestamp"
            format="yyyy 年 MM 月 dd 日"
            placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('homeAdvertiseFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('homeAdvertiseFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import SingleUpload from '@/components/Upload/singleUpload'
  import {addGrouponRule, getGrouponRule, getCityList, updateGrouponRule} from '@/api/grouponRule'
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
  const defaultHomeAdvertise = {
    grouponRuleName: null,
    grouponRuleType: 1,
    imageUrl: null,
    startDate: null,
    endDate: null,
    status: 0,
    jumpUrl: null,
    description: null,
    sortIndex: 0
  };
  export default {
    name: 'HomeAdvertiseDetail',
    components:{SingleUpload},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        homeAdvertise: {provinceCode: '', cityCode:'', districtCode:'', age:'', grouponRuleType:'', latitude:'', longitude:''},
        provinceList: null,
        cityList: null,
        districtList:null,
        rules: {
          grouponRuleName: [
            {required: true, message: '请输入场景名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          jumpUrl: [
            {required: true, message: '请输入广告链接', trigger: 'blur'}
          ],
          startDate: [
            {required: true, message: '请选择开始时间', trigger: 'blur'}
          ],
          endDate: [
            {required: true, message: '请选择到期时间', trigger: 'blur'}
          ],
          imageUrl: [
            {required: true, message: '请选择广告图片', trigger: 'blur'}
          ]
        },
        typeOptions: Object.assign({}, defaultTypeOptions)
      }
    },
    created(){
      if (this.isEdit) {

        console.log('ruleId is' + this.$route.query.ruleId);

        getGrouponRule(this.$route.query.ruleId).then(response => {

          this.homeAdvertise = response.data;

        });
      }else{

        this.homeAdvertise = Object.assign({},defaultHomeAdvertise);
      }

        var levelQuery = {};
        levelQuery.level = 2;

        getCityList(cityQuery).then(response => {

          this.provinceList = response.data;
          console.log(this.provinceList);

        });


    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {




              if (this.isEdit) {
                updateGrouponRule(this.$route.query.ruleId, this.homeAdvertise).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              } else {


                addGrouponRule(this.homeAdvertise).then(response => {
                  this.$refs[formName].resetFields();
                  this.homeAdvertise = Object.assign({},defaultHomeAdvertise);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration:1000
                  });
                });
              }




            });

          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      },
      tirggerIconFile(event) {
        this.homeAdvertise.iconFile = event.target.files[0];

        console.log('iconFile' + this.homeAdvertise.iconFile);
      },
      tirggerBlFile(event) {
        this.homeAdvertise.blFile = event.target.files[0];

        console.log('blFile' + this.homeAdvertise.blFile);
      },
      tirggerIfFile(event) {
        this.homeAdvertise.ifFile = event.target.files[0];

        console.log('ifFile' + this.homeAdvertise.ifFile);
      },
      tirggerIbFile(event) {
        this.homeAdvertise.ibFile = event.target.files[0];

        console.log('ibFile' + this.homeAdvertise.ibFile);
      },
      tirggerIhFile(event) {
        this.homeAdvertise.ihFile = event.target.files[0];

        console.log('ihFile' + this.homeAdvertise.ihFile);
      },
      getCitys() {

      console.log('getCitys');

      var cityQuery = {};
        cityQuery.level = 3;
        cityQuery.parentCode = this.homeAdvertise.provinceCode;

        this.homeAdvertise.cityCode = null;
        this.homeAdvertise.districtCode = null;
        this.cityList = null;
        this.districtList = null;

        getCityList(cityQuery).then(response => {

          this.cityList = response.data;
          console.log(this.cityList);



        });



      },
      getDistricts() {

      console.log('getDistricts');

      var cityQuery = {};
        cityQuery.level = 4;
        cityQuery.parentCode = this.homeAdvertise.cityCode;

        this.homeAdvertise.districtCode = null;
        this.districtList = null;

        getCityList(cityQuery).then(response => {

          this.districtList = response.data;

          console.log(this.districtList);

        });

      },
      selectCity() {

      console.log('districtCode'  + this.homeAdvertise.districtCode);

      this.homeAdvertise.cityId = this.homeAdvertise.districtCode;

      },

      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.homeAdvertise = Object.assign({},defaultHomeAdvertise);
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 70%;
  }
</style>


