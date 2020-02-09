<template>
  <div class="app-container">

    <el-card class="box-card">
      <h3>添加进货</h3>
      <el-form ref="product" :rules="rules" :model="product" label-width="100px">

<!--        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="product.productName"/>
        </el-form-item>-->

        <el-form-item label="商品名称" prop="productName">
          <el-select v-model="product.productName">
            <el-option v-for="item in productNameOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <!--<el-form-item label="所属品牌商">
          <el-select v-model="product.brand">
            <el-option v-for="item in brandOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>-->

        <el-form-item label="进货价格">
          <el-input v-model="product.purchasePrice" style="width: 220px"/>
        </el-form-item>

        <el-form-item label="进货数量">
          <el-input v-model="product.amount" style="width: 220px"/>
        </el-form-item>

        <el-form-item label="总额">
          <el-input v-model="product.turnover" style="width: 220px"/>
        </el-form-item>

      </el-form>
    </el-card>


    <div class="op-container">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handlePublish">进货</el-button>
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
    import { createProduct } from '@/api/product'
    import { createStorage, uploadPath } from '@/api/storage'
    import Editor from '@tinymce/tinymce-vue'
    import { MessageBox } from 'element-ui'
    import {fetchList as fetchBrandList} from '@/api/brand'
    import {fetchList as fetchProductList} from '@/api/product'
    import {fetchListWithChildren} from '@/api/productType'
    import {createBrand} from '@/api/purchase'
    export default {
        name: 'ProductCreate',
        components: { Editor },
        data() {
            return {
                uploadPath,
                newKeywordVisible: false,
                newKeyword: '',
                selectProductCateValue: null,
                brandOptions: [],
                turnover : this.amount * this.purchasePrice,
                productNameOptions: [],
                productTypeOptions: [],
                product: { productIcon: '' },
                specVisiable: false,
                specForm: { specification: '', value: '' },
                multipleSpec: false,
                specification: [{ specification: '规格', value: '标准' }],
                productVisiable: false,
                productForm: { id: 0, specification: [], salePrice: 0.00, stock: 99, url: '' },
                stocks: [{  specification: ['标准'], salePrice: 0.00, stock: 99, url: '' }],
                attributeVisiable: false,
                attributeForm: { attribute: '', value: '' },
                attributes: [],
                rules: {
                    merchantId: [{ required: true, message: '供货商家编号不能为空', trigger: 'blur' }],
                    productName: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }]
                },
                editorInit: {
                    language: 'zh_CN',
                    convert_urls: false,
                    plugins: ['advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'],
                    toolbar: ['searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample', 'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen'],
                    images_upload_handler: function(blobInfo, success, failure) {
                        const formData = new FormData()
                        formData.append('file', blobInfo.blob())
                        createStorage(formData).then(res => {
                            success(res.data)
                        }).catch(() => {
                            failure('上传失败，请重新上传')
                        })
                    }
                }
            }
        },
        created() {
            this.getProductCateList();
            this.getBrandList();
            this.getProductList();
        },
        watch: {
            selectProductTypeValue: function (newValue) {
                if (newValue != null && newValue.length == 2) {
                    this.product.productType = newValue[1];
                } else {
                    this.product.productType = null;
                }
            }
        },
        methods: {
            getProductCateList() {
                fetchListWithChildren().then(response => {
                    let list = response.data;
                    this.productTypeOptions = [];
                    for (let i = 0; i < list.length; i++) {
                        let children = [];
                        if (list[i].children != null && list[i].children.length > 0) {
                            for (let j = 0; j < list[i].children.length; j++) {
                                children.push({label: list[i].children[j].typeName, value: list[i].children[j].typeId});
                            }
                        }
                        this.productTypeOptions.push({label: list[i].typeName, value: list[i].typeId, children: children});
                    }
                });
            },
            getProductList() {
                let params = new URLSearchParams;
                params.append("pageNum","1");
                params.append("pageSize","900000");
                fetchProductList(params).then(response => {
                    this.productNameOptions = [];
                    let brandList = response.data;
                    for (let i = 0; i < brandList.length; i++) {

                        this.productNameOptions.push({label: brandList[i].productName, value: brandList[i].productId});
                    }
                });
            },
            handleResetSearch() {
                this.selectProductCateValue = [];
                this.listQuery = Object.assign({}, defaultListQuery);
            },
            handleCancel: function() {
                this.$router.push({ path: '/pms/purchase' })
            },
            handlePublish: function() {

               let params = new URLSearchParams;

                params.append("productId",this.product.productName);
                params.append("userId",this.product.brand);
                params.append("purchasePrice",this.product.purchasePrice);
                params.append("amount",this.product.amount);
                params.append("turnover",this.product.turnover);


                createBrand(params).then(response => {
                    this.$notify.success({
                        title: '成功',
                        message: '进货成功'
                    })
                    this.$router.push({ path: '/pms/purchase' })
                }).catch(response => {
                    MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
                        confirmButtonText: '确定',
                        type: 'error'
                    })
                })
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
            specChanged: function(label) {
                if (label === false) {
                    this.specification = [{ specification: '规格', value: '标准'}]
                    this.stocks = [{  specification: ['标准'], salePrice: 0.00, stock: 0, url: '' }]
                } else {
                    this.specification = []
                    this.stocks = []
                }
            },
            handlespecificationhow() {
                this.specForm = { specification: '', value: '' }
                this.specVisiable = true
            },
            handleSpecificationAdd() {
                var index = this.specification.length - 1
                for (var i = 0; i < this.specification.length; i++) {
                    const v = this.specification[i]
                    if (v.specification === this.specForm.specification) {
                        if (v.value === this.specForm.value) {
                            this.$message({
                                type: 'warning',
                                message: '已经存在规格值:' + v.value
                            })
                            this.specForm = {}
                            this.specVisiable = false
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
                    stocks[productsIndex] = { id: productsIndex, specification: specification, salePrice: 0.00, stock: 0, url: '' }
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
            }
        }
    }
</script>
