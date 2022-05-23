<template>
  <el-select
    v-loading="listLoading"
    v-model="id"
    clearable
    placeholder="作者"
    default-first-option
    filterable
    :size="domsize"
    @change="() => this.$emit('update:artist', id)"
  >
    <el-option
      v-for="item in ownerOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>

<script>
import { GetVideoOwner } from "@/api/video";

//props:artist
//emit even:getOwners
export default {
  props: {
    artist: "",
    domsize: ""
  },
  data() {
    return {
      listLoading: false,
      ownerOptions: [],
      id: 0,
      
    };
  },
  watch: {
    artist(val) {
      this.id = val;
    },
  },
  created() {
    this.id = this.ownerId;
    this.getOwners();
  },
  methods: {
    async getOwners() {
      this.listLoading = true;
      const res = await GetVideoOwner();
      this.ownerOptions = res.data.map(function (o) {
        var rObj = {};
        rObj.value = o.id;
        rObj.label = o.artist;
        return rObj;
      });
      this.$emit("getOwners", this.ownerOptions);
      setTimeout(() => {
        this.listLoading = false;
      }, 0.3 * 1000);
    },
  },
};
</script>