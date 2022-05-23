<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="searchId"
        placeholder="Id"
        auto-complete="on"
        style="width: 200px"
        class="filter-item"
        :clearable="true"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="getVideoSites(false)"
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
      :data="itemList"
      style="width: 100%; margin-top: 20px"
      border
      header-cell-class-name="tableHeader"
    >
      <el-table-column :resizable="false" align="header-left" label="视频站点Id">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="视频站点名稱">
        <template slot-scope="scope">{{ scope.row.site_name }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="备注">
        <template slot-scope="scope">{{ scope.row.remark }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="创建時間">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="更新時間">
        <template slot-scope="scope">{{ scope.row.lastUpdateTime }}</template>
      </el-table-column>

      <!-- *********************************************************************************** -->
      <el-table-column :resizable="false" align="header-left" label="操作" width="200">
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
      @pagination="getVideoSites(false)"
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
        <el-form-item label="Id" label-position="right"  v-if="dialogType === 'edit'">
          <el-input
            v-model="item.id"
            :disabled="dialogType === 'edit'"
            placeholder="id"
          />
        </el-form-item>

        <el-form-item
          label="视频站点名稱"
          label-position="right"
          prop="site_name"
        >
          <el-input v-model="item.site_name" placeholder="视频站点名稱" />
        </el-form-item>

        <el-form-item label="备注" label-position="right" prop="remark">
          <el-input v-model="item.remark" placeholder="备注" />
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
import { getRole } from "@/api/role";
import { GetVideoSites, PutVideoSites } from "@/api/video";
import pagination from "@/components/Pagination";

//permission control button start
import getRolePermission from "../../utils/role-permission";
import newBtn from "@/components/PermissionControl/newButton";
import editBtn from "@/components/PermissionControl/editButton";
import deleteBtn from "@/components/PermissionControl/deleteButton";
import saveBtn from "@/components/PermissionControl/saveButton";
import cancelBtn from "@/components/PermissionControl/cancelButton";
//permission control button end

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
    return {
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
        site_name: [
          { required: true, message: "视频站点名稱為必填", trigger: "blur" },
        ],
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
  },
  computed: {
    rolePermission() {
      return this.getRolePermissions();
    },
  },
  created() {
    this.getVideoSites();
  },
  watch:{
    searchId(val){ 
      if(val.trim().length==0)
      this.getVideoSites();
    }
  },
  methods: {
    getRolePermissions() {
      return getRolePermission(this.$route.name);
    },
    async getVideoSites(isCallApi = true) {
      if (isCallApi) {
        const res = await GetVideoSites();
        this.allItemList = res.data;
      }
     
      let filterList = this.allItemList;
      if (this.searchId.length > 0)
        filterList = this.allItemList.filter((o) => 
          o.id == this.searchId
        );

      this.total = filterList.length;
      const { page = 1, limit = 20, sort } = this.listQuery;
      const pageList = filterList.filter(
        (item, index) => index < limit * page && index >= limit * (page - 1)
      );
      this.itemList = pageList;
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    handleAdd() {
      this.item = Object.assign({}, defaultItem);
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
        site_name: this.item.site_name,
        remark: this.item.remark,
        createUser: this.item.createUser,
        lastupdateUser: this.$store.getters.account,
      };
      //檢查名稱是否重覆
      if (!isEdit) {
        const res = await GetVideoSites();
        if (res.data.find((o) => o.site_name == updateData.site_name)) {
          this.$notify({
            title: "error",
            dangerouslyUseHTMLString: true,
            message: "站台名稱重覆",
            type: "error",
          });
          return;
        }
      }
      //寫入帳號
      await PutVideoSites(updateData);
      this.getVideoSites();
      const { site_name } = updateData;
      this.dialogVisible = false;
      this.$notify({
        title: "寫入成功",
        dangerouslyUseHTMLString: true,
        message: `
            <div>站台名稱: ${site_name}</div>
          `,
        type: "success",
      });
    },
    handleDelete({ $index, row }) {
      this.$confirm(`確定刪除：${row.site_name} ?`, "警告", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const delData = [
            {
              type: 3,
              id: row.id,
              site_name: row.site_name,
              remark: row.remark,
              createUser: row.createUser,
              lastupdateUser: this.$store.getters.account,
            },
          ];
          await PutVideoSites(delData);
          this.$message({
            type: "success",
            message: "刪除成功！",
          });
          this.getVideoSites();
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
