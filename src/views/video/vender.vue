<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="label">廠商</span
      ><selectVendor
        :spaceId.sync="currentVender"
        :clear="false"
        :showDisable="showDisableVendor"
        :key="vendorKey"
        :addAll="true"
        @getVendors="getVendors"
      ></selectVendor
      ><el-checkbox
        style="margin: 0px 10px"
        v-model="showDisableVendor"
        @change="resetVendor()"
        >顯示停用廠商</el-checkbox
      >
      <el-select
        v-model="currentRoleType"
        clearable
        placeholder="廠商類型"
        default-first-option
        style="width: 120px"
      >
        <el-option
          v-for="item in roleTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <!-- 新增的按鈕 -->
      <newBtn
        :rolePermission="rolePermission"
        @click="handleAddVender"
        v-if="this.$store.getters.vendorId == 0"
      ></newBtn>
    </div>
    <!-- 資料 -->
    <el-table
      v-if="rolePermission.canView"
      :data="venderPageList"
      style="width: 100%; margin-top: 20px"
      border
      header-cell-class-name="tableHeader"
      v-loading="listLoading"
    >
      <el-table-column
        :resizable="false"
        align="header-left"
        label="廠商ID"
        width="80"
      >
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="廠商名稱"
        prop="spaceName"
      >
        <template slot-scope="scope">{{ scope.row.spaceName }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="類型"
        prop="roleType"
      >
        <template slot-scope="scope">{{
          scope.row.roleType | chValue(roleTypeOptions)
        }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="影片語系">
        <template slot-scope="scope">{{
          scope.row.language | chValue(languages)
        }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="圖片域名">
        <template slot-scope="scope">{{
          scope.row.imageSpaceDomain | chValue(allCdns)
        }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="視頻域名">
        <template slot-scope="scope">{{
          scope.row.videoSpaceDomain | chValue(allCdns)
        }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="API域名">
        <template slot-scope="scope">{{
          scope.row.apiSpaceDomain | chValue(domains)
        }}</template>
      </el-table-column>
      <!--
      <el-table-column :resizable="false" align="header-left" label="外部域名">
        <template slot-scope="scope">
          <span :class="[scope.row.usedOut != false ? 'yesClass' : '']">
            {{ scope.row.usedOut | chValue(trueOrFalse_ch) }}
          </span>
        </template>
      </el-table-column>
-->
      <!--el-table-column align="header-left" label="浮水印">
        <template slot-scope="scope">
          <el-image
            class="table-td-thumb"
            :src="require('../../assets/images/'+scope.row.watermark)"
            :preview-src-list="[require('../../assets/images/'+scope.row.watermark)]"
          ></el-image>
        </template>
      </el-table-column-->

      <el-table-column
        :resizable="false"
        align="header-left"
        label="轉檔中 / 未上傳 / 全部"
        width="190"
      >
        <template slot-scope="scope">{{
          scope.row.roleType !== 2
            ? `${scope.row.processCount} / ${scope.row.unLoadCount} / ${scope.row.videoCount}`
            : "--"
        }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="狀態"
        width="80"
      >
        <template slot-scope="scope">
          <span :class="[scope.row.isEnable ? 'enableClass' : 'disableClass']">
            {{ scope.row.isEnable | chValue(enable) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="更新時間"
        width="155"
      >
        <template slot-scope="scope">{{ scope.row.lastUpdateTime }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="操作"
        min-width="80"
      >
        <template slot-scope="scope">
          <el-button-group>
            <editBtn
              :rolePermission="rolePermission"
              @click="handleEdit(scope)"
            ></editBtn>
            <!--暫不開放浮水印
            <el-tooltip
              :enterable="false"
              content="上傳"
              placement="top-start"
              effect="light"
            >
            
              <el-button
                type="success"
                plain
                size="small"
                icon="el-icon-upload"
                @click="handleUpLoad(scope)"
                v-if="rolePermission.canEdit"
              >
              </el-button>
            </el-tooltip>
            -->
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="size"
      @pagination="getAllVenders(false)"
    />

    <!--上傳頁面-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="uploadVisible"
      title="上傳浮水印"
    >
      <el-form label-width="125px" :model="vender">
        <el-form-item label="廠商ID" label-position="right">
          {{ vender.id }}
        </el-form-item>

        <el-form-item label="浮水印" label-position="right">
          <file-upload
            type="image"
            fileType="3"
            videoId="0"
            :videoSpaceId="vender.id"
          ></file-upload>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 新增與修改功能頁面 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '修改廠商' : '新增廠商'"
    >
      <el-form
        v-if="dialogVisible"
        ref="vender"
        label-width="140px"
        :model="vender"
        :rules="rule"
      >
        <el-form-item label="廠商名稱" label-position="right" prop="spaceName">
          <el-input
            v-model.trim="vender.spaceName"
            placeholder="輸入廠商名稱"
          />
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
          label="影片語系"
          label-position="right"
          prop="language"
          v-if="vender.roleType == 2"
        >
          <el-select
            v-model="vender.language"
            default-first-option
            style="width: 400px"
            placeholder="選擇影片語系"
            clearable
            :disabled="!isAdmin"
          >
            <el-option
              v-for="item in languages"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="
            this.dialogType !== 'new' &&
            (vender.roleType == 2 || vender.usedOut == 1)
          "
          label="圖片空間域名"
          label-position="right"
          prop="imageSpaceDomain"
        >
          <el-select
            v-loading="cdnsLoading"
            v-model="vender.imageSpaceDomain"
            default-first-option
            style="width: 400px"
            placeholder="請選擇"
            clearable
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
          v-if="
            this.dialogType !== 'new' &&
            (vender.roleType == 2 || vender.usedOut == 1)
          "
          label="視頻空間域名"
          label-position="right"
          prop="videoSpaceDomain"
        >
          <el-select
            v-loading="cdnsLoading"
            v-model="vender.videoSpaceDomain"
            default-first-option
            style="width: 400px"
            placeholder="請選擇"
            clearable
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
          label="API空間域名"
          label-position="right"
          prop="apiSpaceDomain"
          v-if="vender.roleType == 2"
        >
          <el-select
            v-model="vender.apiSpaceDomain"
            default-first-option
            style="width: 400px"
            placeholder="選擇API空間域名"
            clearable
          >
            <el-option
              v-for="item in domains"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="開放供影商"
          label-position="right"
          prop="spaceMapping"
          v-if="isAdmin && vender.roleType == 2"
        >
          <el-select
            v-model="vender.spaceMapping"
            multiple
            default-first-option
            filterable
            placeholder="請選擇"
            style="width: 400px"
          >
            <el-option
              v-for="item in spaceMappingOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="使用外部域名"
          label-position="right"
          prop="usedOut"
          v-if="isAdmin && vender.roleType == 1 && false"
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
        <el-form-item
          label="供影商維護推薦影片"
          label-position="right"
          prop="isEnable"
          v-if="isAdmin && vender.roleType == 2"
        >
          <el-switch
            v-model="vender.editRecommend"
            actice-color="#00A854"
            active-text="啟用"
            :active-value="1"
            inactive-color="#F04134"
            inactive-text="停用"
            :inactive-value="0"
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

        <el-form-item
          label="創建時間"
          label-position="right"
          v-if="this.dialogType != 'new'"
        >
          {{ vender.createDate }}
        </el-form-item>
      </el-form>

      <div style="text-align: right">
        <cancelBtn
          :rolePermission="rolePermission"
          @click="dialogVisible = false"
        ></cancelBtn>
        <saveBtn :rolePermission="rolePermission" @click="saveVender"></saveBtn>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from "path";
import { deepClone } from "@/utils";
//import { getRole, getRoutes, updateRoute } from "@/api/role";
import {
  PutVenders,
  GetVenders,
  GetVendersCount,
  GetCdns,
  GetDomains,
  GetVedioAllTags,
  GetAllVendersCount,
} from "@/api/video";
//import elementIcons from "./element-icons";

//permission control button start
import getRolePermission from "../../utils/role-permission";
import newBtn from "@/components/PermissionControl/newButton";
import editBtn from "@/components/PermissionControl/editButton";
import saveBtn from "@/components/PermissionControl/saveButton";
import cancelBtn from "@/components/PermissionControl/cancelButton";
import deleteBtn from "@/components/PermissionControl/deleteButton";
import selectVendor from "./components/select-vendor";
//permission control button en
import pagination from "@/components/Pagination";
import fileUpload from "./components/fileUpload";

const defaultVender = {
  apiSpaceDomain: undefined,
  createDate: "",
  createUser: "",
  id: undefined,
  imageSpaceDomain: undefined,
  isEnable: true,
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
  cdns: [],
  language: undefined,
  spaceMapping: [],
  editRecommend: undefined,
};

export default {
  data() {
    const cehckLanguage = (rule, value, callback) => {
      if (this.vender.roleType == 2)
        if (!value) {
          callback(new Error("廳主語系為必選"));
        }
      callback();
    };
    return {
      isAdmin: false,
      vendorKey: 0,
      showDisableVendor: false,
      currentVender: undefined,
      currentRoleType: undefined,
      allCdns: [],
      domains: [],
      tags: [],
      venders: [],
      spaceMappingOption: [],
      vender: Object.assign({}, defaultVender),
      venderList: [],
      venderPageList: [],
      total: 0,
      search: "",
      size: 20,
      currentPage: 1,
      dialogVisible: false,
      changeSequenceVisible: false,
      uploadVisible: false,
      dialogType: "new",
      cdns: [],
      cdnsLoading: false,
      listLoading: false,
      rule: {
        //欄位規則
        spaceName: [
          { required: true, message: "廠商名稱為必填", trigger: "blur" },
        ],
        roleType: {
          required: true,
          message: "廠商類型為必填",
          trigger: "blur",
        },
        language: [
          { required: true, trigger: "blur", validator: cehckLanguage },
        ],
        spaceMapping: [
          {
            required: true,
            message: "至少需選擇一個供影商",
            trigger: "change",
          },
        ],
      },
      roleTypeOptions: [
        { value: 1, label: "供影商" },
        { value: 2, label: "廳主" },
        { value: 9, label: "未分類" },
      ],
      trueOrFalse_ch: [
        { value: false, label: "否" },
        { value: true, label: "是" },
      ],
      enable: [
        { value: false, label: "已停用" },
        { value: true, label: "啟用" },
      ],
      languages: [
        { value: "zh-cn", label: "中文-中國大陸" },
        { value: "vi", label: "越南語" },
      ],
    };
  },
  watch: {
    currentVender: function () {
      this.currentPage = 1; //重新搜尋頁數
      this.getAllVenders(true);
    },
    currentRoleType: function () {
      this.getAllVenders(true);
    },
  },
  components: {
    newBtn,
    editBtn,
    saveBtn,
    cancelBtn,
    deleteBtn,
    pagination,
    fileUpload,
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
      else return value == 0 ? "" : value;
    },
  },

  created() {
    this.setCdn();
    this.setDomain();
    //this.setTag();
    //this.setVender();
    this.isAdmin = this.$store.getters.vendorId == 0;
    this.currentVender = this.$store.getters.vendorId;
    this.getAllVenders();
  },

  methods: {
    resetVendor() {
      this.vendorKey += 1;
      this.getAllVenders();
    },
    getVendors(data) {
      this.venders = data;
      //過濾出供影商
      var spaceMappingOption = deepClone(this.venders);
      spaceMappingOption = spaceMappingOption.filter((o) => {
        if (o.roleType && o.roleType === 1) {
          if (this.showDisableVendor) return true;
          else if (o.isEnable) return true;
        } else return false;
      });
      this.spaceMappingOption = spaceMappingOption;
    },
    /*
    async setVender() {
      const res = await GetVenders();

      this.venders = res.data.map(function (o) {
        return { value: o.id, label: o.spaceName };
      });

      const temp = { value: 0, label: "全部" };

      this.venders[this.venders.length] = temp;
    },

    async setTag() {
      const res = await GetVedioAllTags();

      this.tags = res.data.map(function (o) {
        return { value: o.title, label: o.title };
      });
    },
*/
    async setDomain() {
      const res = await GetDomains();

      this.domains = res.data.map(function (o) {
        return { value: o.id, label: o.apiDomain };
      });
    },

    async setCdn() {
      const res = await GetCdns();

      this.allCdns = res.data.map(function (o) {
        return { value: o.id, label: o.cdn, spaceId: o.spaceId };
      });
    },

    saveVender() {
      //儲存變更

      let isVaild = false;
      this.$refs.vender.validate((valid) => {
        if (valid) isVaild = true;
      });
      if (!isVaild) return;
      var delCheck = [];
      if (
        this.vender.oldSpaceMapping &&
        this.vender.oldSpaceMapping !== this.vender.spaceMapping
      ) {
        this.vender.oldSpaceMapping.forEach((e) => {
          var find = this.vender.spaceMapping.find((o) => o === e);
          if (!find) {
            var delVender = this.spaceMappingOption.find((o) => o.value == e);
            if (delVender) delCheck.push(delVender.label);
          }
        });
      }
      if (delCheck.length > 0) {
        this.$confirm(
          `確定刪除供影商：${delCheck.join(";")}，已選擇的影片將全數移除 ?`,
          "警告",
          {
            confirmButtonText: "確定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(async () => {
            this.save();
          })
          .catch((err) => {
            return;
          });
      } else {
        this.save();
      }
    },

    async save() {
      const isEdit = this.dialogType === "edit";
      let type;
      isEdit ? (type = 2) : (type = 1);

      let c;
      if (type == 1) {
        c = this.$store.getters.account;
      } else {
        c = this.vender.createUser;
      }

      const updateData = {
        apiSpaceDomain:
          this.vender.apiSpaceDomain == "" || this.vender.roleType === 1
            ? 0
            : this.vender.apiSpaceDomain,
        //createDate: this.vender.createDate,
        createUser: c,
        id: this.vender.id,
        imageSpaceDomain:
          this.vender.imageSpaceDomain == "" || this.vender.roleType === 1
            ? 0
            : this.vender.imageSpaceDomain,
        isEnable: this.vender.isEnable,
        lastUpdateUser: this.$store.getters.account,
        spaceName: this.vender.spaceName,
        tag: this.vender.tag,
        roleType: this.vender.roleType,
        type: type,
        usedOut: this.vender.usedOut,
        videoSpaceDomain:
          this.vender.videoSpaceDomain == "" || this.vender.roleType === 1
            ? 0
            : this.vender.videoSpaceDomain,
        language: this.vender.roleType === 1 ? "" : this.vender.language,
        spaceMapping:
          this.vender.roleType === 1 ? [] : this.vender.spaceMapping,
        editRecommend: this.vender.editRecommend,
      };

      await PutVenders(updateData);
      this.getAllVenders();
      this.resetVendor();
      this.dialogVisible = false;
      this.$notify({
        title: "寫入成功",
        message: `
            <div>廠商名稱: ${updateData.spaceName}</div>
          `,
        dangerouslyUseHTMLString: true,
        type: "success",
      });
    },

    async getAllVenders(isCallApi = true) {
      this.listLoading = true;

      if (isCallApi) {
        var res = undefined;
        if (this.currentVender == 0 || this.currentVender == undefined) {
          res = await GetAllVendersCount();
        } else {
          res = await GetVendersCount(this.currentVender);
        }
        this.venderList = res.data;
        if (!this.showDisableVendor)
          this.venderList = this.venderList.filter((o) => o.isEnable == true);
      }
      if (this.currentRoleType > 0)
        this.venderList = this.venderList.filter(
          (o) => o.roleType == this.currentRoleType
        );

      var filterList = [];

      if (this.search != "") {
        filterList = this.venderList.filter(
          (item) => item.spaceName.indexOf(this.search) != -1
        );
        this.filterTier = "";
      } else filterList = this.venderList;

      this.total = filterList.length;

      for (var i = 0; i < filterList.length; i++) {
        //this.venderList[i].spaceTags = this.venderList[i].tag.split(",");
        filterList[i].countVideos =
          filterList[i].unLoadCount + "(" + filterList[i].videoCount + ")";
      }

      var x = Math.ceil(this.total / this.size);
      if (x == 0) this.currentPage = 1;
      else if (this.currentPage > x) this.currentPage = x;
      //分頁
      var pageList = filterList.filter(
        (item, index) =>
          index < this.size * this.currentPage &&
          index >= this.size * (this.currentPage - 1)
      );

      this.venderPageList = pageList;
      setTimeout(() => {
        this.listLoading = false;
      }, 0.3 * 1000);
    },

    getRolePermissions() {
      //獲取權限
      return getRolePermission(this.$route.name);
    },
    filterCdn() {
      this.cdnsLoading = true;
      var id = this.vender.id;
      this.cdns = this.allCdns.filter((i) => {
        return i.spaceId == id;
      });
      setTimeout(() => {
        this.cdnsLoading = false;
      }, 0.3 * 1000);
    },

    handleAddVender() {
      //新增資料
      this.vender = Object.assign({}, defaultVender);
      this.dialogType = "new";
      this.filterCdn();
      this.dialogVisible = true;
    },

    handleEdit(scope) {
      //編輯資料
      this.dialogType = "edit";
      var vender = deepClone(scope.row);
      if (vender.imageSpaceDomain == 0) vender.imageSpaceDomain = "";
      if (vender.videoSpaceDomain == 0) vender.videoSpaceDomain = "";
      if (vender.apiSpaceDomain == 0) vender.apiSpaceDomain = "";
      if (vender.roleType === 2) {
        //移除因停用不在選項中的vendor
        var spaceMapping = vender.spaceMapping
          ? deepClone(vender.spaceMapping)
          : [];
        var spaceMappingOption = this.spaceMappingOption;
        spaceMapping.forEach(function (item, index, object) {
          var find = spaceMappingOption.find((e) => e.value === item);
          if (!find) {
            object.splice(index, 1);
          }
        });
        vender.spaceMapping = spaceMapping;
        vender.oldSpaceMapping = spaceMapping;
      }
      this.vender = vender;
      this.filterCdn();
      this.dialogVisible = true;
    },

    handleUpLoad(scope) {
      //上傳資料
      this.vender = deepClone(scope.row);
      this.uploadVisible = true;
    },
  },
};
</script>
