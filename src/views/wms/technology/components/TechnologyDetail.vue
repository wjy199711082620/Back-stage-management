<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="technology"
             :rules="rules"
             ref="technologyFrom"
             label-width="150px"
             size="small">
      <el-form-item label="技术人员姓名：" prop="name">
        <el-input v-model="technology.realName" class="input-width" readonly="readonly"></el-input>
      </el-form-item>
      <el-form-item label="技术人员职业：">
        <el-select v-model="technology.technologyOccupation" disabled="disabled">
          <el-option
            v-for="type in typeOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="技术人员工作经验：">
        <el-input v-model="technology.workExperience" class="input-width" readonly="readonly"></el-input>
      </el-form-item>

      <el-form-item label="技术人员性别：">
        <el-select v-model="technology.technologyGender" disabled="disabled ">
          <el-option
            v-for="type in genderOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="荣耀值：">
        <el-input v-model="technology.glory" class="input-width" readonly="readonly"></el-input>
      </el-form-item>

      <el-form-item label="所属城市：">
        <el-input v-model="technology.city" class="input-width" readonly="readonly"></el-input>
      </el-form-item>

      <el-form-item label="薪资/天：">
        <el-input v-model="technology.salary" class="input-width" readonly="readonly"></el-input>
      </el-form-item>

      <el-form-item label="资质证书：" v-if="this.imageUrlList.length >= 1">
        <!--<single-upload v-model="technology.imageUrl"></single-upload>-->
        <!--        <el-upload
                  action="none"
                  :show-file-list="false"
                  :on-success ="uploadProductUrl"
                  :on-change="checkType"
                  class="avatar-uploader"

                  accept=".jpg,.jpeg,.png,.gif">
                  <img v-if="technology.imageUrl" :src="technology.imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"/>
                </el-upload>-->
        <template >
          <img v-for="item in this.imageUrlList" :src="item" width="120" height="120" class="head_pic"/>
        </template>
      </el-form-item>


      <el-form-item label="审核通过/审核不通过：">
        <el-radio-group v-model="technology.activated">
          <el-radio :label="2">审核不通过</el-radio>
          <el-radio :label="1">审核通过</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('technologyFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('technologyFrom')">重置</el-button>
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
    import {createHomeAdvertise, getTechnologyInfo, updateTechnology} from '@/api/technology'
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
      status: 0,
      nickName: ''
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
              technology: null,
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
          console.log(this.uploadPath);
          if (this.isEdit) {
              console.log('useId is' + this.$route.query.userId);

              let formData = new URLSearchParams();
              formData.append("userId", this.$route.query.userId);
              getTechnologyInfo(formData).then(response => {
                  this.technology = response.data;

                  this.technology.activated = response.data.activated;
                  this.imageUrlList = response.data.certificateImage.split(",");

              });
          } else {
              this.technology = Object.assign({}, defaultHomeAdvertise);
          }
      },
      methods: {
          handlePictureCardPreview(file) {
              console.log(file);
          },
          uploadProductUrl: function (response) {
              console.log(response);
              console.log('uploadSuccess')
              this.technology.imageUrl = response.data
          },
          checkType(file) {
              console.log(file);
              this.technology.file = file.raw;
              if (window.createObjectURL != undefined) { // basic
                  this.technology.imageUrl = window.createObjectURL(file.raw);
              } else if (window.URL != undefined) { // mozilla(firefox)
                  this.technology.imageUrl = window.URL.createObjectURL(file.raw);
              } else if (window.webkitURL != undefined) { // webkit or chrome
                  this.technology.imageUrl = window.webkitURL.createObjectURL(file.raw);
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
                              const technology = {
                                  "userId": this.technology.userId,
                                  "technologyOccupation": this.technology.technologyOccupation,
                                  "technologyGender": this.technology.technologyGender,
                                  "workExperience": this.technology.workExperience,
                                  "workCase": this.technology.workCase,
                                  "activated": this.technology.activated
                              };

                              updateTechnology(technology).then(response => {
                                  this.$refs[formName].resetFields();
                                  this.$message({
                                      message: '修改成功',
                                      type: 'success',
                                      duration: 1000
                                  });
                                  this.$router.back();
                              });
                          } else {
                              createHomeAdvertise(this.technology).then(response => {
                                  this.$refs[formName].resetFields();
                                  this.technology = Object.assign({}, defaultHomeAdvertise);
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
              this.technology = Object.assign({}, defaultHomeAdvertise);
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


