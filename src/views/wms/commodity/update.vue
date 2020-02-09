<template>
  <div class="app-container">

    <el-card class="box-card">
      <h3>商品介绍</h3>
      <el-form ref="product" :rules="rules" :model="commodity" label-width="150px">

        <el-form-item label="商品名称" prop="commodityName">
          <el-input v-model="commodity.commodityName"/>
        </el-form-item>

        <el-form-item label="商品品牌：">
          <el-input v-model="commodity.brand"/>
        </el-form-item>

        <el-form-item label="地址：" >
          <el-input v-model="commodity.location"/>
        </el-form-item>

        <el-form-item label="租金：" style="width: 1400px;" prop="rent">
          <el-input v-model="commodity.rent">
            <template slot="append">
              <el-input v-model="commodity.unit" style="width: 100px"/>
            </template>
          </el-input>
        </el-form-item>

        <!--<el-form-item label="商品图片" style="width: 500px">
          <div class="IconClass">
            <img v-if="commodity.commodityIcon" v-for="tag in commodityIconArray" :src="tag" class="avatar" >
          </div>
          <el-upload
            action="#"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList"
            multiple
            :http-request="uploadFile"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            &lt;!&ndash;<img v-if="commodity.commodityIcon" :src="commodity.commodityIcon" class="avatar">&ndash;&gt;
            <img v-if="commodity.commodityIcon" v-for="tag in commodityIconArray" :src="tag" class="avatar">

            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>

          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>-->

        <el-form-item label="商品图片">
          <ul v-if="commodityIconArray" class="img-box">
            <li v-for="(item,index) in commodityIconArray" :key="index" class="img-item" @mouseenter="showmask(index)"
                @mouseleave="hiddenmask(index)">
              <div class="mask" ref="mask">
                <i class="el-icon-zoom-in" @click="scaleImg(index)"></i>
                <i class="el-icon-delete" @click="deleteImg(index)"></i>
              </div>
              <img :src="item" class="avatar">
            </li>
          </ul>
          <ul v-if="commodityIconArray.length < 5">
            <el-upload :action="uploadPath"
                       :on-success="muluploadSuccess"
                       :show-file-list="false"
                       list-type="picture-card"
                       :limit="1"
                       :file-list="fileList"
                       multiple
            >
              <i class="el-icon-plus avatar-uploader-icon" style="width:150px; height:150px"></i>
            </el-upload>
          </ul>

          <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>

        </el-form-item>

        <el-form-item label="商品型号：" >
          <el-input v-model="commodity.model"/>
        </el-form-item>

        <el-form-item label="商品规格：" >
          <el-input v-model="commodity.specification"/>
        </el-form-item>

<!--        <el-form-item label="商品租赁单位">
          <el-input v-model="commodity.unit" placeholder="天 / 月 "/>
        </el-form-item>-->


        <el-form-item label="商品详细介绍">
          <quillEditor ref="myTextEditor" v-model="commodity.introduce" :options="quillOption"></quillEditor>
        </el-form-item>



      </el-form>
    </el-card>

