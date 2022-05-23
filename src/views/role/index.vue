<template>
  <div class="app-container">
    <newBtn :rolePermission="rolePermission" @click="handleAddRole"></newBtn>
    <el-table
      v-if="rolePermission.canView"
      :data="rolesList"
      style="width: 100%; margin-top: 20px"
      border
      header-cell-class-name="tableHeader"
    >
      <el-table-column :resizable="false" align="header-left" label="Id" width="100">
        <template slot-scope="scope">{{ scope.row.roleId }}</template>
      </el-table-column>
      <el-table-column :resizable="false" align="header-left" label="角色" width="220">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column :resizable="false" align="header-left" label="說明">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column :resizable="false" align="header-left" label="操作">
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
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '修改角色' : '新增角色'"
    >
      <el-form ref="role" :model="role" label-width="80px" :rules="rule">
        <el-form-item label="角色" label-position="right" prop="name">
          <el-input v-model.trim="role.name" placeholder="Role Name" maxlength="20" />
        </el-form-item>
        <el-form-item label="說明" label-position="right">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="Role Description"
            maxlength="200"
          />
        </el-form-item>
        <el-form-item label="角色類型" label-position="right" prop="roleType">
          <el-radio-group v-model="role.roleType">
            <el-radio
              v-for="item in roleTypeOptions"
              :key="item.value"
              :label="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="功能列表" label-position="right">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            default-expand-all
            node-key="id"
            class="permission-tree"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span style="display: inline-block; width: 150px">{{
                node.label
              }}</span>
              <span v-show="!data.children">
                <el-checkbox
                  v-show="data.view"
                  v-model="node.checked"
                  :disabled="true"
                 
                  >檢視</el-checkbox
                >
                <el-checkbox
                  v-show="data.edit"
                  v-model="data.permission.permissionEdit"
                  :disabled="node && !node.checked"
                  >編輯</el-checkbox
                >
                <el-checkbox
                  v-show="data.delete"
                  v-model="data.permission.permissionDelete"
                  :disabled="node && !node.checked"
                  >刪除</el-checkbox
                >
                <el-checkbox
                  v-show="data.def1"
                  v-model="data.permission.permissionDef1"
                  :disabled="node && !node.checked"
                  >{{ data.defLabel1 }}</el-checkbox
                >
                <el-checkbox
                  v-show="data.def2"
                  v-model="data.permission.permissionDef2"
                  :disabled="node && !node.checked"
                  >{{ data.defLabel2 }}</el-checkbox
                >
              </span>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>

      <div style="text-align: right">
        <cancelBtn
          :rolePermission="rolePermission"
          @click="dialogVisible = false"
        ></cancelBtn>
        <saveBtn :rolePermission="rolePermission" @click="savemRole"></saveBtn>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from "path";
