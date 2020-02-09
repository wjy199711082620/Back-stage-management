<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="company"
             :rules="rules"
             ref="companyFrom"
             label-width="150px"
             size="small">
      <el-form-item label="公司名称：" prop="name">
        <el-input v-model="company.companyName" class="input-width" readonly="readonly"></el-input>
      </el-form-item>

      <el-form-item label="公司税号：" prop="name">
        <el-input v-model="company.companyTaxnumber" class="input-width" readonly="readonly"></el-input>
      </el-form-item>

      <el-form-item label="公司证明材料：">
        <!--<single-upload v-model="company.imageUrl"></single-upload>-->
        <!--        <el-upload
                  action="none"
                  :show-file-list="false"
                  :on-success ="uploadProductUrl"
                  :on-change="checkType"
                  class="avatar-uploader"

                  accept=".jpg,.jpeg,.png,.gif">
                  <img v-if="company.imageUrl" :src="company.imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"/>
                </el-upload>-->
        <template >
          <img v-for="item in this.imageUrlList" :src="item" width="120" height="120" class="head_pic"/>
        </template>
      </el-form-item>

      <el-form-item label="公司联系方式：" prop="contact">
        <el-input v-model="company.contact" class="input-width"></el-input>
      </el-form-item>

      <el-form-item label="审核通过/审核不通过：">
        <el-radio-group v-model="company.activated">
          <el-radio :label="2">审核不通过</el-radio>
          <el-radio :label="1">审核通过</el-radio>
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
    import {createHomeAdvertise, getCompanyInfo, updateCompany} from '@/api/company'
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

          imageUrlList:[];
          return {
              quillOption: quillConfig,
              company: null,
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
                  contact: [
                      {required: true, message: '联系方式不能为空', trigger: 'blur'},
                      {min: 11, max: 11, message: '手机号长度为11位', trigger: 'blur'},
                      {pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur'}
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

          if (this.isEdit) {
              console.log('companyId is' + this.$route.query.companyId);

              let formData = new URLSearchParams();
              formData.append("companyId", this.$route.query.companyId)
              getCompanyInfo(formData).then(response => {
                  this.company = response.data;
                  //设置审核默认值
                  this.company.activated = 1;

                  this.imageUrlList = response.data.companyProve.split(",");

              });
          } else {
              this.company = Object.assign({}, defaultHomeAdvertise);
          }
      },
      methods: {
          handlePictureCardPreview(file) {
              console.log(file);
          },
          uploadProductUrl: function (response) {
              console.log(response);
              console.log('uploadSuccess')
              this.company.imageUrl = response.data
          },
          checkType(file) {
              console.log(file);
              this.company.file = file.raw;
              if (window.createObjectURL != undefined) { // basic
                  this.company.imageUrl = window.createObjectURL(file.raw);
              } else if (window.URL != undefined) { // mozilla(firefox)
                  this.company.imageUrl = window.URL.createObjectURL(file.raw);
              } else if (window.webkitURL != undefined) { // webkit or chrome
                  this.company.imageUrl = window.webkitURL.createObjectURL(file.raw);
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

                              //封装json格式的Technology
                              const company = {
                                  "companyId": this.company.companyId,
                                  "companyName": this.company.companyName,
                                  "companyTaxnumber": this.company.companyTaxnumber,
                                  "contact": this.company.contact,
                                  "companyIntroduction": this.company.companyIntroduction,
                                  "activated": this.company.activated
                              };
                              console.log(JSON.stringify(company));
                              updateCompany(company).then(response => {
                                  this.$refs[formName].resetFields();
                                  this.$message({
                                      message: '修改成功',
                                      type: 'success',
                                      duration: 1000
                                  });
                                  this.$router.back();
                              });
                          } else {
                              createHomeAdvertise(this.company).then(response => {
                                  this.$refs[formName].resetFields();
                                  this.company = Object.assign({}, defaultHomeAdvertise);
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
              this.company = Object.assign({}, defaultHomeAdvertise);
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


