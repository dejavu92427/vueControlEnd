<template>
   <el-autocomplete
      class="inline-input"
      v-model="text"
      :fetch-suggestions="querySearch"
      :size="domsize"
      placeholder="視頻標題"
      clearable
      style="width:100%"
      @change="() => this.$emit('update:title', text)"
      @select="() => this.$emit('update:title', text)"
    ></el-autocomplete>
</template>

<script>
import { GetVideoOwner } from "@/api/video";

//props:artist
//emit even:getOwners
export default {
  props: {
    title: "",
    domsize: ""
  },
  data() {
    return {
      text: "",
    };
  },
  watch: {
    title(val) {
      this.text = val;
    },
  },
  methods: {
      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      loadAll() {
        return [
          { "value": "【自拍】" },
          { "value": "【欧美】" },
          { "value": "【日本】" },
          { "value": "【国产】" },
          { "value": "【偷拍】" },
          { "value": "【无码】" },
        ];
      },
    },
    mounted() {
    this.restaurants = this.loadAll();
    this.text = this.title;
    }
};
</script>