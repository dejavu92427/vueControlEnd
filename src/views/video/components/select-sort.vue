<template>
  <el-select
    v-loading="listLoading"
    v-model="id"
    :clearable="clear"
    :placeholder="spaceId && spaceId>0 ?'視頻分類':'請先選擇供影商'"
    filterable
    default-first-option
    :size="domsize"
    @change="() => this.$emit('update:sortId', id)"
  >
    <el-option
      v-for="item in sortOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>

<script>
import { GetSorts } from "@/api/video";

//props:sortId
//emit even:getSorts
export default {
  props: {
    sortId: "",
    domsize: "",
    spaceId: 0,
    clear: false,
  },
  data() {
    return {
      listLoading: false,
      sortOptions: [],
      id: 0,
    };
  },
  watch: {
    sortId(val) {
      this.id = val;
    },
  },
  created() {
    this.id = this.sortId;
    this.getSorts();
  },
  methods: {
    async getSorts() {
      this.listLoading = true;
      const res = await GetSorts();

      this.sortOptions = res.data.map(function (o) {
        var rObj = {};
        rObj.value = o.id;
        rObj.label = o.title;
        rObj.spaceId = o.spaceId;
        return rObj;
      });
      this.$emit("getSorts", this.sortOptions);

      if (this.spaceId > 0) {
        this.sortOptions = this.sortOptions.filter(
          (i) => i.spaceId == this.spaceId
        );
      } else {
        this.sortOptions = [];
        this.id = "";
      }
      if (this.id > 0) {
        var sort = this.sortOptions.find((o) => o.value == this.id);
        if (sort == undefined) {
          this.id = "";
        }
      }
      this.$emit("update:sortId", this.id);
      setTimeout(() => {
        this.listLoading = false;
      }, 0.3 * 1000);
    },
  },
};
</script>