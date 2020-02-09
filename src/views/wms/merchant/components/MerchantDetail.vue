<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="merchant"
             :rules="rules"
             ref="companyFrom"
             label-width="150px"
             size="small">
      <el-form-item label="店铺名：" prop="name">
        <el-input v-model="merchant.merchantName" class="input-width" ></el-input>
      </el-form-item>

      <el-form-item label="店铺logo：">
        <el-upload
          :action="uploadPath"
          :show-file-list="false"
          :on-success="uploadPicUrl"
          class="avatar-uploader"
          accept=".jpg,.jpeg,.png,.gif">
          <img v-if="merchant.merchantLogo" :src="merchant.merchantLogo" style="height: 140px " class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>

      </el-form-item>

      <el-form-item label="负责人：" prop="name">
        <el-input v-model="merchant.manager" class="input-width" ></el-input>
      </el-form-item>

      <el-form-item label="负责人联系方式：" prop="name">
        <el-input v-model="merchant.mobile" class="input-width" ></el-input>
      </el-form-item>

      <el-form-item label="店铺地址：" prop="name">
        <el-input v-model="merchant.address" class="input-width" ></el-input>
      </el-form-item>

      <el-form-item label="店铺简介：">
        <quillEditor ref="myTextEditor" v-model="merchant.description" :options="quillOption"></quillEditor>
      </el-form-item>

      <el-form-item label="审核通过/不通过：">
        <el-radio-group v-model="merchant.activated">
          <el-radio :label="4">审核不通过</el-radio>
          <el-radio :label="3">审核通过</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('companyFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('companyFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
    import {quillEditor} from 'vue-quill-editor';
    import quillConfig from '@/utils/quill-config.js'

    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'

    import SingleUpload from '@/components/Upload/singleUpload'
    import {createHomeAdvertise, getMerchantInfo, updateMerchant} from '@/api/merchant'
    import {uploadPath} from '@/api/storage';


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
  const defaultGenderOptions = [
      {
          label: '男',
          value: 1
      },
      {
          label: '女',
          value: 2
      }
  ];

  const defaultHomeAdvertise = {
      bannerName: null,
      jumpUrl: null,
      bannerType: 1,
      description: null,
      sortIndex: 0,
      imageUrl: null,
      startDate: null,
      endDate: null,
      status: 0
  };
  export default {
    name: 'HomeAdvertiseDetail',
    components:{SingleUpload,quillEditor},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
      data() {

          return {
              imageUrlList:[],
              quillOption: quillConfig,
              merchant: {merchantName: null, manager: null},
              uploadPath,
              rules: {
                  bannerName: [
                      {required: true, message: '请输入广告名称', trigger: 'blur'},
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
              typeOptions: Object.assign({}, defaultTypeOptions),
              genderOptions: Object.assign({}, defaultGenderOptions)
          }
      },
      created() {
          console.log(uploadPath);
          console.log(this.uploadPath)
          if (this.isEdit) {
              console.log('merchantId is' + this.$route.query.merchantId);

              let formData = new URLSearchParams();
              formData.append("merchantId", this.$route.query.merchantId);
              getMerchantInfo(formData).then(response => {
                  this.merchant = response.data;
                  //设置审核默认值
                  this.merchant.activated = 3;

                  this.imageUrlList = response.data.merchantLogo.split(",");

              });
          } else {
              this.merchant = Object.assign({}, defaultHomeAdvertise);
          }
      },
      methods: {
          uploadPicUrl(response){
              this.merchant.merchantLogo = response.data
          },
          handlePictureCardPreview(file) {
              console.log(file);
          },
          handleAvatarSuccess: function(response) {
              this.merchant.merchantLogo = response.data
          },
          uploadProductUrl: function (response) {
              console.log(response);
              console.log('uploadSuccess')
              this.merchant.imageUrl = response.data
          },
          checkType(file) {
              console.log(file);
              this.merchant.file = file.raw;
              if (window.createObjectURL != undefined) { // basic
                  this.merchant.imageUrl = window.createObjectURL(file.raw);
              } else if (window.URL != undefined) { // mozilla(firefox)
                  this.merchant.imageUrl = window.URL.createObjectURL(file.raw);
              } else if (window.webkitURL != undefined) { // webkit or chrome
                  this.merchant.imageUrl = window.webkitURL.createObjectURL(file.raw);
              }
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
                              let merchant = new URLSearchParams();
                              merchant.append("userId", this.$route.query.merchantId);
                              merchant.append("merchantName", this.merchant.merchantName);
                              merchant.append("manager", this.merchant.manager);
                              merchant.append("mobile", this.merchant.mobile);
                              merchant.append("address", this.merchant.address);
                              merchant.append("activated", this.merchant.activated);
                              merchant.append("description", this.merchant.description);
                              merchant.append("merchantLogo", this.merchant.merchantLogo);

                              console.log("merchant:" + merchant);

                              updateMerchant(merchant).then(response => {
                                  this.$refs[formName].resetFields();
                                  this.$message({
                                      message: '修改成功',
                                      type: 'success',
                                      duration: 1000
                                  });
                                  this.$router.back();
                              });
                          } else {
                              createHomeAdvertise(this.merchant).then(response => {
                                  this.$refs[formName].resetFields();
                                  this.merchant = Object.assign({}, defaultHomeAdvertise);
                                  this.$message({
                                      message: '提交成功',
                                      type: 'success',
                                      duration: 1000
                                  });
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
              this.merchant = Object.assign({}, defaultHomeAdvertise);
          }
      }
  }
</script>
<style scoped>
  .input-width {
    width: 70%;
  }
  .form-container {
    width: 1320px;
  }
</style>


