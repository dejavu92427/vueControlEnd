<template>
  <div class="app-container">
    <!-- 搜尋列 -->
    <el-input
      v-model.trim="search"
      placeholder="請輸入域名"
      auto-complete="on"
      style="width: 200px"
      class="filter-item"
      :clearable="true"
    />
    <!-- 搜尋鈕 -->
    <el-button
      class="filter-item"
      type="primary"
      icon="el-icon-search"
      @click="getAllDomains"
      >搜尋</el-button
    >
    <!-- 新增的按鈕 -->
    <newBtn :rolePermission="rolePermission" @click="handleAddDomain"></newBtn>

    <!-- 資料 -->
    <el-table
      v-if="rolePermission.canView"
      :data="domainPageList"
      style="width: 100%; margin-top: 20px"
      border
      header-cell-class-name="tableHeader"
      :row-class-name="rowClassName"
    >
      <el-table-column :resizable="false" label="序號" width="80" align="center"
        ><template slot-scope="scope">{{ scope.row.index }}</template>
      </el-table-column>
      <el-table-column :resizable="false" align="header-left" label="API域名">
        <template slot-scope="scope">{{ scope.row.apiDomain }}</template>
      </el-table-column>

      <!--el-table-column align="header-left" label="啟用與否">
        <template slot-scope="scope">
          <span :class="[scope.row.isEnable != false ? 'yesClass' : '']">
            {{  scope.row.isEnable | chValue(trueOrFalse_ch) }}
          </span>
        </template>
      </el-table-column-->

      <el-table-column :resizable="false" align="header-left" label="更新時間">
        <template slot-scope="scope">{{ scope.row.lastUpdateTime }}</template>
      </el-table-column>

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
            <deleteBtn
              :rolePermission="rolePermission"
              @click="handleDelete(scope)"
            ></deleteBtn>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 頁面選擇 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="size"
      @pagination="getAllDomains()"
    />

    <!-- 新增與修改功能頁面 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '修改域名' : '新增域名'"
    >
      <el-form
        v-if="dialogVisible"
        ref="domain"
        label-width="100px"
        :model="domain"
        :rules="rule"
      >
        <el-form-item
          v-if="this.dialogType != 'new'"
          label="API Id"
          label-position="right"
          prop="apiDomain"
        >
          <el-input v-model="domain.id" :disabled="true" style="width: 200px" />
        </el-form-item>
        <el-form-item label="API域名" label-position="right" prop="apiDomain">
          <el-input
            v-model.trim="domain.apiDomain"
            placeholder="輸入API域名"
            style="width: 400px"
          />
        </el-form-item>

        <!--el-form-item label="啟用與否" label-position="right" prop="isEnable">
            <el-switch
              v-model="domain.isEnable"
              actice-color="#00A854"
              active-text="啟用"
              :active-value=true
              inactive-color="#F04134"
              inactive-text="停用"
              :inactive-value=false>
            </el-switch>
        </el-form-item-->

        <el-form-item
          label="創建時間"
          label-position="right"
          prop="createDate"
          v-if="this.dialogType != 'new'"
        >
          {{ domain.createDate }}
        </el-form-item>
      </el-form>

      <div style="text-align: right">
        <cancelBtn
          :rolePermission="rolePermission"
          @click="dialogVisible = false"
        ></cancelBtn>
        <saveBtn :rolePermission="rolePermission" @click="saveDomain"></saveBtn>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from "path";
import { deepClone } from "@/utils";
//import { getRole, getRoutes, updateRoute } from "@/api/role";
import { GetDomains, PutApiDomain } from "@/api/video";
//import elementIcons from "./element-icons";

//permission control button start
import getRolePermission from "../../utils/role-permission";
import newBtn from "@/components/PermissionControl/newButton";
import editBtn from "@/components/PermissionControl/editButton";
import saveBtn from "@/components/PermissionControl/saveButton";
import cancelBtn from "@/components/PermissionControl/cancelButton";
import deleteBtn from "@/components/PermissionControl/deleteButton";
//permission control button en
import pagination from "@/components/Pagination";

