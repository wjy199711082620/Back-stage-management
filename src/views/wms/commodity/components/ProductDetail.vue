<template>
  <div class="app-container">

    <el-card class="box-card">
      <h3>严选商品介绍</h3>
      <el-form ref="product" :rules="rules" :model="commodity" label-width="150px">

        <el-form-item label="严选商品名称：" prop="commodityName">
          <el-input v-model="commodity.commodityName"/>
        </el-form-item>

        <el-form-item label="租赁价格：" prop="rent">
          <el-input v-model="commodity.rent" placeholder="0.00">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="租赁单位：" prop="unit">
          <el-input v-model="commodity.unit" placeholder="小时/ 天 / 月 "/>
        </el-form-item>

        <el-form-item label="商品图片：">
          <el-upload
            action="#"
            :limit="5"
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

        <el-form-item label="商品品牌:" prop="brand">
          <el-input v-model="commodity.brand"/>
        </el-form-item>

        <el-form-item label="商品型号：" prop="model">
          <el-input v-model="commodity.model"/>
        </el-form-item>

        <el-form-item label="商品规格：" prop="specification">
          <el-input v-model="commodity.specification"/>
        </el-form-item>

        <el-form-item label="商品功率：" prop="power">
          <el-input v-model="commodity.power"/>
        </el-form-item>

        <el-form-item label="商品所在地：">
          <el-input v-model="commodity.location" />
        </el-form-item>

        <el-form-item label="商品分类：" >
          <el-select v-model="commodity.commodityType">
            <el-option
              v-for="item in commodityTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="严选商品介绍：">
          <quillEditor ref="myTextEditor" v-model="commodity.introduce" :options="quillOption"></quillEditor>
        </el-form-item>

      </el-form>
    </el-card>

