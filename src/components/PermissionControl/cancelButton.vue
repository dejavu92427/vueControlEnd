<template>
  <el-button icon="el-icon-close" :type="type" @click="handlCancel">{{ text }}</el-button>
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
      type: "danger",
      text: "取消"
    };
  },
  created() {
    this.checkType();
  },
  methods: {
    handlCancel() {
      this.$emit("click", this.fn);
    },
    checkType() {
      if (this.rolePermission.canEdit) {
        this.type = "danger";
        this.text = "取消";
      }
      if (this.rolePermission.canView && !this.rolePermission.canEdit) {
        this.type = "primary"
        this.text = "關閉";
      }
    },
  },
};
</script>