<template>
  <div class="app-container">
    <!-- 層數選單 -->
    <el-select
      style="margin-right: 10px"
      v-model="filterTier"
      default-first-option
      clearable
      class="filter-item"
      placeholder="請選擇"
      @change="
        getAllRoutes(1);
      "
    >
      <el-option
        v-for="item in filterOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <!-- 搜尋列 -->
    <el-input
      v-model.trim="search"
      placeholder="請輸入標題"
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
      @click="getAllRoutes(1)"
      >搜尋</el-button
    >
    <!-- 新增的按鈕 -->
    <newBtn :rolePermission="rolePermission" @click="handleAddRoute"></newBtn>
    <!-- 更改順序 -->
    <el-button
      icon="el-icon-sort"
      type="success"
      size="middle"
      @click="changeSequence"
      >更改順序</el-button
    >

    <!-- 資料 -->
    <el-table
      v-if="rolePermission.canView"
      :data="routePageList"
      style="width: 100%; margin-top: 20px"
      border
      header-cell-class-name="tableHeader"
    >
      <el-table-column :resizable="false" align="header-left" label="Id">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="標題">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="圖示">
        <template slot-scope="scope"
          ><svg-icon
            v-if="!scope.row.icon.startsWith('el-icon')"
            :icon-class="scope.row.icon"
          />
          <i v-else :class="scope.row.icon" />
        </template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="路徑">
        <template slot-scope="scope">{{ scope.row.path }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="上級">
        <template slot-scope="scope">{{
          scope.row.parentId | chValue(filterOptions)
        }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="順序">
        <template slot-scope="scope">{{ scope.row.sequence }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="上次更新時間"
      >
        <template slot-scope="scope">{{ scope.row.lastUpdateTime }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="操作"
        width="209"
      >
        <template slot-scope="scope">
          <el-button-group>
            <editBtn
              :rolePermission="rolePermission"
              @click="handleEdit(scope)"
            ></editBtn>
            <el-tooltip
              :enterable="false"
              content="複製"
              placement="top-start"
              effect="light"
            >
              <el-button
                v-if="rolePermission.canEdit"
                type="success"
                plain
                size="small"
                icon="el-icon-document-copy"
                @click="copyAndNew(scope)"
              ></el-button
            ></el-tooltip>
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
      @pagination="getAllRoutes(false)"
    />
    <div style="margin: 20px 0"></div>

    <!-- 更改順序頁面 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="changeSequenceVisible"
      title="更改順序"
    >
      <el-select
        style="margin-right: 10px"
        v-model="parent"
        default-first-option
        class="filter-item"
        @change="getSequenceList"
      >
        <el-option
          v-for="item in filterOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <el-table
        ref="dragTable"
        :data="routeList"
        row-key="title"
        border
        fit
        highlight-current-row
        style="width: 100%; cursor: pointer"
        header-cell-class-name="tableHeader"
      >
        <el-table-column
          :resizable="false"
          align="center"
          label="順序"
          width="60px"
        >
          <template slot-scope="{ row }">
            <span>{{ row.sequence }}</span>
          </template>
        </el-table-column>

        <el-table-column :resizable="false" align="center" label="標題">
          <template slot-scope="{ row }">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div style="text-align: right">
        <cancelBtn
          :rolePermission="rolePermission"
          @click="changeSequenceVisible = false"
        ></cancelBtn>
        <saveBtn
          :rolePermission="rolePermission"
          @click="saveSeqData"
        ></saveBtn>
      </div>
    </el-dialog>

    <!-- 新增與修改功能頁面 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '修改功能' : '新增功能'"
    >
      <el-form
        v-if="dialogVisible"
        ref="route"
        label-width="100px"
        :model="route"
        :rules="rule"
      >
        <el-form-item label="上級" label-position="right" prop="parentId">
          <el-select
            v-model="route.parentId"
            default-first-option
            :disabled="this.route.parentId == 0 && this.dialogType == 'edit'"
          >
            <el-option
              v-for="item in filterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名稱" label-position="right" prop="name">
          <el-input
            v-model.trim="route.name"
            maxlength="20"
            placeholder="功能名稱，需與路徑的最後一層相同, ex:LCF "
          />
        </el-form-item>

        <el-form-item label="標題" label-position="right" prop="title">
          <el-input
            v-model.trim="route.title"
            placeholder="顯示的名稱"
            maxlength="6"
          />
        </el-form-item>

        <el-form-item label="圖示" label-position="right">
          <el-select v-model="route.icon" style="width: 250px" filterable="">
            <!--
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            >
            -->
            <el-option
              v-for="icon in svgIcons"
              :key="icon"
              :label="icon"
              :value="icon"
            >
              <svg-icon v-if="!icon.startsWith('el-icon')" :icon-class="icon" />
              <i v-else :class="icon" />{{ ` - ${icon}` }}
            </el-option> </el-select
          ><svg-icon
            v-if="!route.icon.startsWith('el-icon')"
            :icon-class="route.icon"
            style="margin-left: 10px"
          />
          <i v-else :class="route.icon" style="margin-left: 10px" />
        </el-form-item>

        <el-form-item label="描述" label-position="right">
          <el-input v-model="route.description" maxlength="200" />
        </el-form-item>

        <el-form-item
          v-if="route.parentId != 0"
          label="元件"
          label-position="right"
          :prop="route.parentId != 0 ? 'component' : ''"
          maxlength="200"
        >
          <el-input
            v-model.trim="route.component"
            placeholder="/資料夾/檔案名 ex: /config/index"
          />
        </el-form-item>

        <el-form-item label="路徑" label-position="right" prop="path">
          <el-input
            v-model.trim="route.path"
            placeholder="/資料夾/參數 ex: /config , /config/lcf"
            maxlength="200"
          />
        </el-form-item>

        <el-form-item label="順序" label-position="right">
          <el-input-number
            v-model="route.sequence"
            :precision="0"
            :min="1"
            :max="99999"
            label="順序"
          ></el-input-number>
        </el-form-item>

        <el-form-item
          label="權限"
          label-position="right"
          v-if="route.parentId != 0"
        >
          <el-checkbox
            v-model="route.view"
            :disabled="this.route.parentId == 0 && this.dialogType == 'edit'"
            >檢視</el-checkbox
          >
          <el-checkbox
            v-model="route.edit"
            :disabled="this.route.parentId == 0 && this.dialogType == 'edit'"
            >編輯</el-checkbox
          >
          <el-checkbox
            v-model="route.delete"
            :disabled="this.route.parentId == 0 && this.dialogType == 'edit'"
            >刪除</el-checkbox
          >
          <span style="margin-right: 30px">
            <el-checkbox
              v-model="route.def1"
              :disabled="this.route.parentId == 0 && this.dialogType == 'edit'"
              style="margin-right: 5px"
              >自訂1</el-checkbox
            >
            <el-input
              v-if="route.def1"
              v-model="route.defLabel1"
              style="width: 100px"
            />
          </span>
          <el-checkbox
            v-model="route.def2"
            :disabled="this.route.parentId == 0 && this.dialogType == 'edit'"
            style="margin-right: 5px"
            >自訂2</el-checkbox
          >
          <el-input
            v-if="route.def2"
            v-model="route.defLabel2"
            style="width: 100px"
          />
        </el-form-item>
      </el-form>

      <div style="text-align: right">
        <cancelBtn
          :rolePermission="rolePermission"
          @click="dialogVisible = false"
        ></cancelBtn>
        <saveBtn :rolePermission="rolePermission" @click="saveRoute"></saveBtn>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from "path";
import { deepClone } from "@/utils";
import { getRole, getRoutes, updateRoute } from "@/api/role";
import Sortable from "sortablejs";
import svgIcons from "./svg-icons";
import elementIcons from "./element-icons";
//permission control button start
import getRolePermission from "../../utils/role-permission";
import newBtn from "@/components/PermissionControl/newButton";
import editBtn from "@/components/PermissionControl/editButton";
import saveBtn from "@/components/PermissionControl/saveButton";
import cancelBtn from "@/components/PermissionControl/cancelButton";
import deleteBtn from "@/components/PermissionControl/deleteButton";
import pagination from "@/components/Pagination";

//permission control button end
/*const defaultRole = {
  roleId: 0,
  name: "",
  description: "",
  route: [],
};*/

const defaultRoute = {
  id: 0,
  name: "",
  title: "",
  icon: "",
  description: "",
  component: "",
  path: "",
  view: "",
  edit: "",
  delete: "",
  parentId: undefined,
  sequence: "",
  domain: "",
  delflag: 0,
  createUser: "",
  lastupdateUser: "",
  def1: false,
  defLabel1: "",
  def2: false,
  defLabel2: "",
};

export default {
  data() {
    return {
      svgIcons: undefined,
      sortable: null,
      route: Object.assign({}, defaultRoute),
      routeList: [],
      routePageList: [],
      total: 0,
      search: "",
      size: 20,
      currentPage: 1,
      dialogVisible: false,
      changeSequenceVisible: false,
      dialogType: "new",
      checkStrictly: false,
      defaultProps: {
        children: "children",
        label: "title",
      },
      rule: {
        //欄位規則
        parentId: [{ required: true, message: "請選擇上級", trigger: "blur" }],
        name: [{ required: true, message: "名稱為必填", trigger: "blur" }],
        title: [{ required: true, message: "標題為必填", trigger: "blur" }],
        path: [
          {
            required: true,
            message: "路徑為必填",
            trigger: "blur",
          },
        ],
        component: [
          {
            required: true,
            message: "元件為必填",
            trigger: "blur",
          },
        ],
      },
      filterOptions: [],
      Parents: [], //上級選單
      options: [
        //圖示選單
        { value: "1", label: "dashboard" },
        { value: "2", label: "example" },
        { value: "3", label: "eye" },
        { value: "4", label: "eye-open" },
        { value: "5", label: "form" },
        { value: "6", label: "link" },
        { value: "7", label: "nested" },
        { value: "8", label: "password" },
        { value: "9", label: "table" },
        { value: "10", label: "tree" },
        { value: "11", label: "user" },
      ],
      filterTier: 0,
      parent: 0,
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
    //上級id顯示title
    chValue: function (value, Parents) {
      let find = Parents.find((e) => e.value == value);
      if (find) return find.label;
      else return value;
    },
  },

  created() {
    // Mock: get all routes and roles list from server
    this.svgIcons = svgIcons.concat(elementIcons);
    //this.GetRoles();
    this.getAllRoutes();
  },

  methods: {
    async saveSeqData() {
      let type = 2;
      for (var i = 0; i < this.routeList.length; i++) {
        this.route = this.routeList[i];

        let v;
        this.route.view ? (v = true) : (v = false);
        let e;
        this.route.edit ? (e = true) : (e = false);
        let d;
        this.route.delete ? (d = true) : (d = false);

        const updateData = {
          type: type,
          id: this.route.id,
          domain: this.$store.getters.appconfig.domain,
          sequence: Number(this.route.sequence),
          path: this.route.path,
          component: this.route.component,
          name: this.route.name,
          title: this.route.title,
          icon: this.route.icon,
          description: this.route.description,
          view: v,
          edit: e,
          delete: d,
          def1: this.route.def1,
          defLabel1: this.route.defLabel1,
          def2: this.route.def2,
          defLabel2: this.route.defLabel2,
          parentId: Number(this.route.parentId),
          createUser: this.$store.getters.account,
          lastupdateUser: this.$store.getters.account,
        };

        await updateRoute(updateData);
      }
      this.getAllRoutes();
      this.changeSequenceVisible = false;
      this.$notify({
        title: "更新成功",
        dangerouslyUseHTMLString: true,
        type: "success",
      });
    },

    async saveRoute() {
      //儲存變更
      let isVaild = false;
      this.$refs.route.validate((valid) => {
        if (valid) isVaild = true;
      });
      if (!isVaild) return;

      const isEdit = this.dialogType === "edit";
      let type;
      isEdit ? (type = 2) : (type = 1);

      let v;
      this.route.view ? (v = true) : (v = false);
      let e;
      this.route.edit ? (e = true) : (e = false);
      let d;
      this.route.delete ? (d = true) : (d = false);

      const updateData = {
        type: type,
        id: this.route.id,
        sequence: Number(this.route.sequence),
        path: this.route.path,
        component: this.route.component,
        name: this.route.name,
        title: this.route.title,
        icon: this.route.icon,
        description: this.route.description,
        view: v,
        edit: e,
        delete: d,
        def1: this.route.def1,
        defLabel1: this.route.def1 ? this.route.defLabel1 : "",
        def2: this.route.def2,
        defLabel2: this.route.def2 ? this.route.defLabel2 : "",
        parentId: Number(this.route.parentId),
        createUser: this.$store.getters.account,
        lastupdateUser: this.$store.getters.account,
      };

      await updateRoute(updateData);
      this.getAllRoutes();
      const {
        id,
        title,
        icon,
        path,
        parentId,
        createDate,
        lastUpdateTime,
      } = this.route;
      this.dialogVisible = false;
      this.$notify({
        title: "寫入成功",
        dangerouslyUseHTMLString: true,
        message: `
            <div>功能: ${updateData.name}</div>
          `,
        type: "success",
      });
    },

    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll(
        ".el-table__body-wrapper > table > tbody"
      )[0];
      this.sortable = Sortable.create(el, {
        ghostClass: "sortable-ghost", // Class name for the drop placeholder,
        setData: function (dataTransfer) {
          // to avoid Firefox bug
          dataTransfer.setData("Text", "");
        },
        onEnd: (evt) => {
          const targetRow = this.routeList.splice(evt.oldIndex, 1)[0];
          this.routeList.splice(evt.newIndex, 0, targetRow);
          this.routeList.forEach(function (item, index, array) {
            item.sequence = index + 1;
          });
        },
      });
    },

    async changeSequence() {
      this.getSequenceList();
      if(this.filterTier!=="") this.parent=this.filterTier
      this.changeSequenceVisible = true;
    },

    async getSequenceList() {
      const domain = this.$store.getters.appconfig.domain;
      const res = await getRoutes(domain);
      this.routeList = res.data.filter((item) => item.parentId == this.parent);
      for (var i = 0; i < this.routeList.length - 1; i++) {
        //依照sequence排序
        for (var j = i + 1; j < this.routeList.length; j++) {
          if (
            this.routeList[i].sequence > this.routeList[j].sequence &&
            this.routeList[i].parentId == this.routeList[j].parentId
          ) {
            var temp = this.routeList[i];
            this.routeList[i] = this.routeList[j];
            this.routeList[j] = temp;
          }
        }
      }
      this.$nextTick(() => {
        this.setSort();
      });
    },

    async getAllRoutes(c) {
      //抓route資料
      if (c == 1) {
        //變更層數時回到第一頁
        this.currentPage = 1;
      }
      const domain = this.$store.getters.appconfig.domain;
      const res = await getRoutes(domain);
      const tier = this.filterTier;
      this.routeList = res.data;

      this.filterOptions = res.data
        .filter((o) => o.parentId == 0)
        .map(function (o) {
          return { value: o.id, label: o.title };
        });
      this.filterOptions.splice(0, 0, {
        value: 0,
        label: "根目錄",
      });

      if (this.search != "") {
        this.routeList = this.routeList.filter(
          (item) => item.title.indexOf(this.search) != -1
        );
      }

      if (tier !== "")
        this.routeList = this.routeList.filter(
          (item) => item.parentId === tier
        );

      for (var i = 0; i < this.routeList.length - 1; i++) {
        //依照sequence排序
        for (var j = i + 1; j < this.routeList.length; j++) {
          if (
            this.routeList[i].sequence > this.routeList[j].sequence &&
            this.routeList[i].parentId == this.routeList[j].parentId
          ) {
            var temp = this.routeList[i];
            this.routeList[i] = this.routeList[j];
            this.routeList[j] = temp;
          }
        }
      }
      this.total = this.routeList.length; //分頁
      var t = this.total;
      var s = this.size;
      //刪除後頁數調整
      var x = Math.ceil(this.total / this.size);
      if (x == 0) this.currentPage = 1;
      else if (this.currentPage > x) this.currentPage = x;

      const pageList = this.routeList.filter(
        (item, index) =>
          index < this.size * this.currentPage &&
          index >= this.size * (this.currentPage - 1)
      );
      this.routePageList = pageList;
    },

    getRolePermissions() {
      //獲取權限
      return getRolePermission(this.$route.name);
    },

    handleAddRoute() {
      //新增資料
      this.route = Object.assign({}, defaultRoute);
      if (this.filterTier !== "") this.route.parentId = this.filterTier;
      this.dialogType = "new";
      this.dialogVisible = true;
    },

    copyAndNew(scope) {
      this.dialogType = "new";
      this.route = deepClone(scope.row);
      if (this.route.parentId != 0) {
        //第二層parentId無法選擇根目錄
        this.Parents.shift();
      }
      this.dialogVisible = true;
    },

    handleEdit(scope) {
      //編輯資料
      this.dialogType = "edit";
      this.route = deepClone(scope.row);

      if (this.route.parentId != 0) {
        //第二層parentId無法選擇根目錄
        this.Parents.shift();
      }

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
          this.deleteRoute(scope);
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

    async deleteRoute(scope) {
      //刪除資料
      let type = 3;
      this.route = deepClone(scope.row);
      let v;
      this.route.view ? (v = true) : (v = false);
      let e;
      this.route.edit ? (e = true) : (e = false);
      let d;
      this.route.delete ? (d = true) : (d = false);

      const updateData = {
        type: type,
        id: this.route.id,
        delflag: true,
        sequence: Number(this.route.sequence),
        path: this.route.path,
        component: this.route.component,
        name: this.route.name,
        title: this.route.title,
        icon: this.route.icon,
        description: this.route.description,
        view: v,
        edit: e,
        delete: d,
        parentId: Number(this.route.parentId),
        createUser: this.$store.getters.account,
        lastupdateUser: this.$store.getters.account,
      };

      await updateRoute(updateData);
      this.getAllRoutes();
      const {
        id,
        title,
        icon,
        path,
        parentId,
        createDate,
        lastUpdateTime,
      } = this.route;
      this.dialogVisible = false;
    },
  },
};
</script>

<style>
</style>

