<template>
  <div class="app-container">
    <div class="filter-container" style="margin-top: 15px">
      <el-select
        style="margin-right: 10px"
        v-model="filterEnable"
        default-first-option
        class="filter-item"
        @change="getWhitelisting()"
      >
        <el-option
          v-for="item in filterOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input
        v-model="filterIpAddress"
        placeholder="IP Address"
        style="width: 400px"
        maxlength="50"
        clearable
      />
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="
          currentPage = 1;
          getWhitelisting();
        "
        >搜尋</el-button
      >
      <newBtn :rolePermission="rolePermission" @click="handleAdd"></newBtn>
    </div>
    <el-table
      v-if="rolePermission.canView"
      :data="pageList"
      style="width: 100%; margin-top: 10px"
      border
      header-cell-class-name="tableHeader"
      :row-class-name="rowClassName"
      v-loading="listLoading"
      :default-sort="{ prop: 'lastUpdateTime', order: 'ascending' }"
      @sort-change="sortChange"
    >
      <el-table-column align="header-left" label="序號" width="80">
        <template slot-scope="scope">{{ scope.row.index }}</template>
      </el-table-column>

      <el-table-column
        align="header-left"
        label="IP位址"
        width="400"
        prop="ipAddress"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
      >
        <template slot-scope="scope">{{ scope.row.ipAddress }}</template>
      </el-table-column>

      <el-table-column align="header-left" label="狀態" width="100">
        <template slot-scope="scope">
          <span
            :class="[scope.row.isEnable ? 'enableClass' : 'disableClass']"
            >{{ scope.row.isEnable | chValue(boolOptions) }}</span
          ></template
        >
      </el-table-column>

      <el-table-column align="header-left" label="備註">
        <template slot-scope="scope">{{ scope.row.memo }}</template>
      </el-table-column>
      <el-table-column
        :resizable="false"
        align="header-left"
        label="更新時間"
        prop="lastUpdateTime"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
      >
        <template slot-scope="scope">{{ scope.row.lastUpdateTime }}</template>
      </el-table-column>
      <el-table-column align="header-left" label="操作" width="300">
        <template slot-scope="scope">
          <el-button-group>
            <editBtn
              :rolePermission="rolePermission"
              @click="handleEdit(scope)"
            ></editBtn>
            <deleteBtn
              :rolePermission="rolePermission"
              @click="handleDelete(scope.row)"
            ></deleteBtn>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="size"
      @pagination="getWhitelisting(false)"
    />
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '修改白名單' : '新增白名單'"
    >
      <el-form ref="white"  v-if="dialogVisible" :model="white" label-width="100px" :rules="rule">
        <el-form-item
          label="IP位址"
          label-position="right"
          prop="ipAddress"
        >
          <el-input
            v-model="white.ipAddress"
            placeholder="IP Address"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="備註" label-position="right">
          <el-input v-model="white.memo" placeholder="Memo" maxlength="20" />
        </el-form-item>
        <el-form-item label="狀態" label-position="right">
          <el-switch
            v-model="white.isEnable"
            actice-color="#00A854"
            active-text="啟用"
            :active-value="1"
            inactive-color="#F04134"
            inactive-text="停用"
            :inactive-value="0"
          >
          </el-switch>
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
import { GetWhitelisting, PutWhitelisting } from "@/api/user";

//permission control button start
import getRolePermission from "../../utils/role-permission";
import newBtn from "@/components/PermissionControl/newButton";
import editBtn from "@/components/PermissionControl/editButton";
import saveBtn from "@/components/PermissionControl/saveButton";
import cancelBtn from "@/components/PermissionControl/cancelButton";
import deleteBtn from "@/components/PermissionControl/deleteButton";
//permission control button end
import pagination from "@/components/Pagination";

const defaultData = {
  id: 0,
  domain: "",
  ipAddress: "",
  isEnable: 1,
  memo: "",
};