<!--    <el-card class="box-card">
      <h3>商品规格</h3>
      <el-row :gutter="20" type="flex" align="middle" style="padding:20px 0;">
        <el-col :span="10">
          <el-radio-group v-model="multipleSpec" @change="specChanged">
            <el-radio-button :label="false">默认标准规格</el-radio-button>
            <el-radio-button :label="true">多规格支持</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col v-if="multipleSpec" :span="10">
          <el-button :plain="true" type="primary" @click="handlespecificationhow">添加</el-button>
        </el-col>
      </el-row>

      <el-table :data="specification">
        <el-table-column property="specification" label="规格名"/>
        <el-table-column property="value" label="规格值">
          <template slot-scope="scope">
            <el-tag type="primary">
              {{ scope.row.value}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="productIcon" label="规格图片">
          <template slot-scope="scope">
            <img v-if="scope.row.picUrl" :src="scope.row.picUrl" width="40">
          </template>
        </el-table-column>
        <el-table-column
          v-if="multipleSpec"
          align="center"
          label="操作"
          width="250"
          class-productName="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleSpecificationDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="specVisiable" title="设置规格">
        <el-form
          ref="specForm"
          :rules="rules"
          :model="specForm"
          status-icon
          label-position="left"
          label-width="100px"
          style="width: 400px; margin-left:50px;">
          <el-form-item label="规格名" prop="specification">
            <el-input v-model="specForm.specification"/>
          </el-form-item>
          <el-form-item label="规格值" prop="value">
            <el-input v-model="specForm.value"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="specVisiable = false">取消</el-button>
          <el-button type="primary" @click="handleSpecificationAdd">确定</el-button>
        </div>
      </el-dialog>
    </el-card>

    <el-card class="box-card">
      <h3>商品库存</h3>
      <el-table :data="stocks">
        <el-table-column property="value" label="货品规格">
          <template slot-scope="scope">
            <el-tag v-for="tag in scope.row.specification" :key="tag">
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="salePrice" width="100" label="货品售价"/>
        <el-table-column property="stock" width="100" label="货品数量"/>
        <el-table-column property="url" width="100" label="货品图片">
          <template slot-scope="scope">
            <img v-if="scope.row.url" :src="scope.row.url" width="40">
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100" class-productName="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleProductShow(scope.row)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="productVisiable" title="设置货品">
        <el-form
          ref="productForm"
          :model="productForm"
          status-icon
          label-position="left"
          label-width="100px"
          style="width: 400px; margin-left:50px;">
          <el-form-item label="货品规格列" prop="specification">
            <el-tag v-for="tag in productForm.specification" :key="tag">
              {{ tag }}
            </el-tag>
          </el-form-item>
          <el-form-item label="货品进价" prop="purchasePrice">
            <el-input v-model="productForm.purchasePrice"/>
          </el-form-item>
          <el-form-item label="货品售价" prop="salePrice">
            <el-input v-model="productForm.salePrice"/>
          </el-form-item>
          <el-form-item label="货品库存" prop="stock">
            <el-input v-model="productForm.stock"/>
          </el-form-item>
          <el-form-item label="货品图片" prop="url">
&lt;!&ndash;            <el-upload
              :action="uploadPath"
              :show-file-list="false"
              :on-success="uploadProductUrl"
              class="avatar-uploader"
              accept=".jpg,.jpeg,.png,.gif">
              <img v-if="productForm.url" :src="productForm.url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>&ndash;&gt;
            <el-upload
              action="#"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :before-upload="beforeAvatarUpload"
              :file-list="fileList"
              multiple
              :http-request="uploadIconFile"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="productVisiable = false">取消</el-button>
          <el-button type="primary" @click="handleProductEdit">确定</el-button>
        </div>
      </el-dialog>
    </el-card>-->

   <!-- <el-card class="box-card">
      <h3>商品参数</h3>
      <el-button :plain="true" type="primary" @click="handleAttributeShow">添加</el-button>
      <el-table :data="attributes">
        <el-table-column property="specification" label="商品参数名称"/>
        <el-table-column property="value" label="商品参数值"/>
        <el-table-column align="center" label="操作" width="100" class-productName="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleAttributeDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="attributeVisiable" title="设置商品参数">
        <el-form
          ref="attributeForm"
          :model="attributeForm"
          status-icon
          label-position="left"
          label-width="100px"
          style="width: 400px; margin-left:50px;">
          <el-form-item label="商品参数名称" prop="attribute">
            <el-input v-model="attributeForm.specification"/>
          </el-form-item>
          <el-form-item label="商品参数值" prop="value">
            <el-input v-model="attributeForm.value"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="attributeVisiable = false">取消</el-button>
          <el-button type="primary" @click="handleAttributeAdd">确定</el-button>
        </div>
      </el-dialog>
    </el-card>-->

    <div class="op-container">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handlePublish">添加</el-button>
    </div>

  </div>
</template>

<style>
  .el-card {
    margin-bottom: 10px;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .input-new-keyword {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .avatar-uploader .el-upload {
    width: 145px;
    height: 145px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .avatar {
    width: 145px;
    height: 145px;
    display: block;
  }
</style>

<script>

 import {
    quillEditor
  } from 'vue-quill-editor';
  import quillConfig from '@/utils/quill-config.js'

  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

    import { createCommodity } from '@/api/commodity'
    import {  uploadPath,uploadImage } from '@/api/storage'
    import Editor from '@tinymce/tinymce-vue'
    import { MessageBox } from 'element-ui'
    import {fetchList as fetchCompanyList} from '@/api/company'
    export default {
        name: 'ProductCreate',
        components: {Editor, quillEditor},
        data() {
            return {
                params : new FormData(),
                dialogImageUrl: '',
                dialogVisible: false,
                picList: [],
                fileList: [],
                uploadPath,
                newKeywordVisible: false,
                newKeyword: '',
                selectProductCateValue: null,
                brandOptions: [],
                productTypeOptions: [],
                commodityTypeOptions: [],
                commodity: {
                    productIcon: '',
                    commodityType: '',
                    commodityName: '',
                    rent: '',
                    unit: '',
                    companyId: ''
                },
                specVisiable: false,
                specForm: { specification: '', value: '' },
                multipleSpec: false,
                specification: [{ specification: '规格', value: '标准' }],
                commodityTypeOptions: [{
                    value: 1,
                    label: '灯光'
                }, {
                    value: 2,
                    label: '音响'
                }, {
                    value: 3,
                    label: '视频'
                }],
                productVisiable: false,
                productForm: { id: 0, specification: [], salePrice: 0.00, stock: 99, url: '' },
                stocks: [{  specification: ['标准'], salePrice: 0.00, stock: 99, url: '' }],
                attributeVisiable: false,
                attributeForm: { attribute: '', value: '' },
                attributes: [],
                quillOption: quillConfig,
                rules: {
                    merchantId: [{ required: true, message: '供货商家编号不能为空', trigger: 'blur' }],
                    commodityName: [{ required: true, message: '严选商品名称不能为空', trigger: 'blur' }],
                    rent: [{ required: true, message: '租赁金额不能为空', trigger: 'blur' }],
                    companyId: [{ required: true, message: '商品所属不能为空', trigger: 'blur' }],
                    brand: [{ required: true, message: '商品型号不能为空', trigger: 'blur' }],
                    model: [{ required: true, message: '商品型号不能为空', trigger: 'blur' }],
                    power: [{ required: true, message: '商品功率不能为空', trigger: 'blur' }],
                    specification: [{ required: true, message: '商品规格不能为空', trigger: 'blur' }],
                    unit: [{ required: true, message: '租赁单位不能为空', trigger: 'blur' }]
                },
                editorInit: {
                    language: 'zh_CN',
                    convert_urls: false,
                    plugins: ['advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'],
                    toolbar: ['searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample', 'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen'],
                    images_upload_handler: function(blobInfo, success, failure) {
                        const formData = new FormData()
                        formData.append('file', blobInfo.blob())
                        uploadImage(formData).then(res => {
                            success(res.data)
                        }).catch(() => {
                            failure('上传失败，请重新上传')
                        })
                    }
                }
            }
        },
        watch: {
        },
        methods: {
            handleResetSearch() {
                this.selectProductCateValue = [];
                this.listQuery = Object.assign({}, defaultListQuery);
            },
            handleCancel: function () {
                this.$router.push({path: '/pms/product'})
            },
            handlePublish: function () {

/*                const finalGoods = {
                    product: this.commodity,
                    specification: this.specification,
                    stocks: this.stocks,
                    attributes: this.attributes
                };*/

                //console.log("finalGoods：" + JSON.stringify(finalGoods.product));
                //this.commodity.productType = this.selectProductCateValue[1];

                if (this.commodity.commodityType === '') {

                    this.$alert('请选择严选租赁商品类型', '提示', {
                        confirmButtonText: '确定',
                        type: 'error'
                    });
                    return;
                }

                this.commodity.companyId = this.$store.getters.userId;

                this.params.append("stocks", JSON.stringify(this.stocks));
                this.params.append("commodity", JSON.stringify(this.commodity));
                this.params.append("specification", JSON.stringify(this.specification));
                this.params.append("attributes", JSON.stringify(this.attributes));
                //this.params.append("finalGoods", JSON.stringify(finalGoods.product));

                console.log("stocks：" + JSON.stringify(this.stocks));
                console.log("commodity：" + JSON.stringify(this.commodity));
                console.log("commodityType：" + this.commodity.commodityType);
                console.log("companyId：" + this.commodity.companyId);

                createCommodity(this.params).then(response => {
                    this.$notify.success({
                        title: '成功',
                        message: '创建成功'
                    });
                    this.$router.push({path: '/wms/commodity', query: {companyId: this.$store.getters.userId}})
                }).catch(response => {
                    MessageBox.alert('业务错误：' + response.data.message, '警告', {
                        confirmButtonText: '确定',
                        type: 'error'
                    })
                })
            },

            handleClose(tag) {
                this.keywords.splice(this.keywords.indexOf(tag), 1);
                this.commodity.keywords = this.keywords.toString()
            },
            showInput() {
                this.newKeywordVisible = true
                this.$nextTick(_ => {
                    this.$refs.newKeywordInput.$refs.input.focus()
                })
            },
            handleInputConfirm() {
                const newKeyword = this.newKeyword
                if (newKeyword) {
                    this.keywords.push(newKeyword)
                    this.commodity.keywords = this.keywords.toString()
                }
                this.newKeywordVisible = false
                this.newKeyword = ''
            },
            uploadPicUrl: function (response) {
                this.commodity.productIcon = response.data
            },
            uploadOverrun: function () {
                this.$message({
                    type: 'error',
                    message: '上传文件个数超出限制!最多上传5张图片!'
                })
            },
            specChanged: function (label) {
                if (label === false) {
                    this.specification = [{specification: '规格', value: '标准'}]
                    this.stocks = [{specification: ['标准'], salePrice: 0.00, stock: 0, url: ''}]
                } else {
                    this.specification = []
                    this.stocks = []
                }
            },
            handlespecificationhow() {
                this.specForm = {specification: '', value: ''};
                this.specVisiable = true
            },
            handleSpecificationAdd() {
                let index = this.specification.length - 1;
                for (let i = 0; i < this.specification.length; i++) {
                    const v = this.specification[i]
                    if (v.specification === this.specForm.specification) {
                        if (v.value === this.specForm.value) {
                            this.$message({
                                type: 'warning',
                                message: '已经存在规格值:' + v.value
                            })
                            this.specForm = {};
                            this.specVisiable = false;
                            return
                        } else {
                            index = i
                        }
                    }
                }

                this.specification.splice(index + 1, 0, this.specForm)
                this.specVisiable = false

                this.specToProduct()
            },
            handleSpecificationDelete(row) {
                const index = this.specification.indexOf(row)
                this.specification.splice(index, 1)
                this.specToProduct()
            },
            specToProduct() {
                if (this.specification.length === 0) {
                    return
                }
                // 根据specification创建临时规格列表
                var specValues = []
                var spec = this.specification[0].specification
                var values = []
                values.push(0)

                for (var i = 1; i < this.specification.length; i++) {
                    const aspec = this.specification[i].specification

                    if (aspec === spec) {
                        values.push(i)
                    } else {
                        specValues.push(values)
                        spec = aspec
                        values = []
                        values.push(i)
                    }
                }
                specValues.push(values)

                // 根据临时规格列表生产货品规格
                // 算法基于 https://blog.csdn.net/tyhj_sf/article/details/53893125
                var productsIndex = 0
                var stocks = []
                var combination = []
                var n = specValues.length
                for (var s = 0; s < n; s++) {
                    combination[s] = 0
                }
                var index = 0
                var isContinue = false
                do {
                    var specification = []
                    for (var x = 0; x < n; x++) {
                        var z = specValues[x][combination[x]]
                        specification.push(this.specification[z].value)
                    }
                    stocks[productsIndex] = {
                        id: productsIndex,
                        specification: specification,
                        salePrice: 0.00,
                        stock: 0,
                        url: ''
                    }
                    productsIndex++

                    index++
                    combination[n - 1] = index
                    for (var j = n - 1; j >= 0; j--) {
                        if (combination[j] >= specValues[j].length) {
                            combination[j] = 0
                            index = 0
                            if (j - 1 >= 0) {
                                combination[j - 1] = combination[j - 1] + 1
                            }
                        }
                    }
                    isContinue = false
                    for (var p = 0; p < n; p++) {
                        if (combination[p] !== 0) {
                            isContinue = true
                        }
                    }
                } while (isContinue)

                this.stocks = stocks
            },
            handleProductShow(row) {
                this.productForm = Object.assign({}, row)
                this.productVisiable = true
            },
            uploadProductUrl: function (response) {
                this.productForm.url = response.data
            },
            handleProductEdit() {
                for (var i = 0; i < this.stocks.length; i++) {
                    const v = this.stocks[i]
                    if (v.id === this.productForm.id) {
                        this.stocks.splice(i, 1, this.productForm)
                        break
                    }
                }

                this.productVisiable = false
            },
            handleAttributeShow() {
                this.attributeForm = {}
                this.attributeVisiable = true
            },
            handleAttributeAdd() {
                this.attributes.unshift(this.attributeForm)
                this.attributeVisiable = false
            },
            handleAttributeDelete(row) {
                const index = this.attributes.indexOf(row)
                this.attributes.splice(index, 1)
            },
            uploadAvatar(item) {
                const formData = new FormData()
                formData.append('commodityIcon', item.file)
                const uid = item.file.uid
                /*                createStorage(formData).then(res => {
                                    this.picList.push({ key: uid, value: res.data.data.url })
                                    this.emptyUpload()
                                }).catch(() => {
                                    this.$message.error('上传失败，请重新上传')
                                    this.emptyUpload()
                                })*/
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
            uploadFile(file) {
                this.params.append('commodityIcon', file.file);

            },
            uploadIconFile(file) {
                this.params.append('iconFile', file.file);
            },
            handleRemove(file, fileList) {
                for (const i in this.picList) {
                    if (this.picList[i].key === file.uid) {
                        this.picList.splice(i, 1)
                    }
                }
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url
                this.dialogVisible = true
            },
            /**
             * 清空上传组件
             */
            emptyUpload() {
                const mainImg = this.$refs.upload
                if (mainImg) {
                    if (mainImg.length) {
                        mainImg.forEach(item => {
                            item.clearFiles()
                        })
                    } else {
                        this.$refs.upload.clearFiles()
                    }
                }
            }
        }
    }
</script>
