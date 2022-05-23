<template>
  <el-select
    v-loading="listLoading"
    v-model="id"
    :clearable="clear"
    :placeholder="placeholderText ? placeholderText : '請選擇'"
    filterable
    default-first-option
    :size="domsize"
    :disabled="disable"
    @change="() => this.$emit('update:spaceId', id)"
  >
    <el-option
      v-for="item in vendorOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>

<script>
import { GetVendersNoCount } from "@/api/video";

//props:spaceId
//emit even:getVendors
export default {
  props: {
    spaceId: "", //bind id
    placeholderText: undefined,
    clear: false, //是否可清除
    domsize: "", //元件大小
    addAll: false, //增加"全部"
    allText: "", //自訂全部文字
    disable: false, //元件禁用
    roleType: undefined, //限定廠商類別;0:不限
    self: false, //限定自己
    addUnClass: false, //增加顯示未分類
    addUsedOut: true,
    showDisable: false, //顯示停用廠商
    selectOnlyOne: false,
  },
  data() {
    return {
      listLoading: false,
      vendorOptions: [],
      id: 0,
    };
  },
  watch: {
    spaceId(val) {
      this.id = val;
    },
  },
  created() {
    this.id = this.spaceId;
    this.getVendors();
  },
  methods: {
    async getVendors() {
      this.listLoading = true;

      var res = await GetVendersNoCount();
      var allVendors = res.data;
      var vendors = allVendors.map(function (o) {
        var rObj = {};
        rObj.value = o.id;
        rObj.label = o.isEnable ? o.spaceName : `${o.spaceName} (停用)`;
        rObj.isEnable = o.isEnable;
        rObj.usedOut = o.usedOut;
        rObj.roleType = o.roleType;
        rObj.imageSpaceDomain=o.imageSpaceDomain;
        rObj.videoSpaceDomain=o.videoSpaceDomain;
        return rObj;
      });
      this.$emit("getVendors", vendors); //回傳父層全部清單
      var endableVendors = [];
      if (
        (!this.self || this.self == 0) &&
        (!this.roleType || this.roleType == 0) &&
        !this.addUnClass
      )
        //沒有特殊要求
        endableVendors = vendors;
      else {
        if (this.self && this.self > 0) {
          var tempAry = vendors.filter((i) => i.value == this.self);
          if (tempAry) endableVendors = endableVendors.concat(tempAry);
        } else if (this.roleType > 0) {
          var tempAry = vendors.filter((i) => i.roleType == this.roleType);
          if (tempAry) endableVendors = endableVendors.concat(tempAry);
          if (this.roleType == 2 && this.addUsedOut) {
            var tempAry = vendors.filter(
              (i) => i.usedOut == 1 && i.roleType == 1
            );
            if (tempAry) endableVendors = endableVendors.concat(tempAry);
          }
        }
        if (this.addUnClass) {
          var tempAry = vendors.filter((i) => i.roleType == 9);
          if (tempAry) endableVendors = endableVendors.concat(tempAry);
        }
      }
      if (!this.showDisable) {
        endableVendors = endableVendors.filter((i) => i.isEnable === true);
      }

      this.vendorOptions = endableVendors;
      if (this.addAll) {
        var all = {
          value: 0,
          label:
            this.allText && this.allText.length > 0 ? this.allText : "全部",
          isEnable: true,
          roleType: 9,
          usedOut: 0,
        };
        this.vendorOptions.splice(0, 0, all);
      }
      if (this.selectOnlyOne && this.vendorOptions.length == 1) {
        this.id = this.vendorOptions[0].value;
        this.$emit("update:spaceId", this.id);
      }

      this.$emit("update:optionCount", this.vendorOptions.length);

      //回填被清單過濾掉的 ex 選定停用廠商後，再關閉停用顯示
      var findvendor = this.vendorOptions.find((o) => o.value == this.id);
      if (!findvendor) {
        this.id = undefined;
        this.$emit("update:spaceId", this.id);
        /*
        findvendor = allVendors.find((o) => o.id == this.id);
        if (findvendor)
          endableVendors.push({
            value: findvendor.id,
            label: findvendor.isEnable
              ? findvendor.spaceName
              : `${findvendor.spaceName} (停用)`,
            isEnable: findvendor.isEnable,
            roleType: findvendor.roleType,
            usedOut: findvendor.usedOut,
          });
          */
      }
      setTimeout(() => {
        this.listLoading = false;
      }, 0.3 * 1000);
    },
  },
};
</script>