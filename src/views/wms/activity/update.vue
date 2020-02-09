<template> 
  <home-advertise-detail :isEdit="true"></home-advertise-detail>
</template>
<script>
  import HomeActivityDetail from './components/ActivityDetail'
  export default {
    name: 'HomeActivityDetail',
    components: { HomeAdvertiseDetail: HomeActivityDetail }
  }
</script>
<style></style>


