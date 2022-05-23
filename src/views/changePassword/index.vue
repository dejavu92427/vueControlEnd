<template>
  <div class="app-container" style="width: 30%">
    <!-- 主要頁面 -->
    <div
      style="
        box-shadow: 1px 1px 2px 2px #cccccc;
        padding: 10px;
        margin-bottom:20px;
        width: 470px;
        display: flex;
        align-items: center;
        color:#694B2F
      "
    >
      <i class="el-icon-info"></i
      ><span style="margin-left: 10px; font-size: 12px;"
        >密碼規則：6-12位小寫字母、數字、特殊字符!@$&*，至少含其中兩種组合</span
      >
    </div>

    <el-form ref="user" :model="user" label-width="100px" :rules="rule">
      <el-form-item label="舊密碼" label-position="right" prop="oldPassword">
        <el-input v-model.trim="user.oldPassword" type="password" />
      </el-form-item>
      <el-form-item label="新密碼" label-position="right" prop="newPassword">
        <el-input v-model.trim="user.newPassword" type="password" />
      </el-form-item>
      <el-form-item
        label="確認密碼"
        label-position="right"
        prop="commitPassword"
      >
        <el-input v-model.trim="user.commitPassword" type="password" />
      </el-form-item>
    </el-form>
    <div style="text-align: right">
      <saveBtn :rolePermission="rolePermission" @click="savePassword"></saveBtn>
    </div>
  </div>
</template>

<script>
import { GetConsolerUsers, PutConsolerUser } from "@/api/user";
import getRolePermission from "../../utils/role-permission";
import { validPassword } from "../../utils/validate";
import saveBtn from "@/components/PermissionControl/saveButton";

const defaultUser = {
  id: 0,
  account: "",
  userName: "",
  pwd: "",
  role: "",
  roleId: "",
  auth: "",
  createUser: "test1",
  lastUpdateUser: "test1",
  isEnable: true,
  domain: "",
  lastloginTime: "",
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

    const validateOldPassword = (rule, value, callback) => {
      if (value != this.user.pwd) {
        callback(new Error("舊密碼錯誤"));
      } else {
        callback();
      }
    };

    const validateNewPassword = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error("密碼不得少於4碼"));
      }
      if (value == this.user.pwd) {
        callback(new Error("新密碼與舊密碼不能相同"));
      } else {
        callback();
      }
    };

    const validateCommitPassword = (rule, value, callback) => {
      if (rule.field == "newPassword") {
        if (this.user.commitPassword !== undefined)
          this.$refs.user.validateField("commitPassword");
      } else if (value != this.user.newPassword) {
        callback(new Error("新密碼與確認密碼不相同"));
      }
      callback();
    };

    return {
      user: Object.assign({}, defaultUser),
      rule: {
        //欄位規則
        oldPassword: [
          { required: true, message: "舊密碼為必填", trigger: "blur" },
          { required: true, trigger: "blur", validator: validateOldPassword },
        ],

        newPassword: [
          { required: true, message: "新密碼為必填", trigger: "blur" },
          { required: true, trigger: "blur", validator: validateNewPassword },
          {
            required: false,
            trigger: "blur",
            validator: validateCommitPassword,
          },
        ],

        commitPassword: [
          { required: true, message: "確認密碼為必填", trigger: "blur" },
          {
            required: true,
            trigger: "blur",
            validator: validateCommitPassword,
          },
          {
            required: true,
            trigger: "blur",
            validator: validatePasswordFormat,
          },
        ],
      },
    };
  },

  components: {
    saveBtn,
  },

  computed: {
    rolePermission() {
      return this.getRolePermissions();
    },
  },

  created() {
    this.getUserData();
  },

  methods: {
    async getUserData() {
      const search = {};
      search.account = this.$store.getters.account;
      const res = await GetConsolerUsers(search);
      this.user = res.data[0];
    },

    getRolePermissions() {
      //獲取權限
      return getRolePermission(this.$route.name);
    },

    async savePassword() {
      //儲存變更
      let isVaild = false;
      this.$refs.user.validate((valid) => {
        if (valid) isVaild = true;
      });
      if (!isVaild) return;

      const updateData = {
        id: this.user.id,
        account: this.user.account.toLowerCase(),
        userName: this.user.userName,
        pwd: this.user.newPassword,
        role: this.user.role,
        roleId: this.user.roleId,
        auth: this.user.auth,
        spaceId: this.user.spaceId,
        createUser: this.user.createUser,
        lastupdateUser: this.$store.getters.account,
        isEnable: this.user.isEnable,
        lastloginTime: this.user.lastloginTime,
      };

      await PutConsolerUser(updateData);

      this.getUserData();

      this.$notify({
        title: "更新成功",
        dangerouslyUseHTMLString: true,
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