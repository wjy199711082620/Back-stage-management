<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="merchant"
             :rules="rules"
             ref="merchantFrom"
             label-width="150px"
             size="small">
      <el-form-item label="店铺名：" prop="name">
        <el-input v-model="merchant.merchantName" class="input-width" ></el-input>
      </el-form-item>

      <el-form-item label="负责人：" prop="name">
        <el-input v-model="merchant.manager" class="input-width" ></el-input>
      </el-form-item>

      <el-form-item label="负责人联系电话：" prop="name">
        <el-input v-model="merchant.mobile" class="input-width" ></el-input>
      </el-form-item>

      <el-form-item label="店铺图标：">
        <el-upload
          action="#"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :before-upload="beforeAvatarUpload"
          :file-list="fileList"
          multiple
          :http-request="uploadFile"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>

      <el-form-item label="店铺简介：">
        <quillEditor ref="myTextEditor" v-model="merchant.description" :options="quillOption"></quillEditor>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('merchantFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('merchantFrom')">重置</el-button>
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
    import {createHomeAdvertise, getMerchantInfo, addMerchant} from '@/api/merchant'
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
                params : new FormData(),
                fileList: [],
                quillOption: quillConfig,
                merchant: null,
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
                formData.append("merchantId", this.$route.query.merchantId)
                getMerchantInfo(formData).then(response => {
                    this.merchant = response.data;
                    //设置审核默认值
                    this.merchant.activated = 1;

                    this.imageUrlList = response.data.companyProve.split(",");

                });
            } else {
                this.merchant = Object.assign({}, defaultHomeAdvertise);
            }
        },
        methods: {
        uploadFile(file){
            this.params.append('file', file.file);

        },
        handleRemove(file, fileList) {
            for (const i in this.picList) {
                if (this.picList[i].key === file.uid) {
                    this.picList.splice(i, 1)
                }
            }
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg'
            const isPng = file.type === 'image/png'
            const isLt2M = file.size / 1024 / 1024 < 2

            if (!isJPG && !isPng) {
                this.$message.error('上传图片只能是 JPG或png 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!')
            }

            return (isJPG || isPng) && isLt2M
        },
            handlePictureCardPreview(file) {
                console.log(file);
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

                                let params = new URLSearchParams();
                                params.append("merchantName",this.merchant.merchantName);

                                const company = {
                                    "companyId": this.merchant.companyId,
                                    "companyName": this.merchant.companyName,
                                    "companyTaxnumber": this.merchant.companyTaxnumber,
                                    "companyIntroduction": this.merchant.companyIntroduction,
                                    "activated": this.merchant.activated
                                };
                                addMerchant(params).then(response => {
                                    this.$refs[formName].resetFields();
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success',
                                        duration: 1000
                                    });
                                    this.$router.back();
                                });
                            } else {
                                this.params.append("merchantName",this.merchant.merchantName);
                                addMerchant(this.params).then(response => {
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


