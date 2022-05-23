<template>
  <span>
    <el-select
      v-if="domType == 'select'"
      v-loading="listLoading"
      v-model="thisCode"
      clearable
      :placeholder="placeholderText"
      default-first-option
      filterable
      :size="domsize"
      @change="() => this.$emit('update:code', thisCode)"
    >
      <el-option
        v-for="item in codeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-radio-group
      v-if="domType == 'radio'"
      v-model="thisCode"
      @change="() => this.$emit('update:code', thisCode)"
    >
      <el-radio
        v-for="item in codeOptions"
        :key="item.value"
        :label="item.value"
        >{{ item.label }}</el-radio
      >
    </el-radio-group>
  </span>
</template>

<script>
import { GetVideoTagTopics } from "@/api/video";
import { GetCodeList } from "@/api/code";

//props:topicId
//emit even:getCodeList
export default {
  props: {
    code: "",
    domType: "",
    codeType: "",
    domsize: "",
    placeholderText:""
  },
  data() {
    return {
      listLoading: false,
      codeOptions: [],
      thisCode: 0,
    };
  },
  watch: {
    code(val) {
      this.thisCode = val;
    },
  },
  created() {
    this.thisCode = this.code;
    this.getCodeList();
  },
  methods: {
    async getCodeList() {
      this.listLoading = true;
      const res = await GetCodeList({ code: this.codeType });
      this.codeOptions = res.data.map(function (o) {
        var rObj = {};
        rObj.value = o.value;
        rObj.label = o.name;
        return rObj;
      });
      this.$emit("getCodeList", this.codeOptions);
      setTimeout(() => {
        this.listLoading = false;
      }, 0.3 * 1000);
    },
  },
};
</script>