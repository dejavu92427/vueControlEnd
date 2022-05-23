<template>
  <div class="app-container">
    <div class="filter-container">
      <span v-show="isAdmin"
        ><span class="label">廳主</span
        ><selectVendor
          :spaceId.sync="spaceId"
          :clear="false"
          :showDisable="showDisableVendor"
          :key="vendorKey"
          :roleType="2"
          :selectOnlyOne="true"
          @getVendors="getVendors"
        ></selectVendor
        ><el-checkbox
          style="margin: 0px 10px"
          v-model="showDisableVendor"
          @change="resetVendor()"
          >顯示停用廳主</el-checkbox
        >
      </span>
      <el-button
        plain
        type="success"
        icon="el-icon-s-operation"
        @click="
          () => {
            this.advanced_search = !advanced_search;
          }
        "
        >篩選</el-button
      >
      <el-button
        :disabled="!spaceId || viewListLoading"
        type="primary"
        icon="el-icon-new"
        :loading="viewListLoading"
        @click="
          dialogVendor = true;
          handleVendors();
        "
        >供影商管理</el-button
      >
      <div
        v-show="advanced_search"
        style="padding: 10px; margin-top: 10px; border: 1px #ebeef5 solid"
      >
        <el-row :gutter="5" align="middle" type="flex">
          <el-col :span="2" class="col_label">供影商</el-col>
          <el-col :span="8">
            <el-select
              :loading="viewListLoading"
              v-model="listQuery.videoSpaceId"
              default-first-option
              clearable
              placeholder="供影商"
              size="mini"
            >
              <el-option
                v-for="item in yesVendorOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="2" class="col_label">視頻分類</el-col>
          <el-col :span="8"
            ><selectSort
              :sortId.sync="listQuery.sort"
              :spaceId="listQuery.videoSpaceId"
              :key="listQuery.videoSpaceId"
              @getSorts="getSorts"
              :clear="true"
              domsize="mini"
            ></selectSort
          ></el-col>
          <el-col :span="2" class="col_label">視頻標籤</el-col>
          <el-col :span="8"
            ><selectTagTitle
              :tagTitle.sync="listQuery.tagTitle"
              :spaceId.sync="listQuery.videoSpaceId"
              :key="listQuery.videoSpaceId"
              domsize="mini"
            ></selectTagTitle
          ></el-col>
        </el-row>
        <el-row :gutter="5" align="middle" type="flex">
          <el-col :span="2" class="col_label">視頻作者</el-col>
          <el-col :span="8"
            ><selectOwner
              :artist.sync="listQuery.artist"
              @getOwners="getOwners"
              domsize="mini"
            ></selectOwner
          ></el-col>

          <el-col :span="2" class="col_label">熱門推薦</el-col>
          <el-col :span="8"
            ><el-select
              v-model="listQuery.recommend"
              clearable
              placeholder="熱門推薦"
              default-first-option
              size="mini"
            >
              <el-option
                v-for="item in boolOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option> </el-select
          ></el-col>
          <el-col :span="2" class="col_label">啟用狀態</el-col>
          <el-col :span="8">
            <el-select
              v-model="listQuery.status"
              clearable
              placeholder="是否啟用"
              default-first-option
              size="mini"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option> </el-select
          ></el-col>
        </el-row>
        <el-row :gutter="5" align="middle" type="flex">
          <el-col :span="2" class="col_label">視頻ID</el-col>
          <el-col :span="8">
            <el-input-number
              class="left"
              size="mini"
              v-model="listQuery.id"
              :precision="0"
              :min="1"
              :max="2147483647"
              label="視頻ID"
              style="width: 175px"
              :clear="true"
              placeholder="視頻ID"
              :controls="false"
            ></el-input-number>
          </el-col>

          <el-col :span="2" class="col_label">視頻標題</el-col>
          <el-col :span="8">
            <autoautocompleteVideoTitle
              :title.sync="listQuery.title"
              domsize="mini"
            ></autoautocompleteVideoTitle>
            <!-- <el-input
              v-model="listQuery.title"
              size="mini"
              placeholder="視頻標題"
              clearable
              maxlength="100"
            ></el-input
          > -->
          </el-col>
          <el-col :span="10" align="left">
            <el-button
              class="filter-item"
              type="warning"
              size="small"
              icon="el-icon-refresh-left"
              @click="cancelSearch()"
              >重置</el-button
            >
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="
                listQuery.page = 1;
                getViewerVideo();
              "
              >搜尋</el-button
            >
          </el-col>
        </el-row>
      </div>
    </div>
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      style="margin-top: 10px; margin-bottom: 0px"
    >
      <el-col :span="12" class="summaryText">{{ `${summary}` }}</el-col>
      <el-col :span="12" style="text-align: right">
        <el-select
          v-if="rolePermission.canEdit"
          v-model="batchAction"
          clearable
          placeholder="請選擇操作項目"
          default-first-option
        >
          <el-option
            v-for="item in actionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button
          v-if="rolePermission.canEdit"
          type="primary"
          icon="el-icon-check"
          plain
          :disabled="spaceId == '' || batchAction == ''"
          @click="handleBatchAction()"
          >執行</el-button
        >
      </el-col>
    </el-row>
    <el-table
      v-if="rolePermission.canView"
      v-loading="listLoading"
      :data="itemList"
      style="width: 100%; margin-top: 0px"
      border
      header-cell-class-name="tableHeader"
      :row-key="getRowKeys"
      :default-sort="{ prop: 'videoId', order: 'descending' }"
      @sort-change="sortChange"
    >
      <el-table-column
        :resizable="false"
        v-if="rolePermission.canEdit"
        width="40"
      >
        <template slot="header" slot-scope="scope">
          <el-checkbox
            :indeterminate="tableIsIndeterminate"
            :scope="scope"
            v-model="checkAll"
            :disabled="checkAlldisabled"
            @change="handleChange"
          ></el-checkbox>
        </template>
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.checked"
            @change="handleSelectionChange"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
        :resizable="false"
        align="header-left"
        label="視頻ID"
        width="100"
        prop="videoId"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
      >
        <template slot-scope="scope">{{ scope.row.videoId }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="視頻標題"
        min-width="200"
      >
        <template slot-scope="scope">{{
          scope.row.title.length > 0 ? scope.row.title[0].title : ""
        }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="圖片"
        width="140px"
      >
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.imageUpLoad == 1 && scope.row.processStatus != 1"
            style="max-width: 100px; max-height: 80px"
            :src="scope.row.PreviewImageUrl"
          >
          </el-image>
          <aes-image
            v-if="scope.row.processStatus == 1"
            :src="scope.row.PreviewImageUrl"
            :imageKey="scope.row.imageKey"
            :imageIV="scope.row.imageIV"
            :imgWidth="100"
            :key="scope.row.id"
          />
        </template>
      </el-table-column>
      <el-table-column :resizable="false" align="header-left" label="供影商">
        <template slot-scope="scope">{{
          scope.row.videoSpaceId | chValue(vendorOptions)
        }}</template>
      </el-table-column>
      <el-table-column :resizable="false" align="header-left" label="視頻分類">
        <template slot-scope="scope">{{
          scope.row.sort | chValue(sortOptions)
        }}</template>
      </el-table-column>
      <el-table-column
        :resizable="false"
        width="120px"
        align="header-left"
        label="狀態"
        prop="status"
      >
        <template slot-scope="scope">
          <span
            :class="[
              scope.row.status == 1
                ? scope.row.processStatus == 1
                  ? 'enableClass'
                  : 'inProcessClass'
                : 'disableClass',
            ]"
          >
            {{
              scope.row.status == 1
                ? scope.row.processStatus == 1
                  ? "上架中"
                  : "轉檔中或未上傳"
                : "下架中"
            }}
          </span></template
        >
      </el-table-column>
      <el-table-column
        :resizable="false"
        align="header-left"
        label="熱門推薦"
        width="90px"
      >
        <template slot-scope="scope">
          <span :class="[scope.row.recommend != 0 ? 'yesClass' : '']">{{
            scope.row.recommend | chValue(boolOptions)
          }}</span></template
        >
      </el-table-column>
      <el-table-column
        :resizable="false"
        align="header-left"
        label="播放量"
        width="100px"
      >
        <template slot-scope="scope">{{ scope.row.views }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="按贊量"
        width="100px"
      >
        <template slot-scope="scope">{{ scope.row.zans }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="更新時間"
        width="160px"
        sortable="custom"
        prop="lastUpdateTime"
        :sort-orders="['ascending', 'descending']"
      >
        <template slot-scope="scope">{{ scope.row.lastUpdateTime }}</template>
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
          <el-tooltip
            :enterable="false"
            content="預覽"
            placement="top-start"
            effect="light"
          >
            <el-button
              v-if="rolePermission.canView"
              type="info"
              plain
              size="small"
              icon="el-icon-video-play"
              @click="handleView(scope)"
            ></el-button
          ></el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getViewerVideo()"
    />
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVendor"
      title="影片廠商管理"
      width="75%"
      @close="closeVendorDialog"
    >
      <div class="filter-container">
        <span class="label">新增供影商</span>
        <el-select
          style="width: 300px"
          v-loading="noVendorlistLoading"
          v-model="addSpaceId"
          clearable
          placeholder="新增供影商"
          default-first-option
        >
          <el-option
            v-for="item in noVendorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-checkbox v-model="defaultStatus" style="margin:0 10px" :disabled="addSpaceId === ''">預設上架</el-checkbox>
        <el-button
          :disabled="addSpaceId === ''"
          v-if="rolePermission.canEdit"
          type="primary"
          @click="handleAddVendor()"
          >新增供影商</el-button
        >
      </div>
      <el-table
        v-loading="viewListLoading"
        v-if="rolePermission.canView"
        :data="viewersCount"
        style="width: 100%; margin-top: 20px"
        border
        header-cell-class-name="tableHeader"
        show-summary
        :summary-method="getSummaries"
      >
        <el-table-column
          align="header-left"
          label="已選供影商"
          min-width="130px"
        >
          <template slot-scope="scope">{{
            scope.row.videoSpaceId | chValue(vendorOptions)
          }}</template>
        </el-table-column>
        <el-table-column
          :resizable="false"
          align="header-left"
          label="已上架影片"
        >
          <template slot-scope="scope">{{ scope.row.isEnableCount }}</template>
        </el-table-column>
        <el-table-column
          :resizable="false"
          align="header-left"
          label="轉檔中或未上傳"
        >
          <template slot-scope="scope">{{ scope.row.processCount }}</template>
        </el-table-column>
        <el-table-column
          :resizable="false"
          align="header-left"
          label="下架影片"
        >
          <template slot-scope="scope">{{ scope.row.isDisableCount }}</template>
        </el-table-column>
        <el-table-column
          :resizable="false"
          align="header-left"
          label="影片總數量"
        >
          <template slot-scope="scope">{{
            scope.row.totalVideoCount
          }}</template>
        </el-table-column>
        <el-table-column
          :resizable="false"
          align="header-left"
          label="新片預設狀態"
        >
          <template slot-scope="scope"
            >{{ scope.row.status == 0 ? "下架" : "上架" }}
            <el-button
              v-if="rolePermission.canEdit && scope.row.status == 0"
              style="margin-left:5px"
              size="small"
              type="success"
              plain
              @click="handleDefaultStatus(scope, 1)"
              >預設上架</el-button
            >
            <el-button
              v-if="rolePermission.canEdit && scope.row.status !== 0"
              style="margin-left:5px"
              size="small"
              type="danger"
              plain
              @click="handleDefaultStatus(scope, 0)"
              >預設下架</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          :resizable="false"
          align="header-left"
          label="操作"
          min-width="180px"
        >
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                v-if="rolePermission.canEdit"
                :disabled="scope.row.isDisableCount == 0"
                size="small"
                type="primary"
                plain
                @click="handAllStatus(scope, 1)"
                >全部上架</el-button
              >
              <el-button
                v-if="rolePermission.canEdit"
                :disabled="
                  scope.row.processCount == 0 && scope.row.isEnableCount == 0
                "
                size="small"
                type="warning"
                plain
                @click="handAllStatus(scope, 0)"
                >全部下架</el-button
              >
              <el-button
                v-if="rolePermission.canEdit"
                size="small"
                type="danger"
                plain
                @click="handleRemoveVendor(scope)"
                >全部移除</el-button
              >
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <div style="text-align: right; margin-top: 10px">
        <el-button
          icon="el-icon-close"
          type="primary"
          @click="dialogVendor = false"
          >關閉</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogEditVisible"
      title="修改推薦及狀態"
    >
      <el-form
        v-if="dialogEditVisible"
        ref="item"
        label-width="125px"
        :model="item"
      >
        <el-form-item label="視頻標題" label-position="right">
          {{ item.title[0].title }}
        </el-form-item>
        <el-form-item label="描述" label-position="right">
          {{ item.title[0].description }}
        </el-form-item>
        <el-form-item label="視頻作者" label-position="right" prop="artist">
          {{ item.artistId | chValue(ownerOptions) }}
        </el-form-item>

        <el-form-item label="視頻番號" label-position="right" prop="code">
          {{ item.code }}
        </el-form-item>

        <el-form-item label="影片來源" label-position="right" prop="space_id">
          {{ item.videoSpaceId | chValue(vendorOptions) }}
        </el-form-item>

        <el-form-item label="視頻分類" label-position="right" prop="sort">
          {{ item.sort | chValue(sortOptions) }}
        </el-form-item>

        <el-form-item label="視頻標籤" label-position="right" prop="tag">
          {{ item.tag ? item.tag.join(";") : "" }}
        </el-form-item>

        <el-form-item label="播放總數" label-position="right" prop="views">
          {{ item.views }}
        </el-form-item>

        <el-form-item label="按贊數" label-position="right" prop="views">
          {{ item.zans }}
        </el-form-item>

        <el-form-item label="熱門推薦" label-position="right" prop="recommend">
          <el-switch
            v-model="item.recommend"
            actice-color="#00A854"
            active-text="是"
            :active-value="1"
            inactive-color="#F04134"
            inactive-text="否"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>

        <el-form-item label="上架狀態" label-position="right" prop="is_enable">
          <el-switch
            v-model="item.status"
            actice-color="#00A854"
            active-text="上架"
            :active-value="1"
            inactive-color="#F04134"
            inactive-text="下架"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <cancelBtn
          :rolePermission="rolePermission"
          @click="dialogEditVisible = false"
        ></cancelBtn>
        <saveBtn :rolePermission="rolePermission" @click="saveData"></saveBtn>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      title="預覽"
      width="800px"
    >
      <el-form
        v-if="dialogVisible"
        ref="item"
        :model="item"
        label-width="120px"
      >
        <el-form-item
          label="影片Id"
          label-position="right"
          v-if="dialogType === 'edit'"
        >
          {{ item.id }}
        </el-form-item>

        <el-form-item label="影片標題" label-position="right">
          {{ item.title.length > 0 ? item.title[0].title : "" }}
        </el-form-item>

        <el-form-item label="圖片" label-position="right">
          <div class="images" v-viewer>
            <el-image
              v-if="item.processStatus != 1"
              style="width: 160px"
              :src="item.PreviewImageUrl"
            >
            </el-image>
            <aes-image
              v-if="item.processStatus == 1"
              :src="item.PreviewImageUrl"
              :imageKey="item.imageKey"
              :imageIV="item.imageIV"
              :imgWidth="160"
              :key="item.id"
            />
          </div>
        </el-form-item>

        <el-form-item label="影片預覽" label-position="right">
          <player
            v-if="dialogVisible"
            :src="item.PreviewVideoUrl"
            :key="item.id"
          ></player>
        </el-form-item>
        <el-form-item label="創建時間">
          {{ item.createDate }}
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button
          icon="el-icon-close"
          type="primary"
          @click="dialogVisible = false"
          >關閉</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { deepClone } from "@/utils";
import {
  GetViewerVideoCount,
  GetVenders,
  GetVendersNoCount,
  PostViewerVideo,
  PutViewerVideo,
  PutAllStatus,
  AddViewrVideo,
  GetTagMapping,
  PutViewerMappingStatus
} from "@/api/video";
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
import selectSort from "./components/select-sort";
import selectTagTitle from "./components/select-tag-title";
import selectOwner from "./components/select-owner";
import player from "./components/player";
import aesImage from "./components/aesImage";
import { GetPreviewPath, ClearVendorList } from "./js/checkPath";
import autoautocompleteVideoTitle from "./components/autoautocomplete-video-title";

const defaultItem = {
  id: undefined,
  title: "",
  recommend: 0,
  topic: "",
  seat: 1,
  createUser: "",
  lastUpdateUser: "",
};

export default {
  data() {
    return {
      checkAll: false,
      tableIsIndeterminate: false,
      checkAlldisabled: true,
      multipleSelectionAll: "",
      isAdmin: false,
      vendorKey: 0,
      showDisableVendor: false,
      spaceId: "",
      addSpaceId: "",
      defaultStatus:true,
      batchAction: "",
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        videoSpaceId: "",
        sort: "",
        tagTitle: "",
        artist: "",
        recommend: "",
        status: "",
        title: "",
        sortKey: "id",
        sortOrder: "descending",
      },
      getRowKeys(row) {
        return row.Id;
      },
      advanced_search: true,
      listLoading: false,
      summary: "",
      viewListLoading: false,
      allViewersCount: [],
      viewersCount: [],
      noVendorlistLoading: false,
      pageViewersCountList: [],
      viewersTotal: 0,
      total: 0,
      item: Object.assign({}, defaultItem),
      itemList: [],
      dialogVendor: false,
      dialogVisible: false,
      dialogEditVisible: false,
      dialogType: "view",
      statusOptions: [
        { value: 1, label: "上架中" },
        { value: 2, label: "轉檔中或未上傳" },
        { value: 0, label: "下架中" },
      ],
      boolOptions: [
        { value: 1, label: "是" },
        { value: 0, label: "否" },
      ],
      languageOptions: [
        { value: "zh-cn", label: "簡體中文" },
        { value: "vi", label: "越南" },
      ],
      actionOptions: [
        { value: "1", label: "批量上架" },
        { value: "2", label: "批量下架" },
        { value: "3", label: "批量推薦" },
        { value: "4", label: "批量取消推薦" },
      ],
      topicOptions: [],
      vendorOptions: [],
      sortOptions: [],
      tagOptions: [],
      ownerOptions: [],
      noVendorOptions: [],
      yesVendorOptions: [],
      src: "",
    };
  },
  components: {
    newBtn,
    editBtn,
    saveBtn,
    cancelBtn,
    deleteBtn,
    pagination,
    selectSort,
    selectVendor,
    selectTagTitle,
    selectOwner,
    player,
    aesImage,
    autoautocompleteVideoTitle,
  },
  watch: {
    spaceId: async function (val) {
      if (val) {
        await this.getViewerVideoCount();
        //this.filterViewerVideoCount();
        this.listQuery.page = 1;
        this.getViewerVideo();
      }
    },
  },
  filters: {
    chValue: function (value, ary) {
      let find = ary.find((e) => e.value == value);
      if (find) return find.label;
      else return value;
    },
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
    } else {
      this.spaceId = this.$store.getters.vendorId;
      this.getViewerVideoCount();
    }
    ClearVendorList();
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
    getSorts(data) {
      this.sortOptions = data;
    },
    getAllTags(data) {
      this.tagOptions = data;
    },
    getOwners(data) {
      this.ownerOptions = data;
    },
    async getViewerVideoCount() {
      this.viewListLoading = true;
      const res = await GetViewerVideoCount(this.spaceId);
      this.allViewersCount = [];
      if (res.data && res.data.length > 0) this.allViewersCount = res.data;
      var disable =
        this.allViewersCount.length == 0
          ? 0
          : this.allViewersCount
              .map((el) => el["isDisableCount"])
              .reduce((a, b) => a + b);
      var enable =
        this.allViewersCount.length == 0
          ? 0
          : this.allViewersCount
              .map((el) => el["isEnableCount"])
              .reduce((a, b) => a + b);
      var process =
        this.allViewersCount.length == 0
          ? 0
          : this.allViewersCount
              .map((el) => el["processCount"])
              .reduce((a, b) => a + b);
      this.summary = `上架: ${enable} / 轉檔中或未上傳:${process} / 下架:${disable}`;
      this.viewListLoading = false;
      this.filterViewerVideoCount();
    },
    async filterViewerVideoCount() {
      this.viewersCount = [];
      this.noVendorOptions = [];
      this.yesVendorOptions = [];
      this.viewListLoading = true;
      if (this.allViewersCount) {
        this.allViewersCount.forEach((i) => {
          let vendor = this.vendorOptions.find(
            (v) => v.value == i.videoSpaceId
          );
          //未選清單
          if (
            i.isDisableCount == 0 &&
            i.isEnableCount == 0 &&
            i.processCount == 0
          ) {
            this.noVendorOptions.push({
              value: i.videoSpaceId,
              label: `${vendor.label} (${i.totalVideoCount}片)`,
              usedOut: i.usedOut,
            });
          } //已選列表
          else {
            this.viewersCount.push(i);
            this.yesVendorOptions.push({
              value: i.videoSpaceId,
              label: vendor.label,
              usedOut: i.usedOut,
            });
          }
        });
      }
      var a = this.yesVendorOptions;
      var find = this.yesVendorOptions.find(
        (o) => o.value == this.listQuery.videoSpaceId
      );
      if (!find) this.listQuery.videoSpaceId = "";

      setTimeout(() => {
        this.viewListLoading = false;
      }, 0.3 * 1000);
    },
    getSummaries(param) {
      //param 是固定的对象，里面包含 columns与 data参数的对象
      const { columns, data } = param;
      //console.log(param);
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合計";
          return;
        }
        let values = [];
        if (index == 1) values = data.map((item) => Number(item.isEnableCount));
        if (index == 2) values = data.map((item) => Number(item.processCount));
        if (index == 3)
          values = data.map((item) => Number(item.isDisableCount));
        if (index == 4)
          values = data.map((item) => Number(item.totalVideoCount));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = "N/A";
        }
      });
      return sums;
    },
    handleVendors() {
      this.addSpaceId = "";
      //this.filterViewerVideoCount();
    },
    async handleAddVendor() {
      if (!this.addSpaceId) return false;
      var vendor = this.noVendorOptions.find((i) => i.value == this.addSpaceId);
      this.$confirm(`確定加入 ${vendor.label} 的影片 ?`, "警告", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const addVendor = {
            type: 1,
            spaceId: this.spaceId,
            videoSpaceId: this.addSpaceId,
            usedOut: vendor.usedOut,
            status:this.defaultStatus?1:0,
            createUser: this.$store.getters.account,
            lastupdateUser: this.$store.getters.account,
          };

          await AddViewrVideo(addVendor);
          this.$message({
            type: "success",
            message: "加入成功！",
          });
          this.addSpaceId = "";
          this.viewListLoading = true;
          setTimeout(() => {
            this.getViewerVideoCount();
            this.getViewerVideo();
          }, 2 * 1000);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async handleView(scope) {
      this.dialogType = "view";
      this.item = deepClone(scope.row);
      this.item.artistId == -1
        ? (this.item.artistId = undefined)
        : this.item.artistId;
      this.dialogVisible = true;
    },
    async handleEdit(scope) {
      this.item = deepClone(scope.row);
      this.item.artistId == -1
        ? (this.item.artistId = undefined)
        : this.item.artistId;
      const res = await GetTagMapping(this.item.videoId);
      if (res.data) this.item.tag = res.data;
      this.dialogEditVisible = true;
    },
    handleRemoveVendor(scope) {
      var item = deepClone(scope.row);
      var vendor = this.vendorOptions.find((i) => i.value == item.videoSpaceId);
      this.$confirm(`確定要將供影商「${vendor.label}」所有影片移除?`, "警告", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const removeVendor = {
            type: 3,
            spaceId: item.spaceId,
            videoSpaceId: item.videoSpaceId,
            usedOut: item.usedOut,
            createUser: this.$store.getters.account,
            lastupdateUser: this.$store.getters.account,
          };

          const res = await AddViewrVideo(removeVendor);
          this.$message({
            type: "success",
            message: "移除成功！",
          });
          this.addSpaceId = "";
          this.viewListLoading = true;
          setTimeout(() => {
            this.getViewerVideoCount();
            this.getViewerVideo();
          }, 2 * 1000);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    handAllStatus(scope, status) {
      var item = deepClone(scope.row);
      var updateData = {
        spaceId: this.spaceId,
        videoSpaceId: item.videoSpaceId,
        status: status,
        lastupdateUser: this.$store.getters.account,
      };
      var vendor = this.vendorOptions.find((i) => i.value == item.videoSpaceId);
      this.$confirm(
        `確定要將${vendor.label}所有影片，全部變更為「${
          status == 0 ? "下架" : "上架"
        }」 ?`,
        "警告",
        {
          confirmButtonText: "確定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          await PutAllStatus(updateData);
          this.$message({
            type: "success",
            message: "執行成功！",
          });

          //this.filterViewerVideoCount();
          this.viewListLoading = true;
          setTimeout(() => {
            this.getViewerVideoCount();
            this.getViewerVideo();
          }, 2 * 1000);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    cancelSearch() {
      this.listQuery.id = undefined;
      this.listQuery.videoSpaceId = "";
      this.listQuery.sort = "";
      this.listQuery.tagTitle = "";
      this.listQuery.artist = "";
      this.listQuery.vipOnly = "";
      this.listQuery.recommend = "";
      this.listQuery.status = "";
      this.listQuery.title = "";
    },
    async getViewerVideo() {
      if (this.spaceId == "") {
        this.$message({
          type: "error",
          message: "請選擇操作廳主",
        });
        return false;
      }
      this.listLoading = true;
      this.checkAll = false; //全選清除
      this.tableIsIndeterminate = false; //半選清除
      this.multipleSelectionAll = ""; //清除已選
      if (this.listQuery.title)
        this.listQuery.title = this.listQuery.title.trim();
      var where = {
        id: this.listQuery.id === "" ? -1 : this.listQuery.id,
        spaceId: this.spaceId,
        videosSpaceId:
          this.listQuery.videoSpaceId == "" ? -1 : this.listQuery.videoSpaceId,
        sort: this.listQuery.sort === "" ? -1 : this.listQuery.sort,
        tagTitle: this.listQuery.tagTitle,
        artistId: this.listQuery.artist === "" ? -1 : this.listQuery.artist,
        recommend:
          this.listQuery.recommend === "" ? -1 : this.listQuery.recommend,
        title: this.listQuery.title,
        status:
          this.listQuery.status === "" ? -1 : this.listQuery.status > 0 ? 1 : 0,
        processStatus:
          this.listQuery.status === "" || this.listQuery.status === 0
            ? -1
            : this.listQuery.status == 1
            ? 1
            : 0 /*待議0,2*/,
        ViewerLimit: -1,
      };
      var page = {
        number: this.listQuery.page,
        limit: this.listQuery.limit,
      };
      var order = {
        key:
          this.listQuery.sortKey == "status"
            ? "status,processStatus"
            : this.listQuery.sortKey,
        sort: this.listQuery.sortOrder == "ascending" ? "asc" : "desc",
      };

      var query = { where, page, order };
      const res = await PostViewerVideo(query);
      var itemList = res.data;
      for (let item of itemList) {
        item.checked = false; //清除勾選
        var obj = await GetPreviewPath(item, false);
        item.PreviewImageUrl = obj.PreviewImageUrl;
        item.PreviewVideoUrl = obj.PreviewVideoUrl;
      }
      this.itemList = itemList;
      this.checkAlldisabled = this.itemList.length == 0;
      this.total = res.total ? res.total : 0;
      setTimeout(() => {
        this.listLoading = false;
      }, 0.3 * 1000);
    },
    sortChange(data) {
      const { prop, order } = data;
      this.listQuery.sortKey = prop;
      this.listQuery.sortOrder = order;
      if (this.spaceId != "") this.getViewerVideo();
    },
    async saveData() {
      const updateData = [
        {
          id: this.item.id,
          recommend: this.item.recommend,
          status: this.item.status,
          lastupdateUser: this.$store.getters.account,
        },
      ];
      //寫入
      await PutViewerVideo(updateData);
      this.getViewerVideo();
      this.getViewerVideoCount();
      this.dialogVisible = false;
      this.$notify({
        title: "寫入成功",
        dangerouslyUseHTMLString: true,
        message: `
            <div>視頻標題: ${this.item.title[0].title}</div>
          `,
        type: "success",
      });
      this.dialogEditVisible = false;
    },
    handleChange(val) {
      if (val) {
        this.itemList.forEach((item) => {
          item.checked = true;
        });
        this.tableIsIndeterminate = false;
      } else {
        this.itemList.forEach((item) => {
          item.checked = false;
        });
        this.tableIsIndeterminate = false;
      }
      this.handleSelectionChange();
    },
    handleSelectionChange(val) {
      var selectId = [];
      this.itemList.forEach((item) => {
        if (item.checked) {
          selectId.push(item.id);
        }
      });
      // 全選時
      if (selectId.length == this.itemList.length) {
        this.checkAll = true;
      } else if (selectId.length > 0) this.tableIsIndeterminate = true;
      else {
        this.tableIsIndeterminate = false;
      }
      // row->字串
      this.multipleSelectionAll = selectId.join(",");
      //console.log(this.multipleSelectionAll);
    },

    handleBatchAction() {
      if (this.batchAction == "") return false;
      if (
        this.multipleSelectionAll == undefined ||
        this.multipleSelectionAll == ""
      ) {
        this.$message({
          type: "error",
          message: "請勾選要執行的影片",
        });
        return false;
      }
      var action = this.batchAction;
      var actionText = "";
      var status = -1;
      var recommend = -1;
      if (action == 1) {
        status = 1;
        actionText = "批量上架";
      } else if (action == 2) {
        status = 0;
        actionText = "批量下架";
      } else if (action == 3) {
        recommend = 1;
        actionText = "批量推薦";
      } else if (action == 4) {
        recommend = 0;
        actionText = "批量取消推薦";
      }

      var ids = [];
      var batchUpdate = [];
      ids = this.multipleSelectionAll.split(",");

      ids.forEach((i) => {
        var obj = {};
        obj.id = parseInt(i, 10);
        obj.lastupdateUser = this.$store.getters.account;
        obj.status = status;
        obj.recommend = recommend;
        batchUpdate.push(obj);
      });
      this.$confirm(
        `已勾選${ids.length}部影片，確定執行 ${actionText} ?`,
        "警告",
        {
          confirmButtonText: "確定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          await PutViewerVideo(batchUpdate);
          this.$message({
            type: "success",
            message: "執行成功！",
          });
          this.getViewerVideo();
          this.getViewerVideoCount();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    handleDefaultStatus(scope,status) {
      var item = deepClone(scope.row);
      var statsuText="上架"
      if(status==0)
      statsuText="下架"

      this.$confirm(
      `確定將新片預設狀態改為「${statsuText}」?`,
        "警告",
        {
          confirmButtonText: "確定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          const updateStatus = {
            spaceId: this.spaceId,
            videoSpaceId: item.videoSpaceId,
            status: status,
            lastupdateUser: this.$store.getters.account,
          };
          console.log("1")
          await PutViewerMappingStatus(updateStatus);
          this.$message({
            type: "success",
            message: "執行成功！",
          });
          this.getViewerVideoCount();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    closeVendorDialog() {
      //this.getViewerVideo();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 5px;
  &:last-child {
    margin-bottom: 0px;
  }
}
</style>
