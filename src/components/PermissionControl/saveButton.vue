<template>
  <el-button
    :disabled="loading"
    v-if="rolePermission.canEdit"
    icon="el-icon-check"
    type="primary"
    @click="handlSave"
    >保存</el-button
  >
</template>

<script>
export default {
  props: {
    fn: {
      type: Function,
    },
    rolePermission: {},
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    handlSave() {
      this.loading = true;
      this.$emit("click", this.fn);
      setTimeout(() => {
        this.loading = false;
      }, 1 * 1000);
    },
  },
};
</script>
