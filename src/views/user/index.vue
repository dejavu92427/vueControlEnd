<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model.trim="searchList.account"
        placeholder="帳號"
        auto-complete="on"
        style="width: 200px"
        class="filter-item"
        :clearable="true"
        maxlength="20"
        @keyup.enter.native="GetUsers_api"
        @clear="GetUsers_api"
      />
      <el-select
        v-model="searchList.roleId"
        clearable
        default-first-option
        placeholder="角色"
      >
        <el-option
          v-for="item in allRoleOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <selectVendor
        :spaceId.sync="searchList.spaceId"
        :clear="true"
        :showDisable="false"
        :addAll="true"
        allText="全部(系統管理者)"
        placeholderText="廠商"
        @getVendors="getVendors"
      ></selectVendor>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="GetUsers_api"
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
      :data="userPageList"
      style="width: 100%; margin-top: 20px"
      border
      header-cell-class-name="tableHeader"
    >
      <el-table-column :resizable="false" align="header-left" label="帳號狀態">
        <template slot-scope="scope">
          <span
            :class="[scope.row.isEnable ? 'enableClass' : 'disableClass']"
            >{{ scope.row.isEnable | chValue(boolOptions) }}</span
          ></template
        >
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="帳號">
        <template slot-scope="scope">{{ scope.row.account }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="使用者暱稱"
      >
        <template slot-scope="scope">{{ scope.row.userName }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="廠商">
        <template slot-scope="scope">{{
          scope.row.spaceId | chVendor(spaceOptions)
        }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="角色">
        <template slot-scope="scope">{{
          scope.row.roleId | chValue(allRoleOptions)
        }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="最後登入時間"
      >
        <template slot-scope="scope">{{ scope.row.lastloginTime }}</template>
      </el-table-column>

      <el-table-column align="header-left" label="UBauth驗證" width="100">
        <template slot-scope="scope">
          <span
            :class="[scope.row.auth == 'N' ? 'disableClass' : '']"
            >{{ scope.row.auth | chValue(authOptions) }}</span
          >
        </template>
      </el-table-column>

      <!-- *********************************************************************************** -->
      <el-table-column
        :resizable="false"
        align="header-left"
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <editBtn
            :rolePermission="rolePermission"
            @click="handleEdit(scope)"
          ></editBtn>

          <el-button
            v-if="rolePermission.canEdit"
            type="primary"
            plain
            size="small"
            @click="handleUbAuth(scope)"
            >UBAuth</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="GetUsers_api(false)"
    />
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '修改帳號' : '新增帳號'"
    >
      <el-form
        v-if="dialogVisible"
        ref="user"
        :model="user"
        label-width="100px"
        :rules="rule"
      >
        <el-form-item label="是否啟用" label-position="right">
          <el-switch
            v-model="user.isEnable"
            actice-color="#00A854"
            active-text="啟用"
            :active-value="true"
            inactive-color="#F04134"
            inactive-text="停用"
            :inactive-value="false"
          >
          </el-switch>
        </el-form-item>

        <el-form-item label="帳號" label-position="right" prop="account">
          <el-input
            v-model.trim="user.account"
            :disabled="this.dialogType === 'edit'"
            placeholder="帳號"
            maxlength="12"
          />
        </el-form-item>

        <el-form-item label="使用者暱稱" label-position="right" prop="userName">
          <el-input
            v-model="user.userName"
            placeholder="使用者暱稱"
            maxlength="20"
          />
        </el-form-item>

        <el-form-item label="密碼" label-position="right" prop="pwd">
          <el-input
            v-model.trim="user.pwd"
            placeholder="密碼"
            type="password"
            maxlength="12"
          />
          <div
            style="
              padding: 0px 5px;
              width: 470px;
              display: flex;
              align-items: center;
            "
          >
            <i class="el-icon-info"></i
            ><span style="margin-left: 10px; font-size: 12px"
              >6-12位小寫字母、數字、特殊字符!@$&*，至少含其中兩種组合</span
            >
          </div>
        </el-form-item>
        <el-form-item label="廠商" label-position="right" prop="spaceId">
          <selectVendor
            :spaceId.sync="user.spaceId"
            :clear="false"
            :showDisable="showDisableVendor"
            :addAll="true"
            allText="全部(系統管理者)"
          ></selectVendor>
        </el-form-item>
        <el-form-item label="角色" label-position="right" prop="roleId">
          <el-select v-model="user.roleId" default-first-option>
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="UBauth" label-position="right" prop="auth">
          <el-select
            v-model="user.auth"
            default-first-option
            :disabled="this.dialogType !== 'edit'"
            placeholder="請選擇"
          >
            <el-option
              v-for="item in authOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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

    <el-dialog
      title="UB Auth管理"
      :visible.sync="dialogUbAuthVisible"
      @close="dialogUbAuthVisible = false"
      width="300px"
      class="ubauth"
    >
      <div style="text-align: center">
        <span
          v-if="isRegisterVisable || !resetDeviceButtonVisable"
          style="
            font-size: large;
            font-family: Helvetica Neue, Helvetica, PingFang SC,
              Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
          "
          >帳號未註冊</span
        >
        <el-button
          v-if="activeAccountButtonVisable"
          type="success"
          plain
          size="medium"
          @click="handleAccountStatus(9)"
          >啟用帳號</el-button
        >
        <el-button
          v-if="lockAccountButtonVisable"
          type="danger"
          plain
          size="medium"
          @click="handleAccountStatus(5)"
          >停用帳號</el-button
        >
        <el-button
          v-if="resetDeviceButtonVisable"
          type="danger"
          size="medium"
          @click="handleResetDev(user.username)"
          >裝置重置</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from "@/utils";
import { getRole } from "@/api/role";
import { GetSpace } from "@/api/web";
import {
  logout,
  GetConsolerUsers,
  PutConsolerUser,
  UBauthResetDevice,
  UBauthUpdateAccount,
  UBauthGetAccount,
  UBauthCheckDevice,
} from "@/api/user";
import { getToken } from "../../utils/auth";
import pagination from "@/components/Pagination";
import ElDragSelect from "@/components/DragSelect"; // base on element-ui

//permission control button start
import getRolePermission from "../../utils/role-permission";
import newBtn from "@/components/PermissionControl/newButton";
import editBtn from "@/components/PermissionControl/editButton";
import saveBtn from "@/components/PermissionControl/saveButton";
import cancelBtn from "@/components/PermissionControl/cancelButton";
import { GetVenders } from "@/api/video";
//permission control button end
import selectVendor from "@/views/video/components/select-vendor";
import { validPassword } from "../../utils/validate";

const defaultUser = {
  id: 0,
  account: "",
  userName: "",
  pwd: "",
  role: "",
  roleId: "",
  auth: "Y",
  createUser: "test1",
  lastUpdateUser: "test1",
  isEnable: true,
  domain: "",
  spaceId: "",
};

export default {
  data() {
    const validatePasswordFormat = (rule, value, callback) => {
      try {
        validPassword(value);
      } catch (err) {
        callback(err);
      }
      callback();
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密碼不得少於6碼"));
      } else {
        callback();
      }
    };
    const validateAccountStartWithTP = (rule, value, callback) => {
      if (this.dialogType == "new" && value.toLowerCase().startsWith("tp_")) {
        callback(new Error("帳號請勿以'tp_'開頭"));
      } else {
        callback();
      }
    };
    return {
      vendorKey: 0,
      showDisableVendor: false,
      spaceId: "",
      listQuery: {
        page: 1,
        limit: 20,
      },
      total: 0,
      user: Object.assign({}, defaultUser),
      userList: [],
      userPageList: [],
      dialogVisible: false,
      dialogUbAuthVisible: false,
      activeAccountButtonVisable: false,
      lockAccountButtonVisable: false,
      resetDeviceButtonVisable: false,
      isRegisterVisable: false,
      dialogType: "new",
      defaultProps: {
        children: "children",
        label: "title",
      },
      boolOptions: [
        { value: true, label: "啟用" },
        { value: false, label: "已停用" },
      ],
      spaceOptions: [],
      rule: {
        account: [
          { required: true, message: "帳號為必填", trigger: "blur" },
          {
            required: true,
            trigger: "blur",
            validator: validateAccountStartWithTP,
          },
        ],
        userName: [
          { required: true, message: "使用者名稱為必填", trigger: "blur" },
        ],
        pwd: [
          { required: true, message: "密碼為必填", trigger: "blur" },
          { required: true, trigger: "blur", validator: validatePassword },
          {
            required: true,
            trigger: "blur",
            validator: validatePasswordFormat,
          },
        ],
        roleId: [{ required: true, message: "角色為必選", trigger: "blur" }],
        spaceId: [{ required: true, message: "廠商為必選", trigger: "blur" }],
      },
      allRoleOptions: [],
      roleOptions: [],
      authOptions: [
        { key: "Y", label: "需驗證", value: "Y" },
        { key: "N", label: "不驗證", value: "N" },
      ],
      searchList: { account: "", roleId: "", spaceId: "" },
    };
  },
  watch: {
    "user.spaceId": "filterRoleList",
  },
  components: {
    newBtn,
    editBtn,
    saveBtn,
    cancelBtn,
    pagination,
    ElDragSelect,
    selectVendor,
  },
  computed: {
    rolePermission() {
      return this.getRolePermissions();
    },
  },
  created() {
    this.GetUsers_api();
    this.GetRoles();
  },
  filters: {
    chValue: function (value, ary) {
      let find = ary.find((e) => e.value == value);
      if (find) return find.label;
      else return value;
    },
    chVendor: function (value, ary) {
      if (value === 0) return "全部";
      let find = ary.find((e) => e.value == value);
      if (find) return find.label;
      else return value;
    },
    chDate: function (value) {
      if (value == "0000-00-00 00:00:00") return "";
      else return value;
    },
  },
  methods: {
    getRolePermissions() {
      return getRolePermission(this.$route.name);
    },
    getVendors(data) {
      this.spaceOptions = data;
    },
    async GetRoles() {
      const domain = this.$store.getters.appconfig.domain;
      const res = await getRole({});
      const roledata = res.data.map((r) => {
        return { value: r.roleId, label: r.name, roleType: r.roleType };
      });
      this.allRoleOptions = roledata;
    },
    filterRoleList() {
      this.roleOptions = [];
      if (this.user.spaceId != 0) {
        var vendor = this.spaceOptions.find(
          (o) => o.value == this.user.spaceId
        );
        if (vendor)
          this.roleOptions = this.allRoleOptions.filter(
            (o) => o.roleType == vendor.roleType
          );
      } else
        this.roleOptions = this.allRoleOptions.filter((o) => o.roleType == 9);
      if (!this.roleOptions.find((o) => o.value == this.user.roleId))
        this.user.roleId = undefined;
    },
    async GetUsers_api(isCallApi = true) {
      if (isCallApi) {
        const search = { domain: this.$store.getters.appconfig.domain };
        /*
        if (this.searchList.account.trim()) {
          search.account = this.searchList.account.trim();
          this.searchList.roleId = "";
        }
        */
        const res = await GetConsolerUsers(search);
        this.userList = res.data;

        if (this.searchList.roleId !== "") {
          this.userList = this.userList.filter(
            (o) => o.roleId == this.searchList.roleId
          );
        }

        if (this.searchList.spaceId !== "") {
          this.userList = this.userList.filter(
            (o) => o.spaceId == this.searchList.spaceId
          );
        }

        this.searchList.account = this.searchList.account.trim();
        if (this.searchList.account != "") {
          this.userList = this.userList.filter(
            (o) =>
              o.account.indexOf(this.searchList.account) > -1 ||
              o.userName.indexOf(this.searchList.account) > -1
          );
        }
      }
      this.total = this.userList.length;
      //刪除後頁數調整
      var x = Math.ceil(this.total / limit);
      if (page > x) page = x;

      const { page = 1, limit = 20, sort } = this.listQuery;
      const pageList = this.userList.filter(
        (item, index) => index < limit * page && index >= limit * (page - 1)
      );
      this.userPageList = pageList;
    },
    async SaveUser_api(user) {
      const res = await PutConsolerUser(user);
      GetUsers_api();
    },

    // Reshape the routes structure so that it looks the same as the sidebar
    handleAdd() {
      this.user = Object.assign({}, defaultUser);
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    handleEdit(scope) {
      this.dialogType = "edit";
      this.user = deepClone(scope.row);
      this.dialogVisible = true;
    },
    handleUbAuth(scope) {
      this.user = deepClone(scope.row);
      //unRegisUbauth
      this.isRegisterVisable = true;
      this.activeAccountButtonVisable = false;
      this.lockAccountButtonVisable = false;
      this.resetDeviceButtonVisable = false;
      const authAccount = `${this.$store.getters.appconfig.domainUBAuth}_${scope.row.account}`;
      UBauthGetAccount(authAccount)
        .then((res) => {
          if (res.data.type !== undefined) {
            this.isRegisterVisable = false;
            if (res.data.type == 9) {
            //  this.lockAccountButtonVisable = true;
              UBauthCheckDevice(authAccount)
                .then((res) => {
                  if (res.data.isRegistered) {
                    this.resetDeviceButtonVisable = true;
                  }
                })
                .catch(function (error) {});
            } else {
            //  this.activeAccountButtonVisable = true;
            }
          }
        })
        .catch(function (error) {});

      this.dialogUbAuthVisible = true;
    },
    UpdateAccount(authAccount, authType) {
      var updAuth = { account: authAccount, type: authType };
      const res = UBauthUpdateAccount(updAuth);
      this.dialogUbAuthVisible = false;
    },
    ResetDevice() {
      const authAccount = `${this.$store.getters.appconfig.domainUBAuth}_${this.user.account}`;
      const res = UBauthResetDevice(authAccount);
      this.dialogUbAuthVisible = false;
      this.$notify({
        title: "UBauth裝置已重置",
        dangerouslyUseHTMLString: true,
        message: `
            <div>帳號: ${this.user.account}</div>
          `,
        type: "success",
      });
    },
    handleAccountStatus(authType) {
      var buttonText = "";
      if (authType == 5) {
        buttonText = "停用";
      } else if (authType == 9) {
        buttonText = "啟用";
      }
      const authAccount = `${this.$store.getters.appconfig.domainUBAuth}_${this.user.account}`;
      this.$confirm(`確定 "${buttonText}"?`, `【${buttonText}】UB Auth帳號`, {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.UpdateAccount(authAccount, authType);
          this.$notify({
            title: `UBauth帳號已${buttonText}!!`,
            dangerouslyUseHTMLString: true,
            message: `
            <div>帳號: ${this.user.account}</div>
            `,
            type: "success",
          });
        })
        .catch((err) => {
          console.error(err);
        });
      this.dialogUbAuthVisible = false;
    },
    handleResetDev() {
      const authAccount = `${this.$store.getters.appconfig.domainUBAuth}_${this.user.account}`;
      this.$confirm(`確定重置?`, `【重置】UB Auth裝置`, {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.ResetDevice(this.user.account);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async saveData() {
      let isVaild = false;
      this.$refs.user.validate((valid) => {
        if (valid) isVaild = true;
      });
      if (!isVaild) return;
      const isEdit = this.dialogType === "edit";
      let type;
      isEdit ? (type = 2) : (type = 1);
      let role = this.roleOptions.find((obj) => obj.value === this.user.roleId);
      //檢查角色
      if (!role) {
        this.$notify({
          title: "error",
          dangerouslyUseHTMLString: true,
          message: "角色已失效，請重新選擇",
          type: "error",
        });
        return;
      }

      const updateData = {
        id: this.user.id,
        account: this.user.account.toLowerCase().trim(),
        userName: this.user.userName,
        pwd: this.user.pwd,
        role: role.name,
        roleId: this.user.roleId,
        auth: this.user.auth,
        createUser: isEdit ? this.user.createUser : this.$store.getters.account,
        lastupdateUser: this.$store.getters.account,
        isEnable: this.user.isEnable,
        spaceId: this.user.spaceId,
        lastloginTime: this.user.lastloginTime,
      };
      //檢查帳號是否重覆
      if (type == 1) {
        const res = await GetConsolerUsers(updateData);
        if (res.data.find((o) => o.account == updateData.account)) {
          this.$notify({
            title: "error",
            dangerouslyUseHTMLString: true,
            message: "此帳號已有人使用",
            type: "error",
          });
          return;
        }
      }
      if (updateData.isEnable == false) {
        const res = await GetConsolerUsers(updateData);
        var updUser = res.data.find((o) => o.account == updateData.account);
        if (updUser.isEnable) {
          const authAccount =
            this.$store.getters.appconfig.domainUBAuth +
            "_" +
            updateData.account;
          this.UpdateAccount(authAccount, "5");
        }
      }

      //寫入帳號
      await PutConsolerUser(updateData);
      this.GetUsers_api();
      const { userName, account } = this.user;
      this.dialogVisible = false;
      this.$notify({
        title: "寫入成功",
        dangerouslyUseHTMLString: true,
        message: `
            <div>使用者: ${userName}</div>
            <div>帳號: ${account}</div>
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
  .el-dialog__wrapper .ubauth .el-dialog {
    min-width: 100px;
  }
}
</style>

<style>
.el-dialog__wrapper.ubauth .el-dialog {
  min-width: 250px;
}
</style>