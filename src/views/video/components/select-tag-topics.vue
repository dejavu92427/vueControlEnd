<template>
  <el-select
    v-loading="listLoading"
    v-model="id"
    clearable
    placeholder="標籤分類"
    default-first-option
    filterab
    :disabled="disable"
    :size="domsize"
    @change="() => this.$emit('update:topicId', id)"
  >
    <el-option
      v-for="item in topicOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>

<script>
import { GetVideoTagTopics } from "@/api/video";

//props:topicId
//emit even:getTagTopics
export default {
  props: {
    spaceId: "",
    topicId: "",
    domsize: "",
    disable: false,
  },
  data() {
    return {
      listLoading: false,
      topicOptions: [],
      id: 0,
    };
  },
  created() {
    this.id = this.topicId;
    this.getVideoTagTopics();
  },
  watch: {
    spaceId: async function (val) {
      if (val) {
        await this.getVideoTagTopics();
      }
    },
     topicId(val) {
      this.id = val;
    }
  },
  methods: {
    async getVideoTagTopics() {
      if (!this.spaceId) return;
      this.listLoading = true;
      const res = await GetVideoTagTopics(this.spaceId);
      this.topicOptions = res.data.map(function (o) {
        var rObj = {};
        rObj.value = o.id;
        rObj.label = o.topic;
        return rObj;
      });
      this.$emit("getTagTopics", this.topicOptions);
      setTimeout(() => {
        this.listLoading = false;
      }, 0.3 * 1000);
    },
  },
};
</script>