<!--    <el-card class="box-card">
      <h3>商品规格</h3>
      <el-button :plain="true" type="primary" @click="handleSpecificationShow">添加</el-button>

      <el-table :data="specifications">
        <el-table-column property="specification" label="规格名" />
        <el-table-column property="value" label="规格值" >
          <template slot-scope="scope">
            <el-tag type="primary">
              {{ scope.row.value }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="picUrl" label="规格图片">
          <template slot-scope="scope">
            <img v-if="scope.row.picUrl" :src="scope.row.picUrl" width="40">
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleSpecificationDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="specVisiable" title="设置规格">
        <el-form ref="specForm" :rules="rules" :model="specForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item label="规格名" prop="specification">
            <el-input v-model="specForm.specification"/>
          </el-form-item>
          <el-form-item label="规格值" prop="value">
            <el-input v-model="specForm.value"/>
          </el-form-item>
          <el-form-item label="规格图片" prop="picUrl">
            <el-upload
              :action="uploadPath"
              :show-file-list="false"
              :on-success="uploadSpecPicUrl"
              class="avatar-uploader"
              accept=".jpg,.jpeg,.png,.gif">
              <img v-if="specForm.picUrl" :src="specForm.picUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="specVisiable = false">取消</el-button>
          <el-button type="primary" @click="handleSpecificationAdd">确定</el-button>
        </div>
      </el-dialog>
    </el-card>-->

<!--    <el-card class="box-card">
      <h3>商品库存</h3>
      <el-table :data="stocks">
        <el-table-column property="value" label="货品规格" >
          <template slot-scope="scope">
            <el-tag v-for="tag in scope.row.specifications" :key="tag">
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
        <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleProductShow(scope.row)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="productVisiable" title="设置货品">
        <el-form ref="productForm" :model="productForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item label="货品规格列" prop="specifications">
            <el-tag v-for="tag in productForm.specifications" :key="tag">
              {{ tag }}
            </el-tag>
          </el-form-item>
          <el-form-item label="货品售价" prop="price">
            <el-input v-model="productForm.salePrice"/>
          </el-form-item>
          <el-form-item label="货品数量" prop="number">
            <el-input v-model="productForm.stock"/>
          </el-form-item>
          <el-form-item label="货品图片" prop="url">
            <el-upload
              action="#"
              :limit="5"
              :show-file-list="false"
              :on-change="handlePictureCardPreview"
              before-upload="beforeUploadImage"
              :on-success="uploadProductUrl"
              class="avatar-uploader"
              accept=".jpg,.jpeg,.png,.gif">
              <img v-if="productForm.url" :src="productForm.url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="productVisiable = false">取消</el-button>
          <el-button type="primary" @click="handleProductEdit">确定</el-button>
        </div>
      </el-dialog>
    </el-card>-->

    <!--<el-card class="box-card">
      <h3>商品参数</h3>
      <el-button :plain="true" type="primary" @click="handleAttributeShow">添加</el-button>
      <el-table :data="attributes">
        <el-table-column property="attribute" label="商品参数名称"/>
        <el-table-column property="value" label="商品参数值"/>
        <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleAttributeDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="attributeVisiable" title="设置商品参数">
        <el-form ref="attributeForm" :model="attributeForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item label="商品参数名称" prop="attribute">
            <el-input v-model="attributeForm.attribute"/>
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
      <el-button type="primary" @click="handleEdit">更新商品</el-button>
    </div>

  </div>
</template>

<style >
 .img-box {
   display: flex;
   flex-wrap: wrap;
 }
 .img-item {
   justify-content: space-around;
   width: 148px;
   height: 148px;
   margin: 0 5px;
   overflow: hidden;
   border-radius: 6px;
   position: relative;
 }
 .img-box > img {
   width: 100%;
   height: 100%;
 }

  .mask{
    width: 100%;
    height: 100%;
    position: absolute;
    background: rgba(255,255,255,.5);
    top: 0;
    left: 0;
  }
 .mask  i{
   color: #fff;
   font-weight: 400;
   font-size: 18px;
   margin: 0 10px;
 }


      .el-form-item__content  >  div  {
            float:  left;
  }

      .el-form-item__content ul  {
            float:  left;
  }

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
    width: 100%;
    height: 100%;
    display: block;
  }

  .IconClass {
    display: flex;
    justify-content: flex-start;
  }
</style>

