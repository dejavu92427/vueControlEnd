<template>
  <div class="app-container">
    <el-table
      class="middle"
      v-if="rolePermission.canView"
      :data="configList"
      border
      header-cell-class-name="tableHeader"
      v-loading="listLoading"
    >
      <el-table-column :resizable="false" align="header-left" label="配置名稱" min-width="30%">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column :resizable="false" align="header-left" label="值">
        <template slot-scope="scope">{{ scope.row.value }}</template>

        <template slot-scope="scope">
          <template v-if="rolePermission.canEdit">
            <el-select
              v-if="
                scope.row.value.toLowerCase() === 'true' ||
                scope.row.value.toLowerCase() === 'false'
              "
              v-model="scope.row.value"
            >
              <el-option
                v-for="item in boolOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input
              v-else
              v-model="scope.row.value"
              class="edit-input"
              size="small"
            />
          </template>
          <span v-else>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column :resizable="false" align="header-left" label="說明" min-width="50%">
        <template slot-scope="scope">
          <el-input v-model="scope.row.memo" class="edit-input" size="small"
        /></template>
      </el-table-column>
    </el-table>
    <div class="buttonBar middle">
      <saveBtn :rolePermission="rolePermission" @click="saveData" />
    </div>
  </div>
</template>

<script>
import { PutSystemConfigV2, GetSystemConfigV2 } from "@/api/system";
import { Message } from "element-ui";

//permission control button start
import getRolePermission from "../../utils/role-permission";
import saveBtn from "@/components/PermissionControl/saveButton";
//permission control button end

export default {
  components: {
    saveBtn,
  },
  data() {
    return {
      listLoading: false,
      configList: [],
      oldconfigList: [],
      type: "",
      boolOptions: [
        { value: "true", label: "true" },
        { value: "false", label: "false" },
      ],
    };
  },
  computed: {
    rolePermission() {
      return this.getRolePermissions();
    },
  },
  created() {
    this.getSystemConfig();
  },
  methods: {
    getRolePermissions() {
      return getRolePermission(this.$route.name);
    },
    async getSystemConfig() {
      this.listLoading = true;
      const path = this.$route.path.split("/");
      this.type = path[path.length - 1];
      const qtype = this.type;
      const res = await GetSystemConfigV2(qtype);

      if (qtype == "pn")
        this.configList = res.data.filter((t) =>
          t.name.includes(this.$store.getters.appconfig.domain)
        );
      else this.configList = res.data;
      this.oldconfigList = JSON.parse(JSON.stringify(this.configList));
      setTimeout(() => {
        this.listLoading = false;
      }, 0.3 * 1000);
    },
    async saveData() {
      let updateList = [];
      this.configList.forEach((item) => {
        let obj = this.oldconfigList.find((o) => o.name === item.name);
        if (obj) {
          if (obj.value !== item.value || obj.memo !== item.memo) {
            //only modify obj with different values
            const updateItem = Object.assign({}, item);
            updateItem.updateUser = this.$store.getters.account;
            updateList.push(updateItem);
          }
        }
      });
      await PutSystemConfigV2(updateList);
      this.$notify({
        title: "寫入成功",
        dangerouslyUseHTMLString: true,
        message: `${this.type.toUpperCase()} 配置更新成功`,
        type: "success",
      });
      this.getSystemConfig();
    },
  },
};
</script>



