<template>
  <div class="app-container">py</div>
</template>

<script>
export default {
  name: "PaperCheck",
  data() {
    return {};
  },
  created() {
    if (this.$route.params && this.$route.params.info) {
      let info = JSON.parse(this.$route.params.info);
      console.log(info);
    }
  },
  methods: {},
};
</script>

<style>
</style>