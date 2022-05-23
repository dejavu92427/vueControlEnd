<template>
  <div class="app-container">
    <div class="filter-container">
      <span v-show="isAdmin"
        ><span class="label">供影商</span
        ><selectVendor
          :spaceId.sync="spaceId"
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
      <newBtn
        :rolePermission="rolePermission"
        @click="handleAdd"
        class="filter-item"
      ></newBtn>
    </div>
    <el-table
      v-loading="listLoading"
      v-if="rolePermission.canView"
      :data="itemList"
      style="width: 100%; margin-top: 20px"
      border
      header-cell-class-name="tableHeader"
      :row-class-name="rowClassName"
    >
      <el-table-column :resizable="false" label="序號" width="80" align="center"
        ><template slot-scope="scope">{{ scope.row.index }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="標籤分類">
        <template slot-scope="scope">{{ scope.row.topic }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="創建時間">
        <template slot-scope="scope">{{ scope.row.createDate }}</template>
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
      @pagination="getVideoTagTopics(false)"
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
        @submit.native.prevent
      >
        <el-form-item
          label="Id"
          label-position="right"
          v-if="dialogType === 'edit'"
        >
          <el-input
            v-model="item.id"
            :disabled="this.dialogType === 'edit'"
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
            :disable="this.dialogType === 'edit'"
            :spaceId.sync="item.spaceId"
            :clear="false"
            :key="vendorKey"
            :roleType="1"
          ></selectVendor>
        </el-form-item>
        <el-form-item label="標籤分類" label-position="right" prop="topic">
          <el-input
            v-model="item.topic"
            placeholder="標籤分類"
            maxlength="25"
          />
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
import { GetVideoTagTopics, PutVideoTagTopics } from "@/api/video";
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

const defaultItem = {
  id: 0,
  site_name: "",
  remark: "",
  userName: "",
  createUser: "",
  lastUpdateUser: "",
};

export default {
  data() {
    const validateStringTrim = (rule, value, callback) => {
      if (!value || value.trim().length == 0) {
        switch (rule.field) {
          case "topic":
            callback(new Error("標籤分類為必填"));
            break;
        }
      } else callback();
    };

    return {
      isAdmin: false,
      spaceId: "",
      vendorKey: 0,
      showDisableVendor: false,
      vendorOptions: [],
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
      rule: {
        topic: [{ required: true, message: "標籤分類為必填", trigger: "blur" }],
      },
      searchId: "",
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
  computed: {
    rolePermission() {
      return this.getRolePermissions();
    },
  },
  watch: {
    spaceId: async function (val) {
      if (val) {
        this.listQuery.page = 1;
        await this.getVideoTagTopics(true);
      }
    },
  },
  created() {
    if (this.$store.getters.vendorId === 0) {
      this.isAdmin = true;
      this.spaceId = "";
    } else {
      this.spaceId = this.$store.getters.vendorId;
    }
    this.getVideoTagTopics();
  },

  methods: {
    getRolePermissions() {
      return getRolePermission(this.$route.name);
    },
    resetVendor() {
      this.vendorKey += 1;
    },
    getVendors(data) {
      this.vendorOptions = data;
    },
    rowClassName({ row, rowIndex }) {
      //把每一行的索引放進row
      var index =
        rowIndex + 1 + (this.listQuery.page - 1) * this.listQuery.limit;
      row.index = index;
    },
    async getVideoTagTopics(isCallApi = true) {
      this.listLoading = true;
      if (isCallApi && this.spaceId) {
        const res = await GetVideoTagTopics(this.spaceId);
        this.allItemList = res.data;
      }

      let filterList = this.allItemList;

      this.total = filterList.length;
      const { page = 1, limit = 20, sort } = this.listQuery;
      const pageList = filterList.filter(
        (item, index) => index < limit * page && index >= limit * (page - 1)
      );
      this.itemList = pageList;
      setTimeout(() => {
        this.listLoading = false;
      }, 0.3 * 1000);
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    handleAdd() {
      var item = Object.assign({}, defaultItem);
      item.spaceId = this.spaceId;
      this.item = item;
      this.dialogType = "new";
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
        topic: this.item.topic.trim(),
        spaceId: this.item.spaceId,
        createUser: isEdit ? this.item.createUser : this.$store.getters.account,
        lastupdateUser: this.$store.getters.account,
      };
      //檢查是否重覆
      if (!isEdit) {
        const res = await GetVideoTagTopics(this.spaceId);
        if (res.data.find((o) => o.topic == updateData.topic)) {
          this.$notify({
            title: "error",
            dangerouslyUseHTMLString: true,
            message: "標籤分類重覆",
            type: "error",
          });
          return;
        }
      }
      //寫入
      await PutVideoTagTopics(updateData);
      this.getVideoTagTopics();
      const { topic } = updateData;
      this.dialogVisible = false;
      this.$notify({
        title: "寫入成功",
        dangerouslyUseHTMLString: true,
        message: `
            <div>標籤分類: ${topic}</div>
          `,
        type: "success",
      });
    },
    handleDelete({ $index, row }) {
      this.$confirm(`確定刪除：${row.topic} ?`, "警告", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const delData = {
            type: 3,
            id: row.id,
            topic: row.topic,
            createUser: row.createUser,
            lastupdateUser: this.$store.getters.account,
          };

          await PutVideoTagTopics(delData);
          this.$message({
            type: "success",
            message: "刪除成功！",
          });
          this.getVideoTagTopics();
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
