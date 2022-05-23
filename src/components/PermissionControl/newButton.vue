<template>
  <el-button icon="el-icon-edit" v-if="rolePermission.canEdit" type="primary" @click="handlAdd">新增</el-button>
</template>

<script>
export default {
  props: {
    fn: {
      type: Function,
    },
    rolePermission:{}
  },
  methods: {
    handlAdd() {
      this.$emit("click", this.fn);
    },
  },
};
</script>
