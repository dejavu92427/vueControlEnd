<template>
  <el-select
    v-loading="listLoading"
    v-model="title"
    clearable
    :placeholder="spaceId && spaceId>0 ?'視頻分類':'請先選擇供影商'"
    default-first-option
    filterable
    :size="domsize"
    @change="() => this.$emit('update:tagTitle', title)"
  >
    <el-option
      v-for="item in tagOptions"
      :key="item.label"
      :label="item.label"
      :value="item.label"
    ></el-option>
  </el-select>
</template>

<script>
import { GetVedioAllTags } from "@/api/video";

//props:tagId
//emit even:getAllTags
export default {
  props: {
    tagTitle: "",
    domsize: "",
    spaceId: 0,
    topic: "",
  },

  data() {
    return {
      listLoading: false,
      tagOptions: [],
      title: "",
    };
  },
  watch: {
    topic: async function (val) {
      if (val) {
        await this.getAllTags();
      }
    },
    tagTitle(val) {
      this.title = val;
    },
  },
  created() {
    this.title = this.tagTitle;
    this.getAllTags();
  },
  methods: {
    async getAllTags() {
      this.title = "";

      if (!this.spaceId) return;
      this.listLoading = true;
      var topic = 0;
      if (this.topic != 0 && this.topic && this.topic!="") topic = this.topic;
      const res = await GetVedioAllTags(this.spaceId, topic);
      this.tagOptions = res.data.map(function (o) {
        var rObj = {};
        rObj.value = o.id;
        rObj.label = o.title;
        return rObj;
      });
      this.$emit("getTags", this.tagOptions);
      setTimeout(() => {
        this.listLoading = false;
      }, 0.3 * 1000);
    },
  },
};
</script>