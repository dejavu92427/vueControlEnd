<template>
  <div class="app-container">
    <div class="filter-container">
      <span v-show="isAdmin"
        ><span class="label">供影商</span
        ><selectVendor
          :spaceId.sync="vender"
          :clear="false"
          :showDisable="showDisableVendor"
          :key="vendorKey"
          :roleType="1"
          @getVendors="getVendors"
        ></selectVendor
        ><el-checkbox
          style="margin: 0px 10px"
          v-model="showDisableVendor"
          @change="resetVendor()"
          >顯示停用供影商</el-checkbox
        >
      </span>

      <!-- 新增的按鈕 -->
      <newBtn :rolePermission="rolePermission" @click="handleAddSort"></newBtn>
    </div>

    <!-- 資料 -->
    <el-table
      v-if="rolePermission.canView"
      :data="sortPageList"
      style="width: 100%; margin-top: 20px"
      border
      header-cell-class-name="tableHeader"
      v-loading="listLoading"
      :row-class-name="rowClassName"
      @sort-change="sortChange"
    >
      <el-table-column :resizable="false" label="序號" width="80" align="center"
        ><template slot-scope="scope">{{ scope.row.index }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="類別名稱">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="類別描述">
        <template slot-scope="scope">{{ scope.row.desc }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="首頁推薦"
        prop="isShow"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
      >
        <template slot-scope="scope">
          <span :class="[scope.row.isShow != false ? 'yesClass' : '']">
            {{ scope.row.isShow | chValue(is_show_ch) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="順序(數值越小，位置越前)"
        prop="seat"
        sortable="custom"
        min-width="130"
        :sort-orders="['ascending', 'descending']"
      >
        <template slot-scope="scope">{{ scope.row.seat }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="轉檔中 / 未上傳 / 全部"
        min-width="130"
      >
        <template slot-scope="scope">{{
          `${scope.row.processCount} / ${scope.row.unloadCount} / ${scope.row.videoCount}`
        }}</template>
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

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="size"
      @pagination="getAllSorts(false)"
    />

    <!-- 新增與修改功能頁面 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '修改' : '新增'"
    >
      <el-form
        v-if="dialogVisible"
        ref="sort"
        label-width="100px"
        :model="sort"
        :rules="rule"
      >
        <el-form-item
          label="Id"
          label-position="right"
          v-if="dialogType === 'edit'"
        >
          <el-input
            v-model="sort.id"
            :disabled="dialogType === 'edit'"
            placeholder="id"
          />
        </el-form-item>

        <el-form-item
          label="供影商"
          label-position="right"
          prop="spaceId"
          v-if="isAdmin"
        >
          <selectVendor
            :spaceId.sync="sort.spaceId"
            :clear="false"
            :key="vendorKey"
            :roleType="1"
          ></selectVendor>
        </el-form-item>

        <el-form-item label="類別名稱" label-position="right" prop="title">
          <el-input v-model="sort.title" placeholder="輸入類別名稱" />
        </el-form-item>

        <el-form-item label="類別描述" label-position="right" prop="desc">
          <el-input
            v-model="sort.desc"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="輸入類別描述"
          />
        </el-form-item>

        <!--el-form-item label="首頁推薦" label-position="right" prop="is_show">
          <el-input v-model="sort.is_show" placeholder="輸入首頁推薦" />
        </el-form-item-->

        <el-form-item label="首頁推薦" label-position="right" prop="is_show">
          <el-switch
            v-model="sort.isShow"
            actice-color="#00A854"
            active-text="是"
            :active-value="1"
            inactive-color="#F04134"
            inactive-text="否"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>

        <el-form-item label="首頁順序" label-position="right" prop="seat">
          <el-input-number
            v-model="sort.seat"
            :min="1"
            :max="99999"
          ></el-input-number>
        </el-form-item>

        <el-form-item
          label="創建時間"
          label-position="right"
          v-if="this.dialogType != 'new'"
        >
          {{ sort.createDate }}
        </el-form-item>
      </el-form>

      <div style="text-align: right">
        <cancelBtn
          :rolePermission="rolePermission"
          @click="dialogVisible = false"
        ></cancelBtn>
        <saveBtn :rolePermission="rolePermission" @click="saveSort"></saveBtn>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from "path";
import { deepClone } from "@/utils";
//import { getRole, getRoutes, updateRoute } from "@/api/role";
import { GetSortsCount, PutSorts, GetVenders } from "@/api/video";
import Sortable from "sortablejs";
//import svgIcons from "./svg-icons";
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
import selectVendor from "./components/select-vendor";

const defaultSort = {
  createDate: "",
  createUser: "",
  desc: "",
  id: 0,
  unLoadCount: 0,
  isShow: 0,
  lastUpdateTime: "",
  lastupdateUser: "",
  processCount: "",
  seat: 1,
  title: "",
  videoCount: 0,
  spaceId: undefined,
};

export default {
  data() {
    const validateStringTrim = (rule, value, callback) => {
      if (!value || value.trim().length == 0) {
        switch (rule.field) {
          case "title":
            callback(new Error("類別名稱為必填"));
            break;
          case "desc":
            callback(new Error("類別描述為必填"));
            break;
        }
      } else callback();
    };
    return {
      //  vender: this.$store.getters.vendorId,
      //  currentVender: 1,
      isAdmin: this.$store.getters.vendorId == 0 ? true : false,
      vendorKey: 0,
      showDisableVendor: false,
      vender:
        this.$store.getters.vendorId == 0 ? "" : this.$store.getters.vendorId,

      t: 0,
      e: 0,
      listQuery: {
        sortKey: "id",
        sortOrder: "descending",
      },
      videos: [],
      siteTitle: [],
      svgIcons: undefined,
      sortable: null,
      sort: Object.assign({}, defaultSort),
      sortList: [],
      sortPageList: [],
      total: 0,
      search: "",
      size: 20,
      currentPage: 1,
      dialogVisible: false,
      changeSequenceVisible: false,
      dialogType: "new",
      listLoading: false,
      rule: {
        //欄位規則
        spaceId: [
          { required: true, message: "供影商為必填", trigger: "change" },
        ],
        title: [
          { required: true, validator: validateStringTrim, trigger: "blur" },
        ],
        desc: [
          { required: true, validator: validateStringTrim, trigger: "blur" },
        ],
        seat: [{ required: true, message: "首頁順序為必填", trigger: "blur" }],
      },
      filterOptions: [],
      is_show_ch: [
        { value: false, label: "否" },
        { value: true, label: "是" },
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
  },
  watch: {
    vender: function () {
      this.currentPage = 1; //重新搜尋頁數
      this.getAllSorts();
    },
  },

  computed: {
    rolePermission() {
      return this.getRolePermissions();
    },
  },

  filters: {
    chValue: function (value, filterOptions) {
      let find = filterOptions.find((e) => e.value == value);
      if (find) return find.label;
      else return value;
    },
  },

  created() {
    // Mock: get all routes and roles list from server
    //this.svgIcons = svgIcons.concat(elementIcons);
    this.getAllSorts();
    // this.setSiteTitle();
  },

  methods: {
    rowClassName({ row, rowIndex }) {
      //把每一行的索引放進row
      var index = rowIndex + 1 + (this.currentPage - 1) * this.size;
      row.index = index;
    },
    resetVendor() {
      this.vendorKey += 1;
    },
    getVendors(data) {
      this.venders = data;
    },
    sortChange(data) {
      const { prop, order } = data;
      this.listQuery.sortKey = prop;
      this.listQuery.sortOrder = order;
      if (this.spaceId != "") this.getAllSorts(false);
    },
    async saveSort() {
      //儲存變更
      let isVaild = false;
      this.$refs.sort.validate((valid) => {
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
        c = this.sort.createUser;
      }

      const updateData = {
        type: type,
        id: this.sort.id,
        title: this.sort.title.trim(),
        desc: this.sort.desc.trim(),
        isShow: this.sort.isShow,
        seat: this.sort.seat,
        spaceId: this.sort.spaceId,
        createUser: c,
        lastUpdateUser: this.$store.getters.account,
        createDate: this.sort.createDate,
      };

      await PutSorts(updateData);
      this.getAllSorts();
      this.dialogVisible = false;
      this.$notify({
        title: "寫入成功",
        message: `
            <div>類別名稱: ${updateData.title}</div>
          `,
        dangerouslyUseHTMLString: true,
        type: "success",
      });
    },
    /*
    async setSiteTitle() {
      const domain = this.$store.getters.appconfig.domain;
      const res = await GetVenders(domain);

      this.filterOptions = res.data.map(function (o) {
        return { value: o.id, label: o.spaceName };
      });
    },
*/
    async getAllSorts(isCallApi = true) {
      if (this.vender == "") return false;
      this.listLoading = true;

      const condition = {
        spaceId: this.vender,
      };
      if (isCallApi) {
        const res = await GetSortsCount(condition);
        this.sortList = res.data;
      }
      this.total = this.sortList.length;
      var sortObj = this.listQuery;

      if (sortObj.sortOrder == "descending") {
        this.sortList = this.sortList.sort(function (a, b) {
          return a[sortObj.sortKey] > b[sortObj.sortKey] ? -1 : 1;
        });
      } else {
        this.sortList = this.sortList.sort(function (a, b) {
          return a[sortObj.sortKey] < b[sortObj.sortKey] ? -1 : 1;
        });
      }

      //分頁
      var pageList = this.sortList.filter(
        (item, index) =>
          index < this.size * this.currentPage &&
          index >= this.size * (this.currentPage - 1)
      );

      //拼裝啟用數量
      for (var i = 0; i < pageList.length; i++) {
        pageList[i].countVideos =
          pageList[i].unLoadCount + "(" + pageList[i].videoCount + ")";
      }

      this.sortPageList = pageList;

      setTimeout(() => {
        this.listLoading = false;
      }, 0.3 * 1000);
    },

    getRolePermissions() {
      //獲取權限
      return getRolePermission(this.$route.name);
    },

    handleAddSort() {
      //新增資料
      this.sort = Object.assign({}, defaultSort);
      this.sort.spaceId =
        this.$store.getters.vendorId === 0
          ? this.vender > 0
            ? this.vender
            : undefined
          : this.$store.getters.vendorId;
      this.dialogType = "new";
      this.dialogVisible = true;
    },

    copyAndNew(scope) {
      this.dialogType = "new";
      this.sort = deepClone(scope.row);
      this.dialogVisible = true;
    },

    handleEdit(scope) {
      //編輯資料
      this.dialogType = "edit";
      this.sort = deepClone(scope.row);
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
          this.deleteSort(scope);
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

    async deleteSort(scope) {
      //刪除資料
      let type = 3;
      this.sort = deepClone(scope.row);

      const updateData = {
        type: type,
        id: this.sort.id,
      };

      await PutSorts(updateData);
      this.getAllSorts();
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

<style>
</style>

