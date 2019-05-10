<template>
  <div>
    <router-view :shop="shop"></router-view>
  </div>
</template>
<script>
  export default {
    props: {
      shop: {
        type: Object
      }
    }
  };
</script>
