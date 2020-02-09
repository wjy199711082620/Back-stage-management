<template> 
  <product-detail :is-edit='true'></product-detail>
</template>
<script>
  import ProductGetDetail from './components/ProductDetail'
  export default {
    name: 'getUpdateInfo',
    components: { ProductGetDetail }
  }
</script>
<style>
</style>
