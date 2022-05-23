<template>
 <el-tooltip :enterable="false"   content="刪除" placement="top-start" effect="light">
  <el-button v-if="rolePermission.canDelete" type="danger" plain icon="el-icon-delete" size="small" @click="handlDelete"></el-button>
  </el-tooltip >
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
    handlDelete() {
      this.$emit("click", this.fn);
    },
  },
};
</script>
