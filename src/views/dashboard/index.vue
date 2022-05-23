<template>
  <div class="dashboard-container">
    <div style="margin-bottom: 10px; color: gray">
      <strong>登入資訊</strong>
    </div>
    <div class="dashboard-text">
      <el-table
        :data="userData"
        style="width: 60%"
        header-cell-class-name="tableHeader"
        border
      >
        <el-table-column
          :resizable="false"
          align="header-center"
          prop="column"
          label="欄位"
          width="220"
        ></el-table-column>
        <el-table-column
          :resizable="false"
          align="header-center"
          prop="value"
          label="內容"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { GetVendersNoCount } from "@/api/video";
import { getRole } from "@/api/role";


export default {
  name: "Dashboard",
  computed: {
    ...mapGetters([
      "account",
      "userName",
      "role",
      "roleId",
      "domain",
      "auth",
      "token",
      "vendorId",
    ]),
    userData() {
      return [
        { column: "使用者", value: this.account },

        { column: "角色", value: this.roleName },

        { column: "廠商", value: this.vendor },
        /*
        {
          column: "使用者",
          value: this.userName,
        },
        { column: "auth", value: this.auth },
        { column: "domain", value: this.domain },
        { column: "token", value: this.token },
        */
      ];
    },
  },
  data() {
    return {
      vendor: "",
      allRoleOptions: [],
      roleName: "",
    };
  },
  async created() {
    if (this.vendorId == 0) {
      this.vendor = "全部";
    } else {
      const res = await GetVendersNoCount();
      if (res.data) {
        var vendorObj = res.data.find((o) => o.id == this.vendorId);
        if (vendorObj) this.vendor = vendorObj.spaceName;
      }
    }
    this.GetRoles();
  },
  methods: {
    async GetRoles() {
      const res = await getRole({});
      if (res.data) {
        var obj = res.data.find((o) => o.roleId == this.roleId);
        if (obj) this.roleName = obj.name;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
  }
}
</style>
