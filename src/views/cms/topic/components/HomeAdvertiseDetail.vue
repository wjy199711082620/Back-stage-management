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
      <el-form-item label="开始时间：" prop="startTime">
        <el-date-picker
          type="datetime"
          placeholder="选择日期"
          v-model="homeAdvertise.startDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="到期时间：" prop="endTime">
        <el-date-picker
          type="datetime"
          placeholder="选择日期"
          v-model="homeAdvertise.endDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="上线/下线：">
        <el-radio-group v-model="homeAdvertise.status">
          <el-radio :label="0">下线</el-radio>
          <el-radio :label="1">上线</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="广告图片：">
        <single-upload v-model="homeAdvertise.imageUrl"></single-upload>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input v-model="homeAdvertise.sortIndex" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="广告链接：" prop="url">
        <el-input v-model="homeAdvertise.jumpUrl" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="广告备注：">
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
  import {createHomeAdvertise, getSite, updateSite} from '@/api/site'
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
        homeAdvertise: null,
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
                createHomeAdvertise(this.homeAdvertise).then(response => {
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