import { deepClone, rolePermission } from "@/utils";
import { getRole, getRouteV2, updateRole } from "@/api/role";
//permission control button start
import getRolePermission from "../../utils/role-permission";
import newBtn from "@/components/PermissionControl/newButton";
import editBtn from "@/components/PermissionControl/editButton";
import saveBtn from "@/components/PermissionControl/saveButton";
import cancelBtn from "@/components/PermissionControl/cancelButton";
import deleteBtn from "@/components/PermissionControl/deleteButton";
//permission control button end
const defaultRole = {
  roleId: 0,
  name: "",
  description: "",
  roleTyoe: 0,
  route: [],
};

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routeList: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: "new",
      checkStrictly: false,
      defaultProps: {
        children: "children",
        label: "title",
      },
      roleTypeOptions: [
        { value: 1, label: "供影商" },
        { value: 2, label: "廳主" },
        { value: 9, label: "未分類" },
      ],
      rule: {
        name: [{ required: true, message: "角色為必填", trigger: "blur" }],
        roleType: [{ required: true, message: "角色類型必填", trigger: "blur" }],
      },
    };
  },
  components: {
    newBtn,
    editBtn,
    saveBtn,
    cancelBtn,
    deleteBtn,
  },
  computed: {
    routesData() {
      return this.routeList;
    },
    rolePermission() {
      return this.getRolePermissions();
    },
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getRoles();
    this.getRoutes();
  },
  methods: {
    cancelCheck(data)
    {
      if(!data.view){
        data.permission.permissionEdit=false;
        data.permission.permissionDel=false;
      }
    },
    async getRoutes() {
      const domain = this.$store.getters.appconfig.domain;
      const res = await getRouteV2();
      this.serviceRoutes = res.data;
      this.routeList = this.generateRoutes(res.data);
    },
    async getRoles() {
      const domain = this.$store.getters.appconfig.domain;
      const res = await getRole({});
      this.rolesList = res.data;
    },
    getRolePermissions() {
      return getRolePermission(this.$route.name);
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = "/") {
      const res = [];
      for (let route of routes) {
        if (!route.permission)
          route.permission = {
            permissionView: false,
            permissionEdit: false,
            permissionDelete: false,
            permissionDef1: false,
            permissionDef2: false,
          };
        // skip some route
        if (route.hidden) {
          continue;
        }
        const data = {
          path: path.resolve(basePath, route.path),
          title: route.title,
          id: route.id,
          view: route.view,
          edit: route.edit,
          delete: route.delete,
          def1: route.def1,
          defLabel1: route.defLabel1,
          def2: route.def2,
          defLabel2: route.defLabel2,
          permission: route.permission,
        };

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path);
        }
        res.push(data);
      }
      return res;
    },
    generateArr(routes) {
      let data = [];
      routes.forEach((route) => {
        data.push(route);
        if (route.children) {
          const temp = this.generateArr(route.children);
          if (temp.length > 0) {
            data = [...data, ...temp];
          }
        }
      });
      return data;
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole);
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([]);
        const data = this.$refs.tree.data;
        data.forEach((roleRoute) => {
          roleRoute.children.forEach((role) => {
            if (role.permission) {
              role.permission.permissionView = false;
              role.permission.permissionEdit = false;
              role.permission.permissionDelete = false;
              role.permission.permissionDef1 = false;
              role.permission.permissionDef2 = false;
            }
          });
        });
      }
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    handleEdit(scope) {
      this.dialogType = "edit";

      this.checkStrictly = true;
      this.role = deepClone(scope.row);
      this.$nextTick(() => {
        const routes = this.generateRoutes(this.role.routes);
        this.$refs.tree.setCheckedNodes(this.generateArr(routes));
        const data = this.$refs.tree.data;
        data.forEach((roleRoute) => {
          roleRoute.children.forEach((role) => {
            const obj = routes.find((o) => o.id === role.id);
            if (obj) {
              role.permission.permissionView = obj.permission.permissionView;
              role.permission.permissionEdit = obj.permission.permissionEdit;
              role.permission.permissionDelete =
                obj.permission.permissionDelete;
              role.permission.permissionDef1 = obj.permission.permissionDef1;
              role.permission.permissionDef2 = obj.permission.permissionDef2;
            } else {
              role.permission.permissionView = false;
              role.permission.permissionEdit = false;
              role.permission.permissionDelete = false;
              role.permission.permissionDef1 = false;
              role.permission.permissionDef2 = false;
            }
          });
        });
        this.checkStrictly = false;
      });
      this.dialogVisible = true;
    },
    handleDelete({ $index, row }) {
      this.$confirm(`確定刪除角色：${row.name} ?`, "警告", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const delData = {
            type: 2,
            roleId: row.roleId,
            name: row.name,
            description: row.description,
            lastupdateUser: this.$store.getters.account,
            domain: this.$store.getters.appconfig.domain,
            delflag: true,
            routes: [],
          };
          await updateRole(delData);
          this.rolesList.splice($index, 1);
          this.$message({
            type: "success",
            message: "刪除成功！",
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    generateTree(routes, basePath = "/", checkedKeys) {
      const res = [];

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path);
        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(
            route.children,
            routePath,
            checkedKeys
          );
        }
        if (
          checkedKeys.includes(routePath) ||
          (route.children && route.children.length >= 1)
        ) {
          res.push(route);
        }
      }
      return res;
    },
    async savemRole() {
      let isVaild = false;
      this.$refs.role.validate((valid) => {
        if (valid) isVaild = true;
      });
      if (!isVaild) return;
      const isEdit = this.dialogType === "edit";
      // get checked route and permission
      const checkRoutes = [];
      const checkedKeys = this.$refs.tree.getCheckedKeys();
      const data = this.$refs.tree.data;
      data.forEach((roleRoute) => {
        roleRoute.children.forEach((route) => {
          if (checkedKeys.includes(route.id)) {
            checkRoutes.push({
              Id: route.id,
              permission: {
                permissionView: true,
                permissionEdit: route.permission.permissionEdit,
                permissionDelete: route.permission.permissionDelete,
                permissionDef1: route.permission.permissionDef1,
                permissionDef2: route.permission.permissionDef2,
              },
            });
          }
        });
      });
      if (checkRoutes.length == 0) {
        this.$notify({
          title: "error",
          dangerouslyUseHTMLString: true,
          message: "請至少選擇一個功能",
          type: "error",
        });
        return;
      }
      let type;
      isEdit ? (type = 2) : (type = 1);
      const r = this.role;
      const updateData = {
        type: type,
        roleId: this.role.roleId,
        name: this.role.name,
        description: this.role.description,
        roleType:this.role.roleType,
        //createUser: isEdit ? this.user.createUser : this.$store.getters.account,
        lastupdateUser: this.$store.getters.account,
        domain: this.$store.getters.appconfig.domain,
        delflag: false,
        routes: checkRoutes,
      };

      const res = await updateRole(updateData);
      this.getRoles();

      const { description, name } = this.role;
      this.dialogVisible = false;
      this.$notify({
        title: "寫入成功",
        dangerouslyUseHTMLString: true,
        message: `
            <div>角色: ${name}</div>
          `,
        type: "success",
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