export default {
  data() {
    const validateIPaddress = (rule, value, callback) => {
      var ipformat =
        /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(?:(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){6})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:::(?:(?:(?:[0-9a-fA-F]{1,4})):){5})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){4})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,1}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){3})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,2}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){2})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,3}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:[0-9a-fA-F]{1,4})):)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,4}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,5}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,6}(?:(?:[0-9a-fA-F]{1,4})))?::))))$/;

      if (!value.match(ipformat)) {
        callback(new Error("IP不符合IPV4或IPV6的格式"));
      } else {
        callback();
      }
    };
    return {
      white: Object.assign({}, defaultData),
      listQuery:{
        sortKey: "lastUpdateTime",
        sortOrder: "ascending",
      },
      listLoading: false,
      currentPage: 1,
      size: 20,
      total: 0,
      filterIpAddress: undefined,
      whiteList: [],
      pageList: [],
      dialogVisible: false,
      dialogType: "new",
      filterOptions: [
        { value: 1, label: "啟用" },
        { value: 0, label: "停用" },
        { value: -1, label: "全部" },
      ],
      boolOptions: [
        { value: 1, label: "啟用" },
        { value: 0, label: "停用" },
      ],
      rule: {
        ipAddress: [
          { required: true, message: "IP位址為必填", trigger: "blur" },
          { required: true, trigger: "blur", validator: validateIPaddress },
        ],
      },
      filterEnable: 1,
    };
  },
  components: {
    newBtn,
    editBtn,
    saveBtn,
    cancelBtn,
    deleteBtn,
    pagination,
  },
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
    this.getWhitelisting();
  },
  watch: {
    "white.ipAddress": function (val) {
      this.white.ipAddress = val.replace(/[^A-Za-z0-9.:]/g, "");
    },
    filterIpAddress: function (val) {
      this.white.ipAddress = val.replace(/[^A-Za-z0-9.:]/g, "");
    },
  },
  methods: {
    rowClassName({ row, rowIndex }) {
      //把每一行的索引放進row
      var index = rowIndex + 1 + (this.currentPage - 1) * this.size;
      row.index = index;
    },
    getRolePermissions() {
      return getRolePermission(this.$route.name);
    },
    sortChange(data) {
      const { prop, order } = data;
      this.listQuery.sortKey = prop;
      this.listQuery.sortOrder = order;
      this.getWhitelisting(false);
    },
    async getWhitelisting(isCallApi = true) {
      this.listLoading = true;
      if (isCallApi) {
        const res = await GetWhitelisting(this.filterEnable);
        this.whiteList = res.data;
        if (this.filterIpAddress && this.filterIpAddress.length > 0) {
          this.whiteList = this.whiteList.filter((t) =>
            t.ipAddress.includes(this.filterIpAddress)
          );
        }
      }

      this.total = this.whiteList.length;
      var sortObj = this.listQuery;
      if (sortObj.sortOrder == "descending") {
        this.whiteList = this.whiteList.sort(function (a, b) {
          return a[sortObj.sortKey] > b[sortObj.sortKey] ? -1 : 1;
        });
      } else {
        this.whiteList = this.whiteList.sort(function (a, b) {
          return a[sortObj.sortKey] < b[sortObj.sortKey] ? -1 : 1;
        });
      }

      var x = Math.ceil(this.total / this.size);
      if (x == 0) this.currentPage = 1;
      else if (this.currentPage > x) this.currentPage = x;
      //分頁
      var pageList = this.whiteList.filter(
        (item, index) =>
          index < this.size * this.currentPage &&
          index >= this.size * (this.currentPage - 1)
      );
      this.pageList = pageList;
      setTimeout(() => {
        this.listLoading = false;
      }, 0.3 * 1000);
    },

    handleAdd() {
      this.white = Object.assign({}, defaultData);
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    handleEdit(scope) {
      this.dialogType = "edit";
      this.white = deepClone(scope.row);
      this.dialogVisible = true;
    },
    async saveData() {
      let isVaild = false;
      this.$refs.white.validate((valid) => {
        if (valid) isVaild = true;
      });
      if (!isVaild) return;
      const isEdit = this.dialogType === "edit";
      let action;
      isEdit ? (action = 2) : (action = 1);
      const updateData = [
        {
          action: action,
          id: this.white.id,
          ipAddress: this.white.ipAddress,
          isEnable: this.white.isEnable,
          memo: this.white.memo,
          lastupdateUser: this.$store.getters.account,
          lastUpdateTime: "",
        },
      ];

      await PutWhitelisting(updateData);
      this.getWhitelisting();
      this.dialogVisible = false;
      this.$notify({
        title: "寫入成功",
        dangerouslyUseHTMLString: true,
        type: "success",
      });
    },
    handleDelete(row) {
      this.$confirm(`確定刪除：${row.ipAddress} ?`, "警告", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          var del = deepClone(row);
          del.action = 3;
          var delData = [del];
          await PutWhitelisting(delData);
          this.$message({
            type: "success",
            message: "刪除成功！",
          });
          this.getWhitelisting();
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>