const defaultDomain = {
  apiDomain: "",
  createDate: "",
  createUser: "",
  id: 0,
  //isEnable: true,
  lastUpdateTime: "",
  lastUpdateUser: "",
};

export default {
  data() {
    return {
      domain: Object.assign({}, defaultDomain),
      domainList: [],
      domainPageList: [],
      total: 0,
      search: "",
      size: 20,
      currentPage: 1,
      dialogVisible: false,
      changeSequenceVisible: false,
      dialogType: "new",
      rule: {
        //欄位規則
        apiDomain: [
          { required: true, message: "API域名為必填", trigger: "blur" },
        ],
      },
      /*trueOrFalse_ch: [
        { value: false, label: "停用"},
        { value: true, label: "啟用"},
      ],*/
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
    // Mock: get all routes and roles list from server
    this.getAllDomains();
  },

  methods: {
    rowClassName({ row, rowIndex }) {
      //把每一行的索引放進row
      var index = rowIndex + 1 + (this.currentPage - 1) * this.size;
      row.index = index;
    },
    async saveDomain() {
      //儲存變更
      let isVaild = false;
      this.$refs.domain.validate((valid) => {
        if (valid) isVaild = true;
      });
      if (!isVaild) return;

      const isEdit = this.dialogType === "edit";
      let type;
      isEdit ? (type = 2) : (type = 1);

      let c;
      if (type == 1) {
        c = this.$store.getters.account;
      } else {
        c = this.domain.createUser;
      }

      const updateData = {
        type: type,
        id: this.domain.id,
        apiDomain: this.domain.apiDomain,
        //isEnable: this.domain.isEnable,
        createUser: c,
        lastUpdateUser: this.$store.getters.account,
      };

      await PutApiDomain(updateData);
      this.getAllDomains();
      this.dialogVisible = false;
      this.$notify({
        title: "寫入成功",
        dangerouslyUseHTMLString: true,
        type: "success",
      });
    },

    async getAllDomains() {
      //抓route資料
      const domain = this.$store.getters.appconfig.domain;
      const res = await GetDomains(domain);
      this.domainList = res.data;

      if (this.search != "") {
        this.domainList = this.domainList.filter(
          (item) => item.apiDomain.indexOf(this.search) != -1
        );
        this.filterTier = "";
      } else this.domainList = res.data;

      this.total = this.domainList.length;

      //刪除後頁數調整
      var x = Math.ceil(this.total / this.size);
      if (x == 0) this.currentPage = 1;
      else if (this.currentPage > x) this.currentPage = x;

      //分頁
      var pageList = this.domainList.filter(
        (item, index) =>
          index < this.size * this.currentPage &&
          index >= this.size * (this.currentPage - 1)
      );

      this.domainPageList = pageList;
    },

    getRolePermissions() {
      //獲取權限
      return getRolePermission(this.$route.name);
    },

    handleAddDomain() {
      //新增資料
      this.domain = Object.assign({}, defaultDomain);
      this.dialogType = "new";
      this.dialogVisible = true;
    },

    handleEdit(scope) {
      //編輯資料
      this.dialogType = "edit";
      this.domain = deepClone(scope.row);
      this.dialogVisible = true;
    },

    handleDelete(scope) {
      //編輯資料
      this.$confirm("確定要刪除此功能?", "警告", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteDomain(scope);
          this.$message({
            type: "success",
            message: "刪除成功！",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消刪除",
          });
        });
    },

    async deleteDomain(scope) {
      //刪除資料
      let type = 3;
      this.domain = deepClone(scope.row);

      const updateData = {
        type: type,
        id: this.domain.id,
      };

      await PutApiDomain(updateData);
      this.getAllDomains();
      this.dialogVisible = false;
      this.$notify({
        title: "刪除成功",
        dangerouslyUseHTMLString: true,
        type: "success",
      });
    },
  },
};
</script>
