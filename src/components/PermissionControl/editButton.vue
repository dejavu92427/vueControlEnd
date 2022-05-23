<template>
     <el-tooltip :enterable="false"  :content="this.rolePermission.canEdit?'修改':'檢視'" placement="top-start" effect="light">
    <el-button
      :icon="this.rolePermission.canEdit?'el-icon-edit-outline':'el-icon-document'"
      type="primary" plain
      size="small"
      @click="handlEdit"
    ></el-button>
     </el-tooltip>
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
      isEdit: false,
    };
  },
  created() {
    this.checkType();
  },
  methods: {
    handlEdit() {
      this.$emit("click", this.fn);
    },
    checkType() {
      if (this.rolePermission.canEdit) {
        this.isEdit = true;
      } else this.isEdit = false;
    },
  },
};
</script>
