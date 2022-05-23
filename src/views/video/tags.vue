<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-show="isAdmin">
        <span class="label">供影商</span
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
      </div>
      <div style="padding: 10px; margin-top: 10px; border: 1px #ebeef5 solid">
        <span class="label">標籤分類</span
        ><selectTagTopics
          :spaceId.sync="spaceId"
          :topicId.sync="listQuery.topic"
          @getTagTopics="getTagTopics"
        ></selectTagTopics>
        <span class="label sub">熱門</span>
        <el-select
          v-model="listQuery.isRecommand"
          clearable
          placeholder="熱門標籤"
          default-first-option
          style="width: 120px"
        >
          <el-option
            v-for="item in boolOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <span class="label sub">標籤</span>
        <selectTagTitle
          :spaceId.sync="spaceId"
          :tagTitle.sync="listQuery.tagTitle"
          :topic.sync="listQuery.topic"
          :key="tagKey"
          domsize=""
        ></selectTagTitle>
        <!--
      <el-checkbox style="margin: 0px 10px" v-model="showCount"
        >增加影片統計</el-checkbox
      >
      -->
        <el-button
          :disabled="spaceId == ''"
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleSearch()"
          >搜尋</el-button
        >

        <newBtn
          :rolePermission="rolePermission"
          @click="handleAdd"
          class="filter-item"
        ></newBtn>
      </div>
    </div>
    <el-table
      v-if="rolePermission.canView"
      v-loading="listLoading"
      :data="itemList"
      style="width: 100%; margin-top: 20px"
      border
      header-cell-class-name="tableHeader"
      :default-sort="{ prop: 'id', order: 'ascending' }"
      @sort-change="sortChange"
    >
      <el-table-column
        :resizable="false"
        align="header-left"
        label="標籤ID"
        prop="id"
        sortable="custom"
        width="100"
        :sort-orders="['ascending', 'descending']"
      >
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="標籤名稱"
        prop="title"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
      >
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="標籤分類">
        <template slot-scope="scope">{{
          scope.row.topic | chValue(topicOptions)
        }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="熱門標籤"
        prop="isRecommand"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
      >
        <template slot-scope="scope">
          <span :class="[scope.row.isRecommand != 0 ? 'yesClass' : '']">{{
            scope.row.isRecommand | chValue(boolOptions)
          }}</span></template
        >
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="標籤順序"
        prop="seat"
        sortable="custom"
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
          `${scope.row.processCount} / ${scope.row.unLoadCount} / ${scope.row.videoCount}`
        }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="更新時間"
        width="160"
      >
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
      @pagination="getVideoTags()"
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
        <el-form-item
          label="Id"
          label-position="right"
          v-if="dialogType === 'edit'"
        >
          <el-input
            v-model="item.id"
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
            :disable="this.dialogType === 'edit'"
            :spaceId.sync="item.spaceId"
            :clear="false"
            :key="vendorKey"
            :roleType="1"
          ></selectVendor>
        </el-form-item>

        <el-form-item label="標籤名稱" label-position="right" prop="title">
          <el-input
            v-model="item.title"
            placeholder="標籤名稱"
            maxlength="100"
          />
        </el-form-item>

        <el-form-item label="標籤分類" label-position="right" prop="topic">
          <selectTagTopics
            :spaceId.sync="item.spaceId"
            :topicId.sync="item.topic"
          ></selectTagTopics>
        </el-form-item>

        <el-form-item label="熱門推荐" label-position="right" prop="remark">
          <el-switch
            v-model="item.isRecommand"
            actice-color="#00A854"
            active-text="是"
            :active-value="1"
            inactive-color="#F04134"
            inactive-text="否"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>

        <el-form-item label="標籤順序" label-position="right" prop="seat">
          <el-input-number
            v-model="item.seat"
            :precision="0"
            :min="0"
            :max="99999"
            maxLenght="4"
            label="標籤順序"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="創建時間">
          {{ item.createDate }}
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
import {
  GetVideoTagTopics,
  PostVideoTags,
  PostVideoTagsCount,
  GetVedioAllTags,
  PutVideoTag,
} from "@/api/video";
import pagination from "@/components/Pagination";
import selectTagTitle from "./components/select-tag-title";
//permission control button start
import getRolePermission from "../../utils/role-permission";
import newBtn from "@/components/PermissionControl/newButton";
import editBtn from "@/components/PermissionControl/editButton";
import deleteBtn from "@/components/PermissionControl/deleteButton";
import saveBtn from "@/components/PermissionControl/saveButton";
import cancelBtn from "@/components/PermissionControl/cancelButton";
//permission control button end
import selectTagTopics from "./components/select-tag-topics";
import selectVendor from "./components/select-vendor";

const defaultItem = {
  id: 0,
  title: "",
  isRecommand: 0,
  topic: undefined,
  seat: 1,
  createUser: "",
  lastUpdateUser: "",
  spaceId: undefined,
};

