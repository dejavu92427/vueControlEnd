<template>
  <div class="app-container">
    <selectVendor
      v-show="false"
      :spaceId.sync="currentVender"
      :clear="false"
      @getVendors="getVendors"
    ></selectVendor>
    <div class="box" style="max-width: 700px">
      <el-form ref="vender" label-width="100px" :model="vender" :rules="rule">
        <el-form-item label="廠商名稱" label-position="right" prop="spaceName">
          {{ vender.spaceName }}
        </el-form-item>
        <el-form-item
          label="廠商類型"
          label-position="right"
          prop="roleType"
          v-if="isAdmin"
        >
          <el-radio-group v-model="vender.roleType">
            <el-radio
              v-for="item in roleTypeOptions"
              :key="item.value"
              :label="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="圖片空間域名"
          label-position="right"
          prop="imageSpaceDomain"
        >
          <el-select
            v-loading="cdnsLoading"
            v-model="vender.imageSpaceDomain"
            default-first-option
            style="width: 400px"
          >
            <el-option
              v-for="item in this.cdns"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="視頻空間域名"
          label-position="right"
          prop="videoSpaceDomain"
        >
          <el-select
            v-loading="cdnsLoading"
            v-model="vender.videoSpaceDomain"
            default-first-option
            style="width: 400px"
          >
            <el-option
              v-for="item in this.cdns"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="使用外部域名"
          label-position="right"
          prop="usedOut"
          v-if="isAdmin"
        >
          <el-switch
            v-model="vender.usedOut"
            actice-color="#00A854"
            active-text="是"
            :active-value="1"
            inactive-color="#F04134"
            inactive-text="否"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>

        <el-form-item
          label="是否啟用"
          label-position="right"
          prop="isEnable"
          v-if="isAdmin"
        >
          <el-switch
            v-model="vender.isEnable"
            actice-color="#00A854"
            active-text="啟用"
            :active-value="true"
            inactive-color="#F04134"
            inactive-text="停用"
            :inactive-value="false"
          >
          </el-switch>
        </el-form-item>

        <!--el-form-item
          label="視頻標籤"
          label-position="right"
          v-if="this.dialogType != 'new'"
        >
          <el-select
            v-model="vender.tag"
            multiple
            style="width: 400px"
            placeholder="選擇標籤"
          >
            <el-option
              v-for="item in tags"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item-->
      </el-form>
      <div style="text-align: right">
        <cancelBtn
          :rolePermission="rolePermission"
          @click="handleCancel()"
        ></cancelBtn>
        <saveBtn :rolePermission="rolePermission" @click="saveVender"></saveBtn>
      </div>
    </div>
  </div>
</template>

<script>
import path from "path";
import { deepClone } from "@/utils";
//import { getRole, getRoutes, updateRoute } from "@/api/role";
import { PutVenders, GetVendersCount, GetCdns } from "@/api/video";
//import elementIcons from "./element-icons";
import selectVendor from "./components/select-vendor";
//permission control button start
import getRolePermission from "../../utils/role-permission";
import saveBtn from "@/components/PermissionControl/saveButton";
import cancelBtn from "@/components/PermissionControl/cancelButton";

const defaultVender = {
  apiSpaceDomain: undefined,
  createDate: "",
  createUser: "",
  id: undefined,
  imageSpaceDomain: undefined,
  isEnable: false,
  unLoadCount: 0,
  lastUpdateTime: "",
  lastUpdateUser: "",
  processCount: 0,
  spaceName: "",
  tag: undefined,
  roleType: undefined,
  usedOut: 0,
  videoCount: 0,
  videoSpaceDomain: undefined,
  watermark: "",
  watermarkUpload: 0,
  language: undefined,
};

export default {
  data() {
    return {
      isAdmin: false,
      currentVender: undefined,
      currentRoleType: undefined,
      allCdns: [],
      vender: Object.assign({}, defaultVender),
      venders: [],
      venderPageList: [],
      listLoading: false,
      rule: {},
      cdns: [],
      cdnsLoading: false,
    };
  },
  watch: {},
  components: {
    saveBtn,
    cancelBtn,
    selectVendor,
  },

  computed: {
    rolePermission() {
      return this.getRolePermissions();
    },
  },

  filters: {
    chValue: function (value, item) {
      let find = item.find((e) => e.value == value);
      if (find) return find.label;
      else return value;
    },
  },

  created() {
    this.isAdmin = this.$store.getters.vendorId == 0;
    this.currentVender = this.$store.getters.vendorId;
    this.getVenders();
    this.filterCdn();
  },

  methods: {
    getVendors(data) {
      this.venders = data;
    },
    handleCancel() {
      this.getVenders();
      this.filterCdn();
    },
    async saveVender() {
      //儲存變更

      let isVaild = false;
      this.$refs.vender.validate((valid) => {
        if (valid) isVaild = true;
      });
      if (!isVaild) return;
      const updateData = {
        type: 2,
        apiSpaceDomain:
          this.vender.apiSpaceDomain == "" ? 0 : this.vender.apiSpaceDomain,
        createUser: this.$store.getters.account,
        id: this.vender.id,
        imageSpaceDomain:
          this.vender.imageSpaceDomain == "" ? 0 : this.vender.imageSpaceDomain,
        isEnable: this.vender.isEnable,
        lastUpdateUser: this.$store.getters.account,
        spaceName: this.vender.spaceName,
        roleType: this.vender.roleType,

        usedOut: this.vender.usedOut,
        videoSpaceDomain:
          this.vender.videoSpaceDomain == "" ? 0 : this.vender.videoSpaceDomain,
        language: this.vender.language,
      };

      await PutVenders(updateData);
      this.getVenders();
      this.$notify({
        title: "更新成功",
        dangerouslyUseHTMLString: true,
        type: "success",
      });
    },

    async getVenders(isCallApi = true) {
      if (this.currentVender == undefined) return;

      const res = await GetVendersCount(this.currentVender);
      if (res.data && res.data.length > 0) {
        this.vender = res.data[0];
      }
    },

    getRolePermissions() {
      //獲取權限
      return getRolePermission(this.$route.name);
    },
    async filterCdn() {
      this.cdnsLoading = true;
      const res = await GetCdns();
      this.allCdns = res.data.map(function (o) {
        return { value: o.id, label: o.cdn, spaceId: o.spaceId };
      });
      var id = this.currentVender;
      this.cdns = this.allCdns.filter((i) => {
        return i.spaceId == id;
      });
      setTimeout(() => {
        this.cdnsLoading = false;
      }, 0.3 * 1000);
    },
  },
};
</script>
