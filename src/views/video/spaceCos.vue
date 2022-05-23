<template>
  <div class="app-container">
    <div class="filter-container">
      <selectVendor
        :spaceId.sync="listQuery.vendor"
        :clear="false"
        :showDisable="showDisableVendor"
        :roleType="1"
        :addUsedOut="false"
        :addAll="true"
        :key="vendorKey"
        :addUnClass="true"
        @getVendors="getVendors"
      ></selectVendor>
      <el-checkbox
        style="margin: 0px 10px"
        v-model="showDisableVendor"
        @change="resetVendor()"
        >顯示停用廠商</el-checkbox
      >
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="getSpaceCos(true)"
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
      <el-table-column :resizable="false" align="header-left" label="供影商">
        <template slot-scope="scope">{{
          scope.row.videoSpaceId | chVendor(vendorOptions)
        }}</template>
      </el-table-column>
      <el-table-column :resizable="false" align="header-left" label="COS">
        <template slot-scope="scope">{{
          scope.row.cosId | chCos(cosOptions)
        }}</template>
      </el-table-column>
      <!--
      <el-table-column :resizable="false" align="header-left" width="100px" label="CDN Id">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
    -->
      <el-table-column :resizable="false" align="header-left" label="Path">
        <template slot-scope="scope">{{ scope.row.path }}</template>
      </el-table-column>
      <el-table-column :resizable="false" align="header-left" label="優先級">
        <template slot-scope="scope">{{ scope.row.seat }}</template>
      </el-table-column>
      <el-table-column :resizable="false" align="header-left" label="更新時間">
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
      @pagination="getSpaceCos(false)"
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
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="供影商" label-position="right" prop="videoSpaceId">
          <selectVendor
            :spaceId.sync="item.videoSpaceId"
            :roleType="1"
            :addUsedOut="false"
            :addUnClass="true"
            style="width: 200px"
          ></selectVendor>
        </el-form-item>

        <el-form-item label="COS" label-position="right" prop="cosId">
          <el-select
            v-model="item.cosId"
            clearable
            placeholder="COS"
            default-first-option
            style="width: 300px"
          >
            <el-option
              v-for="item in cosOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Path" label-position="right" prop="path">
          <el-input
            maxlength="20"
            type=""
            v-model="item.path"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="優先級" label-position="right" prop="seat">
          <el-input-number
            v-model="item.seat"
            :min="1"
            :max="99999"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="更新時間">
          {{ item.lastUpdateTime }}
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
import { GetSpaceCOS,PutSpaceCOS, GetCos } from "@/api/video";
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
  videoSpaceId: undefined,
  cosId: undefined,
  path: "",
  seat: undefined,
};

export default {
  data() {
    const cehckSpaceId = (rule, value, callback) => {
      if (this.item.forProvider == false)
        if (!value) {
          callback(new Error("請選擇供影商"));
        }
      callback();
    };
    return {
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        vendor: 0,
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
        videoSpaceId: [{ required: true, trigger: "blur", message: "請選擇供影商" }],
        cosId: [{ required: true, message: "cosId為必填", trigger: "blur" }],
        seat: [{ required: true, trigger: "blur", message: "優先級為必填" }],
      },
      vendorOptions: [],
      cosOptions: [],
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
      this.getSpaceCos(true);
    },
    "item.spaceId": function () {
      var find = this.vendorOptions.find((o) => o.value == this.item.spaceId);
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
        return { value: o.id, label: `${o.cosClass} - ${o.cosName}` };
      });
    },
    resetVendor() {
      this.listQuery.page = 1;
      this.listQuery.vendor = "";
      this.vendorKey += 1; //reload components
    },

    async getSpaceCos(isCallApi = true) {
      this.listLoading = true;
      if (isCallApi) {
        const res = await GetSpaceCOS();
        var allData = res.data;
        var vendors = this.vendorOptions;
        //過濾掉停用的spaceId
        if (!this.showDisableVendor) {
          allData = allData.filter(function (o) {
            if (o.videoSpaceId == 0) return true;
            return vendors.find(
              (item) => item.value == o.videoSpaceId && item.isEnable == true
            );
          });
        }
        this.allItemList = allData;
      }
      let { page = 1, limit = 20, vendor = "" } = this.listQuery;
      let filterList = [];
      filterList = this.allItemList.filter(function (item) {
        if (vendor != "" && item.videoSpaceId != vendor) return false;
        return true;
      });
      this.total = filterList.length;

      //刪除後頁數調整
      var x = Math.ceil(this.total / limit);
      if (page > x) page = x;

      const pageList = filterList.filter(
        (item, index) => index < limit * page && index >= limit * (page - 1)
      );
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
        videoSpaceId: this.item.videoSpaceId,
        cosId: this.item.cosId,
        path: this.item.path,
        seat: this.item.seat,
        createUser: isEdit ? this.item.createUser : this.$store.getters.account,
        lastupdateUser: this.$store.getters.account,
      };
      //檢查名稱是否重覆
      if (!isEdit) {
        const res = await GetSpaceCOS();
        if (
          res.data.find(
            (o) =>
              o.cosId == updateData.cosId &&
              o.videoSpaceId == updateData.videoSpaceId
          )
        ) {
          this.$notify({
            title: "error",
            dangerouslyUseHTMLString: true,
            message: "COS重覆",
            type: "error",
          });
          return;
        }
      }

      //寫入帳號
      var a=updateData;
      await PutSpaceCOS(updateData);
      this.getSpaceCos();
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
      this.$confirm(`確定刪除`, "警告", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const delData = {
            type: 3,
            id: row.id,
            videoSpaceId: row.videoSpaceId,
            cosId: row.cosId,
            path: row.page,
            seat:row.seat,
            createUser: row.createUser,
            lastupdateUser: this.$store.getters.account,
          };
          await PutSpaceCOS(delData);
          this.$message({
            type: "success",
            message: "刪除成功！",
          });
          this.getSpaceCos();
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

