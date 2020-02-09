<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="homeAdvertise"
             :rules="rules"
             ref="homeAdvertiseFrom"
             label-width="150px"
             size="small">
      <el-form-item label="场景名称：" prop="name">
        <el-input v-model="homeAdvertise.siteName" class="input-width"></el-input>
      </el-form-item>

      <el-form-item label="场景类型：">
        <el-select v-model="homeAdvertise.siteType">
          <el-option
            v-for="type in typeOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="场景图标：">
      <input type="file" class="bannerFile" @change="tirggerIconFile($event)"multiple ng-submit="" accept="aplication/zip,aplication/rar">
      </el-form-item>

      <el-form-item label="城市：">
        <el-select v-model="homeAdvertise.provinceCode" style="width:120px;" @change="getCitys()">
          <el-option
            v-for="p in provinceList"
            :key="p.code"
            :label="p.name"
            :value="p.code">
          </el-option>
        </el-select>
        <el-select v-model="homeAdvertise.cityCode" style="width:120px;" @change="getDistricts()">
          <el-option
            v-for="c in cityList"
            :key="c.code"
            :label="c.name"
            :value="c.code">
          </el-option>
        </el-select>
        <el-select v-model="homeAdvertise.districtCode" style="width:120px;" @change="selectCity()">
          <el-option
            v-for="d in districtList"
            :key="d.code"
            :label="d.name"
            :value="d.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="详细地址：" prop="name">
        <el-input v-model="homeAdvertise.address" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="经度：" prop="name">
        <el-input v-model="homeAdvertise.longitude" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="纬度：" prop="name">
        <el-input v-model="homeAdvertise.latitude" class="input-width"></el-input>
      </el-form-item>

      <el-form-item label="联系电话：" prop="name">
        <el-input v-model="homeAdvertise.phone" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="法人姓名：" prop="name">
        <el-input v-model="homeAdvertise.realName" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="法人手机号：" prop="name">
        <el-input v-model="homeAdvertise.mobile" class="input-width"></el-input>
      </el-form-item>

      <el-form-item label="营业执照：">
      <input type="file" class="bannerFile" @change="tirggerBlFile($event)"multiple ng-submit="" accept="aplication/zip,aplication/rar">
      </el-form-item>
      <el-form-item label="法人身份证(正面)：">
      <input type="file" class="bannerFile" @change="tirggerIfFile($event)"multiple ng-submit="" accept="aplication/zip,aplication/rar">
      </el-form-item>
      <el-form-item label="法人身份证(背面)：">
      <input type="file" class="bannerFile" @change="tirggerIbFile($event)"multiple ng-submit="" accept="aplication/zip,aplication/rar">
      </el-form-item>
      <el-form-item label="法人身份证(手持)：">
      <input type="file" class="bannerFile" @change="tirggerIhFile($event)"multiple ng-submit="" accept="aplication/zip,aplication/rar">
      </el-form-item>

      <el-form-item label="场景简介：">
        <el-input
          class="input-width"
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="homeAdvertise.profile">
        </el-input>
      </el-form-item>
      <el-form-item label="场景描述：">
        <el-input
          class="input-width"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="homeAdvertise.description">
        </el-input>
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
  import {createHomeAdvertise, getSite, getCityList, updateSite} from '@/api/seckill'
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
    siteName: null,
    siteType: 1,
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
        homeAdvertise: {provinceCode: '', cityCode:'', districtCode:'', age:'', siteType:'', latitude:'', longitude:''},
        provinceList: null,
        cityList: null,
        districtList:null,
        rules: {
          siteName: [
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

        console.log('siteId is' + this.$route.query.siteId);

        getSite(this.$route.query.siteId).then(response => {

          this.homeAdvertise = response.data;

        });
      }else{
        this.homeAdvertise = Object.assign({},defaultHomeAdvertise);
      }

        var cityQuery = {};
        cityQuery.level = 2;

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
                updateSite(this.$route.query.siteId, this.homeAdvertise).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              } else {


              var formData = new FormData();
              formData.append('siteName', this.homeAdvertise.siteName);
              formData.append('address', this.homeAdvertise.address);
              formData.append('age', this.homeAdvertise.age);
              formData.append('siteType', this.homeAdvertise.siteType);
              formData.append('phone', this.homeAdvertise.phone);
              formData.append('mobile', this.homeAdvertise.mobile);
              formData.append('profile', this.homeAdvertise.profile);
              formData.append('description', this.homeAdvertise.description);
              formData.append('latitude', this.homeAdvertise.latitude);
              formData.append('longitude', this.homeAdvertise.longitude);

              formData.append('iconFile', this.homeAdvertise.iconFile);
              formData.append('blFile', this.homeAdvertise.blFile);
              formData.append('ifFile', this.homeAdvertise.ifFile);
              formData.append('ibFile', this.homeAdvertise.ibFile);
              formData.append('ihFile', this.homeAdvertise.ihFile);


                createHomeAdvertise(formData).then(response => {
                  this.$refs[formData].resetFields();
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


