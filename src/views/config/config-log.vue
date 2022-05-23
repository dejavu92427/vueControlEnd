<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.type"
        placeholder="Type"
        class="filter-item"
        style="width: 130px"
        default-first-option
        @change="getCionfigName"
      >
        <el-option
          v-for="item in configType"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="listQuery.name"
        placeholder="Name"
        class="filter-item"
        style="width: 200px"
        @change="
          listQuery.page = 1;
          getList(false);
        "
      >
        <el-option
          v-for="item in configName"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <el-table
      v-if="rolePermission.canView"
      :data="configList"
      style="width: 100%; margin-top: 20px"
      v-loading="listLoading"
      border
      header-cell-class-name="tableHeader"
    >
      <el-table-column :resizable="false" align="header-left" label="類別" min-width="30%">
        <template slot-scope="scope">{{ scope.row.type }}</template>
      </el-table-column>
      <el-table-column :resizable="false" align="header-left" label="配置名稱">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column :resizable="false" align="header-left" label="值">
        <template slot-scope="scope">{{ scope.row.value }}</template>
      </el-table-column>
      <el-table-column :resizable="false" align="header-left" label="修改者">
        <template slot-scope="scope">{{ scope.row.updateUser }}</template>
      </el-table-column>
      <el-table-column :resizable="false" align="header-left" label="修改日期">
        <template slot-scope="scope">{{ scope.row.updateDate }}</template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList(false)"
    />
  </div>
</template>

<script>
import { GetSystemConfigLog, GetSystemConfigV2 } from "@/api/system";
import { Message } from "element-ui";
import Pagination from "@/components/Pagination";
//import { parseTime } from '@/utils'

//permission control button start
import getRolePermission from "../../utils/role-permission";
//permission control button end

const demoType = [
  { label: "LCF", value: "lcf" },
  { label: "CFS", value: "cfs" },
  { label: "CCF", value: "ccf" },
  { label: "DU", value: "du" },
];
const defaultType = [
  { label: "LCF", value: "lcf" },
  { label: "CFS", value: "cfs" },
  { label: "PN", value: "pn" },
  { label: "CCF", value: "ccf" },
  { label: "CU", value: "cu" },
  { label: "QAD", value: "qad" },
  { label: "DU", value: "du" },
  { label: "CDU", value: "cdu" },
  { label: "DL", value: "dl" },
  { label: "BONUS", value: "bonus" },
];

export default {
  components: { Pagination },
  data() {
    return {
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        type: undefined,
        sort: "+startTime",
      },
      configList: [],
      allConfigList: [],
      searchType: "lcf",
      configName: [],
      configType: [],
    };
  },
  computed: {
    rolePermission() {
      return this.getRolePermissions();
    },
  },
  created() {
    this.getConfigType();
    this.getCionfigName();
    //this.getList(true);
  },
  methods: {
    getRolePermissions() {
      return getRolePermission(this.$route.name);
    },
    getConfigType() {
      if (this.$store.getters.appconfig.isDemo) {
        defaultType.forEach(function (value, index, array) {
          let o = demoType.find((o) => o.label == value.label);
          if (o) value.value = o.value;
        });
      }
      this.configType = defaultType;
      if (this.configType.length > 0)
        this.listQuery.type = this.configType[0].value;
    },
    async getCionfigName() {
      if(this.listQuery.type=="bonus")
      {
         this.listQuery.name=undefined;
         this.configName=[];
         this.getList(true)
         return;
      }
      
      const qtype = this.listQuery.type;
      const res = await GetSystemConfigV2(qtype);
      const data = res.data;
      const tmpdata = Array.from(new Set(data.map((r) => r.name))).map((r) => {
        return {
          value: r,
          label: r,
        };
      });
      if (qtype.type == "pn")
        this.configName = tmpdata.filter((t) =>
          t.label.includes(this.$store.getters.appconfig.domain)
        );
      else this.configName = tmpdata;

      if (this.configName.length > 0) {
        this.listQuery.name = this.configName[0].value;
        this.listQuery.page = 1;
        this.getList(true);
      }
    },
    async getList(getNewData) {
      this.listLoading = true;
      const qtype = {
        type: this.listQuery.type,
      };

      if (getNewData) {
        const res = await GetSystemConfigLog(qtype);
        this.allConfigList = res.data;
        if (!res.data || res.data.length == 0) Message.info("查無異動資料");
        //if (sort === "-startTime") {
        this.allConfigList = this.allConfigList.sort(function (a, b) {
          return a.updateDate < b.updateDate ? -1 : 1;
        });
        //}
      }
      const { page = 1, limit = 20, sort, name } = this.listQuery;
      let mockList = this.allConfigList.filter((item) => {
        if (name && item.name.indexOf(name) < 0) return false;
        return true;
      });
      this.total = mockList.length;
      this.configList = mockList.filter(
        (item, index) => index < limit * page && index >= limit * (page - 1)
      );
      // Just to simulate the time of the request
      setTimeout(() => {
        this.listLoading = false;
      }, 0.3 * 1000);
    },
  },
};
</script>