<script>
    import { getCommodity, updateCommodity } from '@/api/commodity'
    import { uploadPath } from '@/api/storage'
    import { MessageBox } from 'element-ui'
    import {quillEditor} from 'vue-quill-editor';
    import quillConfig from '@/utils/quill-config.js'

    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    export default {
        name: 'GoodsEdit',
        components: { quillEditor },
        data() {
            return {
                gdialogVisible:false,
                gdialogImageUrl:'',
                dialogVisible:false,
                dialogImageUrl:'',
                quillOption: quillConfig,
                editor: null,
                params : new FormData(),
                dialogImageUrl: '',
                fileList: [],
                dat: {
                    content: ''
                },
                ueditor: {
                    value: '编辑器默认文字',
                    config: {
                        initialFrameWidth: 800,
                        initialFrameHeight: 320
                    }
                },
                uploadPath,
                commodityIconArray: [],
                newKeywordVisible: false,
                newKeyword: '',
                selectProductTypeValue: null,
                keywords: [],
                brandOptions: [],
                productType: [],
                categoryList: [],
                //product: { gallery: [] },
                commodity: {
                    commodityId: '',
                    commodityName: '',
                    commodityType: '',
                    salePrice: '',
                    purchasePrice: '',
                    isScoreProduct: '',
                    scoreProportion: '',
                    commodityIcon: '',
                    rent: '',
                    location: '',
                    unit: '',
                    specification: '',
                    productionPlace: '',
                    productProfile: '',
                    material: '',
                    description: '',
                    model: '',
                    brand: ''
                },
                productTypeOptions: [],
                specVisiable: false,
                specForm: { specification: '', value: '', picUrl: '' },
                specifications: [{ specification: '规格', value: '标准', picUrl: '' }],
                productVisiable: false,
                productForm: {
                    id: 0,
                    specifications: [],
                    salePrice: 0.0,
                    stock: 0,
                    url: ''
                },
                stocks: [
                    { stockId: 0, specifications: ['标准'], salePrice: 0.0, stock: 0, url: '' }
                ],
                attributeVisiable: false,
                attributeForm: { attribute: '', value: '' },
                attributes: [],
                rules: {
                    productId: [
                        {required: true, message: '商品编号不能为空', trigger: 'blur'}
                    ],
                    commodityName: [{required: true, message: '严选商品名称不能为空', trigger: 'blur'}],
                    rent: [{required: true, message: '严选商品租金不能为空', trigger: 'blur'}]
                },
                editorInit: {
                    language: 'zh_CN',
                    convert_urls: false,
                    plugins: [
                        'advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'
                    ],
                    toolbar: [
                        'searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample',
                        'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen'
                    ]

                }
            }
        },
        watch: {
            selectProductTypeValue: function (newValue) {

                if (newValue != null && newValue.length === 2) {
                    this.product.productType = newValue[1];
                } else {
                    this.product.productType = null;
                }

            }
        },
        created() {
            this.init();

        },
        mounted(){

        },
        methods: {
            init: function () {
                if (this.$route.query.commodityId == null) {
                    return
                }

                let params = new URLSearchParams();
                params.append("commodityId", this.$route.query.commodityId);
                params.append("queryType", this.$route.query.queryType);

                getCommodity(params).then(response => {

                    this.commodity.commodityName = response.data.commodityName;
                    this.commodity.commodityId = response.data.commodityId;
                    this.commodity.brand = response.data.brand;
                    this.commodity.location = response.data.location;
                    this.commodity.model = response.data.model;
                    this.commodity.introduce = response.data.introduce;
                    this.commodity.companyName = response.data.companyName;
                    this.commodity.rent = response.data.rent;
                    this.commodity.commodityIcon = response.data.commodityIcon;
                    //遍历图片
                    this.commodityIconArray = response.data.commodityIcon.split(",");
                    console.log("commodityIconArray.length：" + this.commodityIconArray.length);
                    this.commodity.unit = response.data.unit;
                    this.commodity.power = response.data.power;

                    this.commodity.scoreProportion = response.data.scoreProportion;
                    this.commodity.material = response.data.material;
                    this.commodity.productionPlace = response.data.productionPlace;
                    this.commodity.productProfile = response.data.productProfile;
                    this.commodity.specification = response.data.specification;
                    //this.product.brand= response.data.brandId;
                    const typeProduct = response.data.productType;
                    this.specifications = response.data.specificationsList;
                    this.stocks = response.data.stockList;

                    this.attributes = response.data.attributes;
                    //this.getProductCateList(typeProduct);
                    //this.getBrandList();
                }).catch(err=>{console.log(err)});

            },
            beforeUploadImage(file) {
                this.product.append('file', file)
                return false
            },
            handleCategoryChange(value) {
                this.product.categoryId = value[value.length - 1]
            },
            handleCancel: function() {
                this.$router.push({ path: '/pms/product' })
            },
            handleEdit: function () {
                let commodityIcon = '';
                for (let i = 0; i < this.commodityIconArray.length; i++) {
                    console.log(this.commodityIconArray[i]);
                    commodityIcon = commodityIcon + this.commodityIconArray[i] + ","
                }
                this.commodity.commodityIcon = commodityIcon.substring(0, commodityIcon.length - 1);
                console.log("commodityIcon----" + this.commodity.commodityIcon);

                const finalGoods = {
                    commodity: this.commodity,
                    specifications: this.specifications,
                    stocks: this.stocks,
                    attributes: this.attributes
                };
                console.log("commodityIconArray.length----" + this.commodityIconArray.length);
                console.log("commodityIconArray----" + this.commodityIconArray);
                console.log("commodity----"+JSON.stringify(finalGoods.commodity));
                console.log("product----"+JSON.stringify(finalGoods.product));
                console.log("specifications----"+JSON.stringify(finalGoods.specifications));
                console.log("stocks----"+JSON.stringify(finalGoods.stocks));
                console.log("attributes----"+JSON.stringify(finalGoods.attributes));

                let params = new URLSearchParams;
                params.append("stocks",JSON.stringify(this.stocks));
                params.append("commodity",JSON.stringify(this.commodity));
                params.append("specification",JSON.stringify(this.specifications));
                params.append("attributes",JSON.stringify(this.attributes));
                params.append("finalGoods",JSON.stringify(finalGoods.product));

/*
                let commodity = {
                    "commodityId": this.commodity.commodityId,
                    "commodityName": this.commodity.commodityName,
                    "rent": this.commodity.rent,
                    "brand": this.commodity.brand,
                    "commodityId": this.commodity.commodityId,
                    "commodityId": this.commodity.commodityId
                }
*/

                updateCommodity(params)
                    .then(response => {
                        this.$notify.success({
                            title: '成功',
                            message: '更新成功'
                        })
                        this.$router.push({ path: '/wms/commodity' })
                    })
                    .catch(response => {
                        MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
                            confirmButtonText: '确定',
                            type: 'error'
                        })
                    })
            },

            handleResetSearch() {
                this.selectProductTypeValue = [];
                this.listQuery = Object.assign({}, defaultListQuery);
            },
            handleClose(tag) {
                this.keywords.splice(this.keywords.indexOf(tag), 1)
                this.product.keywords = this.keywords.toString()
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
                    this.product.keywords = this.keywords.toString()
                }
                this.newKeywordVisible = false
                this.newKeyword = ''
            },
            uploadPicUrl: function(response) {
                this.product.productIcon = response.data
            },
            uploadOverrun: function() {
                this.$message({
                    type: 'error',
                    message: '上传文件个数超出限制!最多上传5张图片!'
                })
            },
            handleGalleryUrl(response, file, fileList) {
                if (response.errno === 0) {
                    this.product.gallery.push(response.data)
                }
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true
            },
            handleRemove: function(file, fileList) {
                for (var i = 0; i < this.product.gallery.length; i++) {
                    // 这里存在两种情况
                    // 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
                    //    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
                    // 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
                    var url
                    if (file.response === undefined) {
                        url = file.url
                    } else {
                        url = file.response.data
                    }

                    if (this.product.gallery[i] === url) {
                        this.product.gallery.splice(i, 1)
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
            uploadFile(file){
                this.params.append('file', file.file);
                return false;
            },
            specChanged: function(label) {
                if (label === false) {
                    this.specifications = [
                        { specification: '规格', value: '标准', picUrl: '' }
                    ]
                    this.stocks = [
                        { stockId: 0, specifications: ['标准'], salePrice: 0.0, stock: 0, url: '' }
                    ]
                } else {
                    this.specifications = []
                    this.stocks = []
                }
            },
            uploadSpecPicUrl: function(response) {
                this.specForm.picUrl = response.data
            },
            handleSpecificationShow() {
                this.specForm = { specification: '', value: '', picUrl: '' }
                this.specVisiable = true
            },
            handleSpecificationAdd() {
                var index = this.specifications.length - 1
                for (var i = 0; i < this.specifications.length; i++) {
                    const v = this.specifications[i]
                    if (v.specification === this.specForm.specification) {
                        index = i
                    }
                }

                this.specifications.splice(index + 1, 0, this.specForm)
                this.specVisiable = false

                this.specToProduct()
            },
            handleSpecificationDelete(row) {
                const index = this.specifications.indexOf(row)
                this.specifications.splice(index, 1)
                this.specToProduct()
            },
            specToProduct() {
                if (this.specifications.length === 0) {
                    return
                }
                // 根据specifications创建临时规格列表
                var specValues = []
                var spec = this.specifications[0].specification
                var values = []
                values.push(0)

                for (var i = 1; i < this.specifications.length; i++) {
                    const aspec = this.specifications[i].specification

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
                    var specifications = []
                    for (var x = 0; x < n; x++) {
                        var z = specValues[x][combination[x]]
                        specifications.push(this.specifications[z].value)
                    }
                    stocks[productsIndex] = {
                        stockId: productsIndex,
                        specifications: specifications,
                        salePrice: 0.0,
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
            uploadProductUrl: function(response) {
                this.productForm.url = response.data.url
            },
            handleProductEdit() {
              console.log(this.stocks);

                for (var i = 0; i < this.stocks.length; i++) {
                    const v = this.stocks[i]
                    if (v.stockId === this.productForm.id) {
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
            // 鼠标移动上图片
            showmask(index){
                this.$refs.mask[index].style.display='block';
            },
            // 鼠标离开图片
            hiddenmask(index){
                this.$refs.mask[index].style.display='none';
            },
            //点击放大图片
            scaleImg(index){
                this.dialogVisible=true;
                this.dialogImageUrl = this.commodityIconArray[index];
            },
            deleteImg(index){
                this.commodityIconArray.splice(index,1);
                this.fileList.splice(index,1);
            },
            muluploadSuccess(res){
                this.commodityIconArray.push(res.data);
                let obj={};
                obj={
                    name:'file',
                    url:res.data,
                };
                this.fileList.push(obj);

            }
        }
    }
</script>
