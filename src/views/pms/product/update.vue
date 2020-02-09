<template>
  <div class="app-container">

    <el-card class="box-card">
      <h3>商品介绍</h3>
      <el-form ref="product" :rules="rules" :model="product" label-width="150px">
        <!--<el-form-item label="商品编号" prop="productId">
          <el-input v-model="product.productId" readonly/>
        </el-form-item>-->

        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="product.productName"/>
          <el-input v-model="product.productId" type="hidden" />
        </el-form-item>
        <el-form-item label="进购价格" prop="purchasePrice">
          <el-input v-model="product.purchasePrice" placeholder="0.00">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销售价格" prop="salePrice">
          <el-input v-model="product.salePrice" placeholder="0.00">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否积分商品" prop="isScoreProduct">
          <el-radio-group v-model="product.isScoreProduct">
            <el-radio :label="true">积分商品</el-radio>
            <el-radio :label="false">非积分商品</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="积分" >
          <el-input v-model="product.scoreProportion" placeholder="0">
            <template slot="append">分</template>
          </el-input>
        </el-form-item>
<!--        <el-form-item label="是否在售" prop="isOnSale">
          <el-radio-group v-model="product.isOnSale">
            <el-radio :label="true">在售</el-radio>
            <el-radio :label="false">未售</el-radio>
          </el-radio-group>
        </el-form-item>-->

        <el-form-item label="商品图片">
          <el-upload
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="product.productIcon" :src="product.productIcon" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>

        <el-form-item label="商品单位">
          <el-input v-model="product.unit" placeholder="件 / 个 / 盒"/>
        </el-form-item>

        <el-form-item label="产地">
          <el-input v-model="product.productionPlace" />
        </el-form-item>

        <el-form-item label="原料">
          <el-input v-model="product.material" />
        </el-form-item>

        <el-form-item label="所属分类">
          <el-cascader
            clearable
            v-model="selectProductTypeValue"
            :options="productTypeOptions">
          </el-cascader>
        </el-form-item>

        <el-form-item label="所属品牌商">
          <el-select v-model="product.brand">
            <el-option v-for="item in brandOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品简介">
          <el-input v-model="product.productProfile"/>
        </el-form-item>

        <el-form-item label="商品详细介绍">
          <!--<editor :init="editorInit" v-model="product.description"/>-->
          <Uediter  :config="ueditor.config" ref="ue" v-model="product.description"></Uediter>
        </el-form-item>


      </el-form>
    </el-card>

    <el-card class="box-card">
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
    </el-card>

    <el-card class="box-card">
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
              :action="uploadPath"
              :show-file-list="false"
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
    </el-card>

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
    import { getProduct, updateProduct } from '@/api/product'
    import Editor from '@tinymce/tinymce-vue'
    import { uploadPath } from '@/api/storage'
    import { MessageBox } from 'element-ui'
    import {fetchList as fetchBrandList} from '@/api/brand'
    import {fetchListWithChildren} from '@/api/productType'

    import Uediter from '@/components/UE.vue';
    export default {
        name: 'GoodsEdit',
        components: { Editor,Uediter },
        data() {
            return {
                editor: null,
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
                newKeywordVisible: false,
                newKeyword: '',
                selectProductTypeValue: null,
                keywords: [],
                brandOptions: [],
                productType: [],
                categoryList: [],
                //product: { gallery: [] },
                product: {productId:'', productName:'',productType:'',salePrice:'', purchasePrice:'',isScoreProduct:'',scoreProportion:''
                ,productIcon:'',unit:'',productionPlace:'',productProfile:'',material:'',description:''},
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
                        { required: true, message: '商品编号不能为空', trigger: 'blur' }
                    ],
                    productName: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }]
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
            init: function() {
                if (this.$route.query.id == null) {
                    return
                }

                const productId = this.$route.query.id
                getProduct(productId).then(response => {

                    this.product.productName = response.data.productName;
                    this.product.productId = response.data.productId;
                    this.product.purchasePrice = response.data.purchasePrice;
                    this.product.salePrice = response.data.salePrice;
                    this.product.isScoreProduct = response.data.isScoreProduct;
                    this.product.scoreProportion = response.data.scoreProportion;
                    this.product.productIcon = response.data.productIcon;
                    this.product.unit = response.data.unit;
                    this.product.material = response.data.material;
                    this.product.productionPlace = response.data.productionPlace;
                    this.product.productProfile = response.data.productProfile;
                    this.product.description = response.data.description;
                    this.product.brand= response.data.brandId;
                    const typeProduct = response.data.productType;
                    this.specifications = response.data.specificationsList;
                    this.stocks = response.data.stockList;

                    this.attributes = response.data.attributes;
                    this.getProductCateList(typeProduct);
                    this.getBrandList();
                }).catch(err=>{console.log(err)});

            },
            handleCategoryChange(value) {
                this.product.categoryId = value[value.length - 1]
            },
            handleCancel: function() {
                this.$router.push({ path: '/pms/product' })
            },
            handleEdit: function() {
                const finalGoods = {
                    product: this.product,
                    specifications: this.specifications,
                    stocks: this.stocks,
                    attributes: this.attributes
                };
                console.log("product----"+JSON.stringify(finalGoods.product));
                console.log("specifications----"+JSON.stringify(finalGoods.specifications));
                console.log("stocks----"+JSON.stringify(finalGoods.stocks));
                console.log("attributes----"+JSON.stringify(finalGoods.attributes));

                let params = new URLSearchParams;
                params.append("stocks",JSON.stringify(this.stocks));
                params.append("product",JSON.stringify(this.product));
                params.append("specification",JSON.stringify(this.specifications));
                params.append("attributes",JSON.stringify(this.attributes));
                params.append("finalGoods",JSON.stringify(finalGoods.product));

                updateProduct(this.product.productId,params)
                    .then(response => {
                        this.$notify.success({
                            title: '成功',
                            message: '更新成功'
                        })
                        this.$router.push({ path: '/pms/product' })
                    })
                    .catch(response => {
                        MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
                            confirmButtonText: '确定',
                            type: 'error'
                        })
                    })
            },
            getProductCateList(typeProduct) {
                fetchListWithChildren().then(response => {
                    let list = response.data;
                    this.productTypeOptions = [];
                    for (let i = 0; i < list.length; i++) {
                        let children = [];
                        if (list[i].children != null && list[i].children.length > 0) {
                            for (let j = 0; j < list[i].children.length; j++) {
                                children.push({label: list[i].children[j].typeName, value: list[i].children[j].typeId});

                                if (list[i].children[j].typeId === typeProduct) {

                                    this.product.productType = typeProduct;
                                    let a = [];
                                    a.push(list[i].typeId,list[i].children[j].typeId);

                                    this.selectProductTypeValue = a;
                                }


                            }
                        }
                        this.productTypeOptions.push({
                            label: list[i].typeName,
                            value: list[i].typeId,
                            children: children
                        });
                    }

                });
            },
            getBrandList() {
                fetchBrandList({pageNum: 1, pageSize: 100}).then(response => {
                    this.brandOptions = [];
                    let brandList = response.data;
                    for (let i = 0; i < brandList.length; i++) {
                        this.brandOptions.push({label: brandList[i].brandName, value: brandList[i].brandId});
                    }
                });
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
              console.log(row)
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
            }
        }
    }
</script>
