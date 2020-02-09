<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="technologyType"
             :rules="rules"
             ref="technologyTypeFrom"
             label-width="150px"
             size="small">
      <el-form-item label="技术人员姓名：" prop="typeName">
        <el-input v-model="technologyType.typeName" class="input-width" ></el-input>
      </el-form-item>

      <el-form-item label="技术人员姓名：" prop="name">
        <el-input v-model="technologyType.minSalary" class="input-width" ></el-input>
      </el-form-item>


      <el-form-item label="技术人员工作经验：">
        <el-input v-model="technologyType.maxSalary" class="input-width" ></el-input>
      </el-form-item>


      <el-form-item label="启用/禁用：">
        <el-radio-group v-model="technologyType.activated">
          <el-radio :label="0">启用</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('technologyTypeFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('technologyTypeFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>


    import {createHomeAdvertise, getTechnologyTypeInfo, updateTechnologyType} from '@/api/technologyType'


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
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
      data() {
          return {
              technologyType: null,
              rules: {
                  typeName: [
                      {required: true, message: '类型名称', trigger: 'blur'},
                      {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
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
          if (this.isEdit) {
              console.log('typeId is' + this.$route.query.typeId);

              getTechnologyTypeInfo(this.$route.query.typeId).then(response => {
                  this.technologyType = response.data;

              });
          } else {
              this.technologyType = Object.assign({}, defaultHomeAdvertise);
          }
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
                              //封装json格式的Technology
                              const technologyType = {
                                  "typeId": this.technologyType.typeId,
                                  "typeName": this.technologyType.typeName,
                                  "minSalary": this.technologyType.minSalary,
                                  "maxSalary": this.technologyType.maxSalary,
                                  "activated": this.technologyType.activated
                              };

                              updateTechnologyType(technologyType).then(response => {
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