export default {
  data() {
    const validateStringTrim = (rule, value, callback) => {
      if (!value || value.trim().length == 0) {
        switch (rule.field) {
          case "title":
            callback(new Error("標籤名稱為必填"));
            break;
        }
      } else callback();
    };

    return {
      listLoading: false,
      isAdmin: false,
      vendorKey: 0,
      tagKey:0,
      showDisableVendor: false,
      spaceId: "",
      listQuery: {
        page: 1,
        limit: 20,
        topic: "",
        isRecommand: "",
        tagTitle: "",
        sortKey: "id",
        sortOrder: "ascending",
      },
      total: 0,
      item: Object.assign({}, defaultItem),
      itemList: [],
      dialogVisible: false,
      dialogType: "new",
      rule: {
        title: [
          { required: true, validator: validateStringTrim, trigger: "blur" },
        ],
        topic: [
          { required: true, message: "標籤分類為必填", trigger: "change" },
        ],
      },
      boolOptions: [
        { value: 1, label: "是" },
        { value: 0, label: "否" },
      ],
      topicOptions: [],
    };
  },
  components: {
    newBtn,
    editBtn,
    saveBtn,
    cancelBtn,
    deleteBtn,
    pagination,
    selectTagTopics,
    selectVendor,
    selectTagTitle,
  },
  filters: {
    chValue: function (value, ary) {
      let find = ary.find((e) => e.value == value);
      if (find) return find.label;
      else return value;
    },
  },
  watch: {
    spaceId: function (val) {
      if (val && val !== "") {
        this.listQuery.topic = "";
        this.listQuery.isRecommand = "";
        this.listQuery.tagTitle = "";
        this.resetTag();
        this.getVideoTags();
      }
    },
    "listQuery.tagTitle": "resetPage",
    "listQuery.topic": function (val) {
      this.resetPage();
      this.resetTag();
      if (val && val !== "") {
        this.listQuery.tagTitle = "";
      }
    },
    "listQuery.isRecommand": "resetPage",
  },
  computed: {
    rolePermission() {
      return this.getRolePermissions();
    },
  },
  created() {
    if (this.$store.getters.vendorId === 0) {
      this.spaceId = "";
      this.isAdmin = true;
    } else this.spaceId = this.$store.getters.vendorId;
    this.sortChange({ prop: "id", order: "ascending" });
  },
  methods: {
    getRolePermissions() {
      return getRolePermission(this.$route.name);
    },
    resetPage() {
      this.listQuery.page = 1;
    },
    resetVendor() {
      this.vendorKey += 1;
      this.tagKey += 1;
    },
    resetTag() {
      this.tagKey += 1;
    },
    getVendors(data) {
      this.vendorOptions = data;
    },
    getTagTopics(data) {
      this.topicOptions = data;
    },
    sortChange(data) {
      const { prop, order } = data;
      this.listQuery.sortKey = prop;
      this.listQuery.sortOrder = order;
      if (this.spaceId != "") this.getVideoTags();
    },
    handleSearch() {
      if (!this.spaceId || this.spaceId == "") {
        this.$message({
          type: "error",
          message: "請選擇操作供影商",
        });
        return false;
      }
      this.getVideoTags();
    },
    async getVideoTags() {
      if (!this.spaceId || this.spaceId == "") return false;
      this.listLoading = true;
      var where = {
        spaceId: this.spaceId,
        topic: this.listQuery.topic === "" ? -1 : this.listQuery.topic,
        isRecommand:
          this.listQuery.isRecommand === "" ? -1 : this.listQuery.isRecommand,
        title: this.listQuery.tagTitle == "" ? "" : this.listQuery.tagTitle,
      };
      var page = {
        number: this.listQuery.page,
        limit: this.listQuery.limit,
      };
      var order = {
        key: this.listQuery.sortKey,
        sort: this.listQuery.sortOrder == "ascending" ? "asc" : "desc",
      };

      var query = { where, page, order };

      const res = await PostVideoTagsCount(query);

      this.itemList = res.data;
      this.total = res.totalCount ? res.totalCount : 0;
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
        title: this.item.title.trim(),
        isRecommand: this.item.isRecommand,
        topic: this.item.topic,
        seat: this.item.seat,
        spaceId: this.item.spaceId,
        createUser: isEdit ? this.item.createUser : this.$store.getters.account,
        lastupdateUser: this.$store.getters.account,
      };
      //檢查名稱是否重覆
      /*
      if (!isEdit) {
        const res = await GetVedioAllTags();
        if (
          res.data.find(
            (o) => o.title == updateData.title && o.topic == updateData.topic
          )
        ) {
          this.$notify({
            title: "error",
            dangerouslyUseHTMLString: true,
            message: "標籤名稱重覆",
            type: "error",
          });
          return;
        }
      }
      */
      //寫入帳號
      await PutVideoTag(updateData);
      this.getVideoTags();
      this.resetTag();
      const { title } = updateData;
      this.dialogVisible = false;
      this.$notify({
        title: "寫入成功",
        dangerouslyUseHTMLString: true,
        message: `
            <div>標籤名稱: ${title}</div>
          `,
        type: "success",
      });
    },
    handleDelete({ $index, row }) {
      this.$confirm(`確定刪除：${row.title} ?`, "警告", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const delData = {
            type: 3,
            id: row.id,
            title: row.title,
            isRecommand: row.isRecommand,
            topic: row.topic,
            seat: row.seat,
            createUser: row.createUser,
            lastupdateUser: this.$store.getters.account,
          };

          await PutVideoTag(delData);
          this.$message({
            type: "success",
            message: "刪除成功！",
          });
          this.getVideoTags();
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
