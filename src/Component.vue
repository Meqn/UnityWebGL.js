<template>
  <h1 class="component-title">Vue Component</h1>
</template>

<script>
export default {
  name: 'VueComponent'
}
</script>

<style lang="scss" scoped>
@import './index.scss';
.component-title{
  display: flex;
  justify-content: center;
  align-content: center;
  width: 80%;
  padding: 10%;
  margin: 10% auto;
  background-color: #fff;
  box-shadow: 0 0 8px rgba(0, 0, 0, .1);
}
</style>
