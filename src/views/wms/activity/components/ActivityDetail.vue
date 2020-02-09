<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="activity"
             :rules="rules"
             ref="activityForm"
             label-width="150px"
             size="small">

      <el-form-item label="活动主题：" prop="activityTheme">
        <el-input v-model="activity.activityTheme" class="input-width" ></el-input>
      </el-form-item>

      <el-form-item label="活动封面：" prop="name">
        <el-upload
          action="#"
          :limit="1"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :before-upload="beforeAvatarUpload"
          :file-list="fileList"
          multiple
          :http-request="uploadFile"
        >
          <img v-if="activity.activityLogo" :src="activity.activityLogo" class="avatar"
               style="width: 148px;height:148px">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>

      <el-form-item label="活动开始时间：">
        <el-date-picker
          class="input-width"
          v-model="activity.activityStartTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="请选择时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="活动结束时间：">
        <el-date-picker
          class="input-width"
          v-model="activity.activityEndTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="请选择时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="是否免费：">
        <el-select v-model="activity.activityFree">
          <el-option v-for="item in activityFreeOptions" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="activity.activityFree == '不免费' " label="活动费用：" >
        <el-input v-model.number="activity.activityFee" placeholder="费用只能是数值，限2位小数" class="input-width">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>

      <el-form-item v-if="activity.activityFree == '0' " label="活动费用：" >
        <el-input v-model.number="activity.activityFee" placeholder="费用只能是数值，限2位小数" class="input-width">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>

      <el-form-item label="活动咨询电话：" prop="activityPhone">
        <el-input v-model="activity.activityPhone" class="input-width"></el-input>
      </el-form-item>

      <el-form-item label="活动状态：">
        <el-radio-group v-model="activity.activated">
          <el-radio :label="0">还未开始</el-radio>
          <el-radio :label="1">正在进行</el-radio>
          <el-radio :label="2">已结束</el-radio>
          <el-radio :label="3">截止报名</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('activityForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('activityForm')">重置</el-button>
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
    import {createHomeAdvertise, getActivityInfo, updateActivity} from '@/api/activity'
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
  const activityFreeOptions = [
      {
          label: '免费',
          value: 1
      },
      {
          label: '不免费',
          value: 0
      }
  ];

  const defaultHomeAdvertise = {
      activityTheme: null,
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
    name: 'HomeActivityDetail',
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
              activityFreeOptions: Object.assign({}, activityFreeOptions),
              dialogVisible: false,
              dialogImageUrl: '',
              params: new FormData(),
              fileList: [],
              quillOption: quillConfig,
              activity: {activityTheme: null},
              uploadPath,
              rules: {
                  fee: [
                      {type: 'number',required: true,message: '活动费用只能是数值，0.01-10000，限2位小数',trigger: 'blur'}
                  ],
                  bannerName: [
                      {required: true, message: '请输入广告名称', trigger: 'blur'},
                      {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
                  ],
                  activityTheme: [
                      {required: true, message: '请输入活动主题', trigger: 'blur'},
                      {min: 2, message: '活动主题不少于两个字', trigger: 'blur'},
                      {max: 25, message: '活动主题最多25个字', trigger: 'blur'}
                  ],
                  jumpUrl: [
                      {required: true, message: '请输入广告链接', trigger: 'blur'}
                  ],
                  startDate: [
                      {required: true, message: '请选择开始时间', trigger: 'blur'}
                  ],
                  activityPhone: [
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
              console.log('activityId is' + this.$route.query.activityId);
              console.log('process.env.BASE_API' + process.env.BASE_API);

              let formData = new URLSearchParams();
              formData.append("activityId", this.$route.query.activityId);
              getActivityInfo(formData).then(response => {
                  this.activity = response.data;
                  if(this.activity.activityFree == true){
                      this.activity.activityFree = '不免费';
                  }else{
                      this.activity.activityFree = '免费';
                  }
                  console.log("更新前的活动信息：", JSON.stringify(this.activity));
              });
          } else {
              this.activity = Object.assign({}, defaultHomeAdvertise);
          }
      },
      methods: {
          handlePictureCardPreview(file) {
              this.dialogImageUrl = file.url;
              this.dialogVisible = true
          },
          handleRemove(file) {
              for (const i in this.fileList) {
                  if (this.fileList[i].key === file.uid) {
                      this.fileList.splice(i, 1)
                  }
              }
          },
          uploadFile(file) {
              this.params.append('logo', file.file);

          },
          beforeAvatarUpload(file) {
              const isJPG = file.type === 'image/jpeg';
              const isPng = file.type === 'image/png';
              const isLt2M = file.size / 1024 / 1024 < 2;

              if (!isJPG && !isPng) {
                  this.$message.error('上传图片只能是 JPG或png 格式!');
              }
              if (!isLt2M) {
                  this.$message.error('上传图片大小不能超过 2MB!');
              }
              this.activity.activityLogo = this.dialogImageUrl;
              return (isJPG || isPng) && isLt2M
          },
          uploadProductUrl: function (response) {
              console.log(response);
              console.log('uploadSuccess');
              this.activity.imageUrl = response.data;
          },
          checkType(file) {
              console.log(file);
              this.activity.file = file.raw;
              if (window.createObjectURL != undefined) { // basic
                  this.activity.imageUrl = window.createObjectURL(file.raw);
              } else if (window.URL != undefined) { // mozilla(firefox)
                  this.activity.imageUrl = window.URL.createObjectURL(file.raw);
              } else if (window.webkitURL != undefined) { // webkit or chrome
                  this.activity.imageUrl = window.webkitURL.createObjectURL(file.raw);
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
                              if (null === this.activity.activityStartTime) {
                                  this.$alert('请选择活动开始时间', '提示', {
                                      confirmButtonText: '确定',
                                      type: 'error'
                                  });
                                  return;
                              }
                              if (null === this.activity.activityEndTime) {
                                  this.$alert('请选择活动结束时间', '提示', {
                                      confirmButtonText: '确定',
                                      type: 'error'
                                  });
                                  return;
                              }

                              if (this.activity.activityEndTime <= this.activity.activityStartTime) {
                                  this.$alert('开始时间不能晚于结束时间', '提示', {
                                      confirmButtonText: '确定',
                                      type: 'error'
                                  });
                                  return;
                              }
                              if (this.activity.activityFree === 1) {
                                  this.activity.activityFee = 0;
                              }
                              //封装json格式的activity
                              const activity = {
                                  "activityId": this.activity.activityId,
                                  "companyId": this.activity.companyId,
                                  "activityTheme": this.activity.activityTheme,
                                  "activityLogo": this.activity.activityLogo,
                                  "activityStartTime": this.activity.activityStartTime,
                                  "activityEndTime": this.activity.activityEndTime,
                                  "activityPhone": this.activity.activityPhone,
                                  "ticket": this.activity.ticket,
                                  "activated": this.activity.activated
                              };
                              this.params.append("activity", JSON.stringify(activity));

                              console.log("更新后的活动信息：" + JSON.stringify(this.activity));


/*                              updateActivity(this.params).then(response => {
                                  this.$refs[formName].resetFields();
                                  this.$message({
                                      message: '修改成功',
                                      type: 'success',
                                      duration: 1000
                                  });
                                  this.$router.back();
                              });*/
                          } else {
                              createHomeAdvertise(this.activity).then(response => {
                                  this.$refs[formName].resetFields();
                                  this.activity = Object.assign({}, defaultHomeAdvertise);
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
              this.activity = Object.assign({}, defaultHomeAdvertise);
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


