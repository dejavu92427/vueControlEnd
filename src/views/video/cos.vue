<template>
  <div class="app-container">
    <div class="filter-container">
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
    >
      <el-table-column :resizable="false" label="序號" width="80" align="center"
        ><template slot-scope="scope">{{ scope.row.index }}</template>
      </el-table-column>
      <el-table-column :resizable="false" align="header-left" label="COS類型">
        <template slot-scope="scope">{{
          scope.row.cosClass | chValue(codeOptions)
        }}</template>
      </el-table-column>
      <el-table-column :resizable="false" align="header-left" label="COS名稱">
        <template slot-scope="scope">{{ scope.row.cosName }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="更新時間">
        <template slot-scope="scope">{{ scope.row.lastUpdateTime }}</template>
      </el-table-column>

      <!-- *********************************************************************************** -->
      <el-table-column :resizable="false" align="header-left" label="操作" min-width="130">
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
      @pagination="getCos(false)"
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
        label-width="140px"
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

        <el-form-item label="COS類型" label-position="right" prop="cosClass">
          <selectRadioCode
            :code.sync="item.cosClass"
            domType="radio"
            codeType="cosclass"
          ></selectRadioCode>
        </el-form-item>

        <el-form-item label="COS名稱" label-position="right" prop="cosName">
          <el-input
            v-model.trim="item.cosName"
            placeholder="COS 名稱"
            maxlength="255"
          />
        </el-form-item>

        <el-form-item
          label="SecretID"
          label-position="right"
          prop="cosSecretID"
        >
          <el-input
            v-model.trim="item.cosSecretID"
            placeholder="COS SecretID"
            maxlength="50"
          />
        </el-form-item>

        <el-form-item
          label="SecretKey"
          label-position="right"
          prop="cosSecretKey"
        >
          <el-input
            v-model.trim="item.cosSecretKey"
            placeholder="COS SecretKey"
            maxlength="50"
          />
        </el-form-item>

        <el-form-item
          label="Region"
          label-position="right"
          prop="cosRegion"
          v-if="item.cosClass == 'TS'"
        >
          <el-input
            v-model="item.cosRegion"
            placeholder="COS Region"
            maxlength="20"
          />
        </el-form-item>

        <el-form-item label="Scheme" label-position="right" prop="cosScheme">
          <el-select
            v-model="item.cosScheme"
            placeholder="COS Scheme"
            clearable
          >
            <el-option
              v-for="item in cosSchemeOptions"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="Endpoint"
          label-position="right"
          prop="cosEndpoint"
          maxlength="50"
        >
          <el-input v-model.trim="item.cosEndpoint" placeholder="COS Endpoint" />
        </el-form-item>
        <el-form-item
          label="SpeedEndpoint"
          label-position="right"
          prop="cosSpeedEndpoint"
          maxlength="50"
        >
          <el-input
            v-model="item.cosSpeedEndpoint"
            placeholder="COS SpeedEndpoint"
          />
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
import { GetCos, PutCos } from "@/api/video";
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
  cos: "",
  cosName: "",
  cosClass: "",
  cosSecretID: "",
  cosSecretKey: "",
  cosRegion: "",
  cosScheme: "",
  cosEndpoint: "",
  cosSpeedEndpoint: "",
  createUser: "",
  lastUpdateUser: "",
};

export default {
  data() {
    const cehckCosInfo = (rule, value, callback) => {
      if (this.item && this.item.cosClass == "TS")
        if (!value || value.trim().length == 0) {
          callback(new Error(`${rule.field.replace("cos", "")}為必填`));
        }
      callback();
    };
    return {
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
      },
      total: 0,
      item: Object.assign({}, defaultItem),
      allItemList: [],
      itemList: [],
      dialogVisible: false,
      dialogType: "new",
      cosSchemeOptions: [
        { value: "https", label: "https" },
        { value: "http", label: "http" },
      ],

      rule: {
        cosClass: [
          { required: true, message: "COS類型為必填", trigger: "blur" },
        ],
        cosName: [
          { required: true, message: "COS Name為必填", trigger: "blur" },
        ],
        cosSecretID: [
          { required: true, message: "SecretID為必填", trigger: "blur" },
        ],
        cosSecretKey: [
          { required: true, message: "SecretKey為必填", trigger: "blur" },
        ],
        cosScheme: [
          { required: true, message: "Scheme 為必填", trigger: "blur" },
        ],
        cosEndpoint: [
          { required: true, message: "Endpoint 為必填", trigger: "blur" },
        ],
        cosRegion: [
          {
            required: true,
            trigger: "blur",
            validator: cehckCosInfo,
          },
        ],
        cosSpeedEndpoint: [
          { required: true, message: "cosSpeedEndpoint 為必填", trigger: "blur" },
        ],
      },
      codeOptions: [],
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
  watch: {},
  filters: {
    chValue: function (value, ary) {
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
    getCodeList(data) {
      this.codeOptions = data;
      //console.log("getCodeList");
    },
    resetVendor() {
      this.listQuery.page = 1;
      this.listQuery.vendor = "";
      this.vendorKey += 1; //reload components
    },
    async getCos(isCallApi = true) {
      this.listLoading = true;
      if (isCallApi) {
        const res = await GetCos();
        var allData = res.data;
        this.allItemList = allData;
      }
      let { page = 1, limit = 20 } = this.listQuery;
      let filterList = [];
      filterList = this.allItemList;
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
      this.item = deepClone(scope.row);
      this.dialogVisible = true;
    },
    handleEdit(scope) {
      this.dialogType = "edit";
      this.item = deepClone(scope.row);
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
        cosName: this.item.cosName,
        cosClass: this.item.cosClass,
        cosSecretID: this.item.cosSecretID,
        cosSecretKey: this.item.cosSecretKey,
        cosRegion: this.item.cosRegion,
        cosScheme: this.item.cosScheme,
        cosEndpoint: this.item.cosEndpoint,
        cosSpeedEndpoint: this.item.cosSpeedEndpoint,
        createUser: isEdit ? this.item.createUser : this.$store.getters.account,
        lastupdateUser: this.$store.getters.account,
      };
      //檢查名稱是否重覆
      if (!isEdit) {
        const res = await GetCos();
        if (res.data.find((o) => o.cosName == updateData.cosName)) {
          this.$notify({
            title: "error",
            dangerouslyUseHTMLString: true,
            message: "COS Name重覆",
            type: "error",
          });
          return;
        }
      }

      //寫入帳號
      await PutCos(updateData);
      this.getCos();
      this.dialogVisible = false;
      this.$notify({
        title: "寫入成功",
        dangerouslyUseHTMLString: true,
        type: "success",
      });
    },
    handleDelete({ $index, row }) {
      this.$confirm(`確定刪除：${row.cosName} ?`, "警告", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const delData = {
            type: 3,
            id: row.id,
            cosName: row.cosName,
            cosClass: row.cosClass,
            cosSecretID: row.cosSecretID,
            cosSecretKey: row.cosSecretKey,
            cosRegion: row.cosRegion,
            cosScheme: row.cosScheme,
            cosEndpoint: row.cosEndpoint,
            createUser: row.createUser,
            lastupdateUser: this.$store.getters.account,
          };
          await PutCos(delData);
          this.$message({
            type: "success",
            message: "刪除成功！",
          });
          this.getCos();
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
