<template>
  <div class="app-container">
    <div class="filter-container">
      <selectVendor
        :spaceId.sync="listQuery.vendor"
        :clear="false"
        :showDisable="showDisableVendor"
        :roleType="2"
        :addUsedOut="true"
        :addAll="true"
        :key="vendorKey"
        @getVendors="getVendors"
      ></selectVendor>
      <el-checkbox
        style="margin: 0px 10px"
        v-model="showDisableVendor"
        @change="resetVendor()"
        >顯示停用廠商</el-checkbox
      >
      <el-input
        v-model.trim="listQuery.cdn"
        placeholder="CDN"
        style="width: 250px"
        clearable
        maxlength="255"
      ></el-input>

      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="getCDN(true)"
        >搜尋</el-button
      >
      <newBtn
        :rolePermission="rolePermission"
        @click="handleAdd"
        class="filter-item"
      ></newBtn>
    </div>
    <el-table
      v-if="rolePermission.canView"
      v-loading="listLoading"
      :data="itemList"
      style="width: 100%; margin-top: 20px"
      border
      header-cell-class-name="tableHeader"
      :row-class-name="rowClassName"
      ref="itemList"
    >
      <el-table-column :resizable="false" label="序號" width="80" align="center"
        ><template slot-scope="scope">{{ scope.row.index }}</template>
      </el-table-column>
      <el-table-column
        :resizable="false"
        align="header-left"
        width="200"
        label="廳主"
      >
        <template slot-scope="scope">{{
          scope.row.spaceId | chVendor(vendorOptions)
        }}</template>
      </el-table-column>
      <el-table-column
        :resizable="false"
        align="header-left"
        width="100"
        label="HOST"
      >
        <template slot-scope="scope">{{ scope.row.host }}</template>
      </el-table-column>
      <el-table-column :resizable="false" align="header-left" label="CDN" min-width="250">
        <template slot-scope="scope">{{ scope.row.cdn }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="上線中" width="100">
        <template slot-scope="scope">
          <span :class="[scope.row.isOnLine? 'yesClass' : '']">
          {{
          scope.row.isOnLine ? "是" : ""}}
          </span>
          </template>
      </el-table-column>

      <!--
      <el-table-column :resizable="false" align="header-left" width="100px" label="CDN Id">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
    -->
      <el-table-column :resizable="false" align="header-left" label="更新時間" width="200">
        <template slot-scope="scope">{{ scope.row.lastUpdateTime }}</template>
      </el-table-column>

      <!-- *********************************************************************************** -->
      <el-table-column
        :resizable="false"
        align="header-left"
        label="操作"
        min-width="130"
      >
        <template slot-scope="scope">
          <el-button-group>
            <editBtn
              :rolePermission="rolePermission"
              @click="handleEdit(scope)"
            ></editBtn>
            <el-tooltip
              :enterable="false"
              content="複製"
              placement="top-start"
              effect="light"
            >
              <el-button
                v-if="rolePermission.canEdit"
                type="success"
                plain
                size="small"
                icon="el-icon-document-copy"
                @click="handleCopy(scope)"
              ></el-button>
            </el-tooltip>
            <deleteBtn
              :rolePermission="rolePermission"
              @click="handleDelete(scope)"
            ></deleteBtn>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getCDN(false)"
    />
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '修改' : '新增'"
    >
      <el-form
        v-if="dialogVisible"
        ref="item"
        :model="item"
        label-width="120px"
        :rules="rule"
      >
        <el-form-item
          label="Id"
          label-position="right"
          v-if="dialogType === 'edit'"
        >
          <el-input
            v-model="item.id"
            :disabled="dialogType === 'edit'"
            placeholder="id"
          />
        </el-form-item>

        <el-form-item label="廳主" label-position="right" prop="spaceId">
          <selectVendor
            :spaceId.sync="item.spaceId"
            :roleType="2"
            :addUsedOut="true"
            :disable="item.forProvider"
          ></selectVendor>
          <!--
          <el-checkbox v-model="item.forProvider" style="margin-left: 10px"
            >供影商使用</el-checkbox
          >
          -->
        </el-form-item>

        <el-form-item label="CDN" label-position="right" prop="cdn">
          <el-input v-model.trim="item.cdn" placeholder="CDN" maxlength="200" />
        </el-form-item>
        <!--
        <el-form-item
          label="COS"
          label-position="right"
          prop="cosId"
          v-if="item.usedOut != 1"
        >
          <el-select
            v-model="item.cosId"
            clearable
            placeholder="COS"
            default-first-option
          >
            <el-option
              v-for="item in cosOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
-->
        <el-form-item
          label="HOST"
          label-position="right"
          prop="host"
          v-if="item.usedOut != 1"
        >
          <el-select
            v-model="item.host"
            clearable
            placeholder="HOST"
            default-first-option
          >
            <el-option
              v-for="item in hostOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="創建時間">
          {{ item.createDate }}
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <cancelBtn
          :rolePermission="rolePermission"
          @click="dialogVisible = false"
        ></cancelBtn>
        <saveBtn :rolePermission="rolePermission" @click="saveData"></saveBtn>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { deepClone } from "@/utils";
import { GetCdns, PutCdn, GetCos } from "@/api/video";
import pagination from "@/components/Pagination";

//permission control button start
import getRolePermission from "../../utils/role-permission";
import newBtn from "@/components/PermissionControl/newButton";
import editBtn from "@/components/PermissionControl/editButton";
import deleteBtn from "@/components/PermissionControl/deleteButton";
import saveBtn from "@/components/PermissionControl/saveButton";
import cancelBtn from "@/components/PermissionControl/cancelButton";
//permission control button end
import selectVendor from "./components/select-vendor";
import selectRadioCode from "./components/select-radio-code";

const defaultItem = {
  id: 0,
  spaceId: "",
  cdn: "",
  cosId: undefined,
  cosClass: "",
  forProvider: false,
  createUser: "",
  lastUpdateUser: "",
  usedOut: 0,
  host: "",
};

export default {
  data() {
    const cehckCosInfo = (rule, value, callback) => {
      if (this.item.usedOut != 1)
        if (!value || value == "") {
          callback(new Error(`請輸入${rule.field}`));
        }
      callback();
    };
    const cehckSpaceId = (rule, value, callback) => {
      if (this.item.forProvider == false)
        if (!value) {
          callback(new Error("請選擇廳主"));
        }
      callback();
    };
    const cehckCDN = (rule, value, callback) => {
      if (this.item.cosClass && this.item.cosClass == "NONE" && value)
        if (!value.trim().toLowerCase().startsWith("http")) {
          callback(new Error(`無COS時，須包含host(http or https)`));
        }
      callback();
    };
    return {
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        vendor: 0,
        cdn: "",
        cosClass: "",
      },
      vendorKey: 0,
      showDisableVendor: false,
      total: 0,
      item: Object.assign({}, defaultItem),
      allItemList: [],
      itemList: [],
      dialogVisible: false,
      dialogType: "new",

      rule: {
        cdn: [
          { required: true, message: "CDN為必填", trigger: "blur" },
          { required: true, trigger: "blur", validator: cehckCDN },
        ],
        spaceId: [{ required: true, trigger: "blur", validator: cehckSpaceId }],
        cosClass: [
          { required: true, message: "COS類型為必填", trigger: "blur" },
        ],
        host: [{ required: true, trigger: "blur", message: "HOST為必填" }],
        // cosId: [{ required: true, trigger: "blur", validator: cehckCosInfo }],
      },
      vendorOptions: [],
      codeOptions: [],
      cosOptions: [],
      hostOptions: [
        { value: "https", label: "https" },
        { value: "http", label: "http" },
      ],
    };
  },
  components: {
    newBtn,
    editBtn,
    saveBtn,
    cancelBtn,
    deleteBtn,
    pagination,
    selectVendor,
    selectRadioCode,
  },
  watch: {
    vendorOptions() {
      this.getCDN(true);
    },
    "item.spaceId": function () {
      var find = this.vendorOptions.find((o) => o.value == this.item.spaceId);
      if (find) this.item.usedOut = find.usedOut;
      if (this.item.usedOut == 1) this.item.cosId = "";
    },
    dialogVisible(val) {
      if (!val) this.item = Object.assign({}, defaultItem);
    },
  },
  filters: {
    chCos(value, ary) {
      let find = ary.find((e) => e.value == value);
      if (find) return find.label;
      else return "";
    },
    chVendor: function (value, ary) {
      if (value == "0") return "供影商";
      let find = ary.find((e) => e.value == value);
      if (find) return find.label;
      else return value;
    },
  },
  computed: {
    rolePermission() {
      return this.getRolePermissions();
    },
  },
  created() {
    this.getCos();
  },
  methods: {
    getRolePermissions() {
      return getRolePermission(this.$route.name);
    },
    rowClassName({ row, rowIndex }) {
      //把每一行的索引放進row
      var index =
        rowIndex + 1 + (this.listQuery.page - 1) * this.listQuery.limit;
      row.index = index;
    },
    getVendors(data) {
      this.vendorOptions = data;
    },
    getCodeList(data) {
      this.codeOptions = data;
    },
    async getCos() {
      const res = await GetCos();
      this.cosOptions = res.data.map(function (o) {
        return { value: o.id, label: o.cosName, class: o.cosClass };
      });
    },
    resetVendor() {
      this.listQuery.page = 1;
      this.listQuery.vendor = "";
      this.vendorKey += 1; //reload components
    },

    async getCDN(isCallApi = true) {
      this.listLoading = true;
      if (isCallApi) {
        const res = await GetCdns();
        var allData = res.data;
        var vendors = this.vendorOptions;
        //過濾掉停用的spaceId
        if (!this.showDisableVendor) {
          allData = allData.filter(function (o) {
            if (o.spaceId == 0) return true;
            return vendors.find(
              (item) => item.value == o.spaceId && item.isEnable == true
            );
          });
        }
        this.allItemList = allData;
      }
      let {
        page = 1,
        limit = 20,
        vendor = "",
        cdn = "",
        cosClass,
      } = this.listQuery;
      let filterList = [];
      filterList = this.allItemList.filter(function (item) {
        if (vendor != "" && item.spaceId != vendor) return false;
        if (cdn != "" && item.cdn.indexOf(cdn) == -1) return false;
        if (cosClass != "" && item.cosClass != cosClass) return false;
        return true;
      });
      this.total = filterList.length;

      //刪除後頁數調整
      var x = Math.ceil(this.total / limit);
      if (page > x) page = x;

      var pageList = filterList.filter(
        (item, index) => index < limit * page && index >= limit * (page - 1)
      );
      pageList.forEach((i) => {
        var find = vendors.find(
          (v) =>
            v.value === i.spaceId &&
            (v.videoSpaceDomain === i.id || v.imageSpaceDomain === i.id)
        );
        if (find) i.isOnLine = true;
        else i.isOnLine = false;
      });

      this.itemList = pageList;
      setTimeout(() => {
        this.listLoading = false;
      }, 0.3 * 1000);
    },

    handleAdd() {
      this.item = Object.assign({}, defaultItem);
      if (this.listQuery.vendor) this.item.spaceId = this.listQuery.vendor;
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    handleCopy(scope) {
      this.dialogType = "new";
      var item = deepClone(scope.row);
      if (item) {
        if (item.cosId == 0) item.cosId = "";
      }
      item.spaceId = undefined;
      item.forProvider = false;
      this.item = item;
      this.dialogVisible = true;
    },
    handleEdit(scope) {
      this.dialogType = "edit";
      var item = deepClone(scope.row);
      if (item) {
        if (item.cosId == 0) item.cosId = "";
      }
      if (item.spaceId == 0) {
        item.forProvider = true;
        item.spaceId = undefined;
      } else item.forProvider = false;
      this.item = item;
      this.dialogVisible = true;
    },
    async saveData() {
      let isVaild = false;
      this.$refs.item.validate((valid) => {
        if (valid) isVaild = true;
      });
      if (!isVaild) return;
      const isEdit = this.dialogType === "edit";
      const updateData = {
        type: isEdit ? 2 : 1,
        id: this.item.id,
        cdn: this.item.cdn,
        spaceId: this.item.forProvider == true ? 0 : this.item.spaceId,
        cosId: this.item.cosId == "" ? 0 : this.item.cosId,
        host: this.item.host,
        createUser: isEdit ? this.item.createUser : this.$store.getters.account,
        lastupdateUser: this.$store.getters.account,
      };
      //檢查名稱是否重覆
      if (!isEdit) {
        const res = await GetCdns();
        if (
          res.data.find(
            (o) => o.cdn == updateData.cdn && o.spaceId == updateData.spaceId
          )
        ) {
          this.$notify({
            title: "error",
            dangerouslyUseHTMLString: true,
            message: "CDN重覆",
            type: "error",
          });
          return;
        }
      }

      //寫入帳號
      await PutCdn(updateData);
      this.getCDN();
      const { cdn } = updateData;
      this.dialogVisible = false;
      this.$notify({
        title: "寫入成功",
        dangerouslyUseHTMLString: true,
        message: `
            <div>CDN: ${cdn}</div>
          `,
        type: "success",
      });
    },
    handleDelete({ $index, row }) {
      this.$confirm(`確定刪除：${row.cdn} ?`, "警告", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const delData = {
            type: 3,
            id: row.id,
            spaceId: row.spaceId,
            cdn: row.cdn,
            cosId: row.cosId,
            createUser: row.createUser,
            lastupdateUser: this.$store.getters.account,
          };
          await PutCdn(delData);
          this.$message({
            type: "success",
            message: "刪除成功！",
          });
          this.getCDN(true);
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
