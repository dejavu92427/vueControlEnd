<template>
  <div class="app-container">
    <div class="filter-container">
      <span
        v-show="
          this.$store.getters.vendorId == 0 ||
          (rolePermission.canDef1 && optionCount > 1)
        "
        ><span class="label">供影商</span
        ><selectVendor
          :spaceId.sync="searchVender"
          :optionCount.sync="optionCount"
          :clear="false"
          :showDisable="showDisableVendor"
          :key="vendorKey"
          :addAll="this.$store.getters.vendorId == 0"
          :roleType="1"
          :self="this.$store.getters.vendorId != 0 ? searchVender : 0"
          :addUnClass="
            rolePermission.canDef1 || this.$store.getters.vendorId == 0
          "
          @getVendors="getVendors"
        ></selectVendor
        ><el-checkbox
          v-if="this.$store.getters.vendorId == 0"
          style="margin: 0px 10px"
          v-model="showDisableVendor"
          @change="resetVendor()"
          >顯示停用供影商</el-checkbox
        >
      </span>

      <el-button
        plain
        type="success"
        icon="el-icon-s-operation"
        @click="
          () => {
            this.filterVisible = !this.filterVisible;
          }
        "
      >
        篩選
      </el-button>

      <!-- 新增的按鈕  -->

      <el-button
        :disabled="!canPublish"
        type="warning"
        icon="el-icon-s-promotion"
        width="300"
        @click="handlePublish"
      >
        {{ canPublish ? "發布" : "發布執行中" }}
      </el-button>
      <newBtn :rolePermission="rolePermission" @click="handleAddVideo"></newBtn>
      <el-dropdown :hide-on-click="true" @command="selectAction">
        <el-button style="margin-left: 10px" type="danger">
          批量操作<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" style="width: 120px">
          <el-dropdown-item :command="1">新增標籤</el-dropdown-item>
          <el-dropdown-item :command="2">取消標籤</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-select
        v-if="showTags"
        v-model="batchTag"
        placeholder="視頻標籤"
        default-first-option
        filterable
        clearable
        v-loading="tagLoading"
        @change="handleBatchTags"
      >
        <el-option
          v-for="item in tags"
          :key="item.value"
          :label="item.label"
          :value="{ value: item.value, label: item.label }"
        ></el-option>
      </el-select>
      <div
        v-show="filterVisible"
        style="padding: 10px; margin-top: 10px; border: 1px #ebeef5 solid"
      >
        <el-row :gutter="10" align="middle" type="flex">
          <el-col :span="2" class="col_label">視頻標題 </el-col>
          <el-col :span="5">
            <autoautocompleteVideoTitle
              :title.sync="searchTitle"
              domsize="mini"
            ></autoautocompleteVideoTitle>

            <!-- <el-input
              v-model="searchTitle"
              size="mini"
              placeholder="視頻標題"
              clearable
              maxlength="100"
            /> -->
          </el-col>
          <el-col :span="2" class="col_label">視頻ID </el-col>
          <el-col :span="4">
            <el-input-number
              class="left"
              size="mini"
              v-model="searchId"
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

          <el-col :span="2" class="col_label">視頻分類 </el-col>
          <el-col :span="3">
            <selectSort
              :sortId.sync="searchSort"
              :spaceId="searchVender"
              :key="searchVender"
              :clear="true"
              @getSorts="getSorts"
              domsize="mini"
            ></selectSort>
          </el-col>

          <el-col :span="2" class="col_label">視頻標籤 </el-col>
          <el-col :span="4">
            <el-select
              v-model="searchTag"
              size="mini"
              placeholder="視頻標籤"
              default-first-option
              filterable
              clearable
              v-loading="tagLoading"
            >
              <el-option
                v-for="item in tags"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="10" align="middle" type="flex">
          <el-col :span="2" class="col_label">影片上傳 </el-col>
          <el-col :span="5">
            <el-select
              v-model="searchVUpload"
              size="mini"
              placeholder="影片上傳"
              default-first-option
              clearable
            >
              <el-option
                v-for="item in upload"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>

          <el-col :span="2" class="col_label">圖片上傳 </el-col>
          <el-col :span="4">
            <el-select
              v-model="searchIUpload"
              size="mini"
              placeholder="圖片上傳"
              default-first-option
              clearable
            >
              <el-option
                v-for="item in upload"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="2" class="col_label">轉檔狀態 </el-col>
          <el-col :span="3" align="left">
            <el-select
              v-model="searchProcessStatus"
              clearable
              placeholder="轉檔狀態"
              default-first-option
              size="mini"
            >
              <el-option
                v-for="item in processStatusOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6" align="left">
            <el-button
              class="filter-item"
              type="warning"
              size="small"
              icon="el-icon-refresh-left"
              @click="filterReset"
              >重置</el-button
            >

            <el-button
              class="filter-item"
              type="primary"
              size="small"
              icon="el-icon-search"
              @click="filtVideo"
              >搜尋</el-button
            >
            <el-button
              class="filter-item"
              type="success"
              size="small"
              icon="el-icon-refresh"
              @click="getAllVideos"
              >刷新</el-button
            >
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 資料 -->
    <el-table
      v-if="rolePermission.canView"
      :data="videoPageList"
      style="width: 100%; margin-top: 20px"
      border
      header-cell-class-name="tableHeader"
      :default-sort="{ prop: 'id', order: 'descending' }"
      @sort-change="sortChange"
      v-loading="listLoading"
      :row-key="getRowKeys"
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
        width="90"
        prop="id"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
      >
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="視頻標題"
        min-width="200"
      >
        <template slot-scope="scope">{{
          scope.row.title.length > 1
            ? scope.row.title.find((o) => o.language == "zh-cn").title
            : scope.row.title[0].title
        }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="視頻封面"
        width="140"
      >
        <template slot-scope="scope">
          <el-image
            v-if="
              scope.row.processStatus != 1 && scope.row.imageUpLoad != false
            "
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

      <el-table-column
        :resizable="false"
        align="header-left"
        label="供影商"
        width="150"
      >
        <template slot-scope="scope">{{
          scope.row.spaceId | chValue(venders)
        }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="視頻分類">
        <template slot-scope="scope">{{
          scope.row.sort | chValue(allSorts)
        }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="播放量"
        prop="views"
        width="90"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
      >
        <template slot-scope="scope">{{ scope.row.views }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="按讚數"
        prop="views"
        width="90"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
      >
        <template slot-scope="scope">{{ scope.row.zans }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="圖片上傳"
        width="100"
      >
        <!--template slot-scope="scope">{{ scope.row.imageUpLoad | chValue(trueOrFalse_ch) }}</template-->
        <template slot-scope="scope">
          <span :class="[scope.row.imageUpLoad != false ? 'yesClass' : '']">
            {{ scope.row.imageUpLoad | chValue(upload) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :resizable="false"
        align="header-left"
        label="影片上傳"
        width="100"
      >
        <!--template slot-scope="scope">{{ scope.row.videoUpLoad | chValue(trueOrFalse_ch) }}</template-->
        <template slot-scope="scope">
          <span :class="[scope.row.videoUpLoad != false ? 'yesClass' : '']">
            {{ scope.row.videoUpLoad | chValue(upload) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :resizable="false"
        align="header-left"
        label="轉檔狀態"
        prop="processStatus"
        width="100"
      >
        <template slot-scope="scope">
          <span :class="[scope.row.processStatus == 1 ? 'yesClass' : '']">
            {{
              scope.row.processStatus == 1
                ? "完成"
                : scope.row.processStatus == 0 &&
                  scope.row.videoUpLoad == 1 &&
                  scope.row.imageUpLoad == 1
                ? "轉檔中"
                : scope.row.processStatus == -2
                ? "轉檔失敗"
                : ""
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :resizable="false"
        align="header-left"
        label="更新時間"
        prop="lastUpdateTime"
        width="155"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
      >
        <template slot-scope="scope">{{ scope.row.lastUpdateTime }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="操作"
        width="200px"
      >
        <template slot-scope="scope">
          <el-button-group>
            <editBtn
              :rolePermission="rolePermission"
              @click="handleEdit(scope)"
            ></editBtn>
            <el-tooltip
              :enterable="false"
              content="上傳"
              placement="top-start"
              effect="light"
              v-if="rolePermission.canEdit && scope.row.usedOut != 1"
            >
              <el-button
                type="success"
                plain
                size="small"
                icon="el-icon-upload"
                v-if="rolePermission.canEdit && scope.row.usedOut != 1"
                @click="handleUpLoad(scope)"
              >
              </el-button>
            </el-tooltip>
            <el-tooltip
              :enterable="false"
              content="預覽"
              placement="top-start"
              effect="light"
            >
              <el-button
                type="info"
                plain
                size="small"
                icon="el-icon-video-play"
                @click="handlePreview(scope)"
              >
              </el-button>
            </el-tooltip>
            <deleteBtn
              :rolePermission="rolePermission"
              @click="handleDelete(scope)"
            ></deleteBtn>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 頁面選擇 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="size"
      @pagination="getAllVideos()"
    />

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="previewVisible"
      title="預覽"
      width="800px"
    >
      <el-form ref="video" :model="video" label-width="120px">
        <el-form-item label="視頻標題" label-position="right">
          {{
            video.title.length > 1
              ? video.title.find((o) => o.language == "zh-cn").title
              : video.title[0].title
          }}
        </el-form-item>

        <el-form-item label="視頻封面" label-position="right">
          <div class="images" v-viewer>
            <el-image
              v-if="video.imageUpLoad == 1 && video.processStatus != 1"
              style="width: 160px; height: auto"
              :src="video.PreviewImageUrl"
            >
            </el-image>
            <aes-image
              v-if="video.processStatus == 1"
              :src="video.PreviewImageUrl"
              :imageKey="video.imageKey"
              :imageIV="video.imageIV"
              :imgWidth="160"
              :key="video.id"
            />
          </div>
        </el-form-item>

        <el-form-item label="視頻預覽" label-position="right">
          <player v-if="previewVisible" :src="video.PreviewVideoUrl"></player>
        </el-form-item>

        <el-form-item label="創建時間">
          {{ video.createDate }}
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-select
          v-if="rolePermission.canDef2"
          v-model="action"
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
          v-if="rolePermission.canDef2"
          type="primary"
          icon="el-icon-check"
          plain
          :disabled="!video.videoUpLoad || action == ''"
          v-loading="actionLoading"
          @click="handleAction()"
          >執行</el-button
        >
        <!--
        <el-button
          v-if="rolePermission.canDef2 && video.videoUpLoad"
          icon="el-icon-brush"
          type="warning"
          plain
          @click="refresh('img')"
          >刷新圖片</el-button
        >
        <el-button
          v-if="rolePermission.canDef2 && video.videoUpLoad"
          icon="el-icon-brush"
          type="warning"
          plain
          @click="refresh('video')"
          >刷新影片</el-button
        >
        <el-button
          v-if="rolePermission.canDef2 && video.imageUpLoad"
          icon="el-icon-refresh-right"
          type="success"
          plain
          @click="reTransVideos('img')"
          >重轉圖片</el-button
        >
        <el-button
          v-if="rolePermission.canDef2 && video.videoUpLoad"
          icon="el-icon-refresh-right"
          type="success"
          plain
          @click="reTransVideos('video')"
          >重轉影片</el-button
        >
        -->
        <el-button
          icon="el-icon-close"
          type="primary"
          @click="previewVisible = false"
          >關閉</el-button
        >
      </div>
    </el-dialog>

    <!--上傳頁面-->
    <el-dialog
      :close-on-click-modal="false"
      :before-close="closeCheck"
      :visible.sync="uploadVisible"
      destroy-on-close
      title="上傳圖片/影片"
      width="75%"
    >
      <el-form label-width="125px" :model="video">
        <el-form-item label="影片ID" label-position="right">
          {{ video.id }}
        </el-form-item>

        <el-form-item label="封面" label-position="right">
          <file-upload
            type="image"
            :fileType="parseInt('2')"
            :videoId="video.id"
            :videoSpaceId="video.spaceId"
            :key="video.id"
            v-on:childByValue="childByValue"
            v-on:changeStatus="imgChangeStatus"
          ></file-upload>
        </el-form-item>

        <el-form-item label="影片" label-position="right">
          <file-upload
            :key="video.id"
            type="video"
            :fileType="parseInt('1')"
            :videoId="video.id"
            :videoSpaceId="video.spaceId"
            v-on:childByValue="childByValue"
            v-on:changeStatus="viChangeStatus"
          ></file-upload>
        </el-form-item>
      </el-form>

      <div style="text-align: right; margin-top: 10px">
        <el-button icon="el-icon-close" type="primary" @click="closeCheck"
          >關閉</el-button
        >
      </div>
    </el-dialog>

    <!-- 新增與修改功能頁面 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '修改影片' : '新增影片'"
    >
      <el-form
        v-if="dialogVisible"
        ref="video"
        label-width="125px"
        :model="video"
        :rules="rule"
      >
        <el-form-item label="供影商" label-position="right" prop="spaceId">
          <selectVendor
            :spaceId.sync="video.spaceId"
            :roleType="1"
            :disable="noEdit"
            :key="vendorKey"
            :self="
              this.$store.getters.vendorId != 0
                ? this.$store.getters.vendorId
                : 0
            "
            :addUnClass="rolePermission.canDef1 && !noEdit"
          ></selectVendor>
        </el-form-item>
        <el-form-item label="視頻語系" label-position="right" prop="languages">
          <!-- 語系改為單選
          <el-checkbox-group v-model="video.languages" :min="1">
            <el-checkbox
              v-for="lan in allLanguages"
              :label="lan.value"
              :key="lan.value"
              >{{ lan.label }}</el-checkbox
            >
          </el-checkbox-group>
          -->
          <el-radio-group v-model="video.languages" :min="1">
            <el-radio
              v-for="lan in allLanguages"
              :label="lan.value"
              :key="lan.value"
              >{{ lan.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="標題-簡體中文"
          label-position="right"
          prop="cnTitle"
          v-if="video.languages.indexOf('zh-cn') != -1"
        >
          <autoautocompleteVideoTitle
            :title.sync="video.cnTitle"
            domsize="medium"
          ></autoautocompleteVideoTitle>
          <!--
          <el-input
            v-model="video.cnTitle"
            placeholder="輸入簡中視頻標題"
            maxlength="100"
          />
          -->
        </el-form-item>

        <el-form-item
          label="描述-簡體中文"
          label-position="right"
          v-if="video.languages.indexOf('zh-cn') != -1"
        >
          <el-input
            v-model="video.cnDesc"
            placeholder="輸入簡中視頻描述"
            type="textarea"
            maxlength="200"
          />
        </el-form-item>

        <el-form-item
          label="標題-越南語"
          label-position="right"
          prop="viTitle"
          v-show="video.languages.indexOf('vi') != -1"
        >
          <autoautocompleteVideoTitle
            :title.sync="video.viTitle"
            domsize="medium"
          ></autoautocompleteVideoTitle>
          <!-- <el-input
            v-model="video.viTitle"
            placeholder="輸入越南語視頻標題"
            maxlength="100"
          /> -->
        </el-form-item>

        <el-form-item
          label="描述-越南語"
          label-position="right"
          v-show="video.languages.indexOf('vi') != -1"
        >
          <el-input
            v-model="video.viDesc"
            placeholder="輸入越南語視頻描述"
            type="textarea"
            maxlength="200"
          />
        </el-form-item>

        <el-form-item
          label="視頻原檔路徑"
          label-position="right"
          prop="videoPath"
          v-if="
            video.usedOut == 1 ||
            this.usedOutVenders.indexOf(video.spaceId) != -1
          "
        >
          <el-input
            v-model="video.videoPath"
            placeholder="輸入視頻原檔路徑"
            maxlength="255"
          />
        </el-form-item>

        <el-form-item
          label="封面原檔路徑"
          label-position="right"
          prop="imagePath"
          v-if="
            video.usedOut == 1 ||
            this.usedOutVenders.indexOf(video.spaceId) != -1
          "
        >
          <el-input
            v-model="video.imagePath"
            placeholder="輸入封面原檔路徑"
            maxlength="255"
          />
        </el-form-item>

        <el-form-item label="視頻番號" label-position="right" prop="code">
          <el-input
            v-model="video.code"
            placeholder="輸入視頻番號"
            maxlength="25"
          />
        </el-form-item>

        <el-form-item label="視頻分類" label-position="right" prop="sort">
          <el-select
            v-loading="listLoading"
            v-model="video.sort"
            :clearable="true"
            :placeholder="
              video.spaceId && video.spaceId > 0 ? '視頻分類' : '請先選擇供影商'
            "
            filterable
            default-first-option
          >
            <el-option
              v-for="item in filterSorts"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!--
          <selectSort
            :sortId.sync="video.sort"
            :spaceId="video.spaceId"
            :clear="false"
            :key="video.spaceId"
          ></selectSort>
          -->
        </el-form-item>

        <el-form-item label="視頻作者" label-position="right" prop="artistId">
          <el-select
            clearable
            v-model="video.artistId"
            placeholder="選擇視頻作者"
            default-first-option
            filterable
          >
            <el-option
              v-for="item in artists"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="視頻標籤" label-position="right" prop="tag">
          <el-select
            v-model="video.tag"
            multiple
            default-first-option
            filterable
            placeholder="選擇視頻標籤"
            style="width: 450px"
          >
            <el-option
              v-for="item in filterTags"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="播放量" label-position="right" prop="views">
          <el-input-number
            v-model="video.views"
            :min="0"
            :max="2147483647"
            controls-position="right"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="按讚數" label-position="right" prop="zans">
          <el-input-number
            v-model="video.zans"
            :min="0"
            :max="2147483647"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          v-if="dialogType == 'edit' && video.viewerData.length > 0"
          label="熱門推薦"
          label-position="right"
          prop="viewerData"
        >
          <el-checkbox-group v-model="video.checkedRecommend">
            <el-checkbox
              v-for="viewer in video.viewerData"
              :label="viewer.id"
              :key="viewer.id"
              >{{ viewer.spaceId | chValue(venders) }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="創建時間"
          label-position="right"
          prop="createDate"
          v-if="this.dialogType != 'new'"
        >
          {{ video.createDate }}
        </el-form-item>
      </el-form>

      <div style="text-align: right">
        <cancelBtn
          :rolePermission="rolePermission"
          @click="dialogVisible = false"
        ></cancelBtn>
        <saveBtn :rolePermission="rolePermission" @click="saveVideo"></saveBtn>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import path from "path";
import { deepClone } from "@/utils";
//import { getRole, getRoutes, updateRoute } from "@/api/role";
import {
  GetVideoOwner,
  GetSorts,
  GetVenders,
  GetVedioAllTags,
  PutVideos,
  GetVideosInCondition,
  GetTagMapping,
  GetTitleMapping,
  GetVendersNoCount,
  PostEnqueue,
  PutProcessStatus,
  GetViewerVideoInfo,
  PutViewerVideo,
  GetCdns,
  GetCos,
  PutClearPathCache,
  GetSystembyName,
  PostUpdateRedis,
  PutNewTag,
  PutDeleteTag,
} from "@/api/video";
//import elementIcons from "./element-icons";

//permission control button start
import getRolePermission from "../../utils/role-permission";
import newBtn from "@/components/PermissionControl/newButton";
import editBtn from "@/components/PermissionControl/editButton";
import saveBtn from "@/components/PermissionControl/saveButton";
import cancelBtn from "@/components/PermissionControl/cancelButton";
import deleteBtn from "@/components/PermissionControl/deleteButton";
import player from "./components/player";
import aesImage from "./components/aesImage";
//permission control button en
import pagination from "@/components/Pagination";
import fileUpload from "./components/fileUpload";
import selectVendor from "./components/select-vendor";
import selectSort from "./components/select-sort";
import autoautocompleteVideoTitle from "./components/autoautocomplete-video-title";
import { GetPreviewPath, ClearVendorList } from "./js/checkPath";

const defaultVideo = {
  id: 0,
  title: [
    { language: "zh-cn", title: "", desc: "" },
    { language: "vi", title: "", desc: "" },
  ],
  sort: undefined,
  code: "",
  space_id: undefined,
  desc: "",
  sort: undefined,
  videoTag: [],
  views: 0,
  zans: 0,
  lastUpdateUser: "",
  videoUpLoad: false,
  imageUpLoad: false,
  createUser: "",
  lastupdateUser: "",
  value: false,
  cnTitle: "",
  viTitle: "",
  //languages: [],
  languages: "",
  usedOut: 0,
  viewerData: [],
  checkedRecommend: [],
  vendors: [],
  cdns: [],
  cos: [],
};
var _timer;
export default {
  data() {
    const cehckCnTitle = (rule, value, callback) => {
      if (this.video.languages.indexOf("zh-cn") != -1)
        if (value.trim().length == 0) {
          callback(new Error("請輸入影片標題"));
        }
      callback();
    };
    const cehckViTitle = (rule, value, callback) => {
      if (this.video.languages.indexOf("vi") != -1)
        if (value.trim().length == 0) {
          callback(new Error("請輸入影片標題"));
        }
      callback();
    };
    return {
      getRowKeys(row) {
        return row.Id;
      },
      showTags: false,
      batchAction: "",
      batchTag: "",
      checkAll: false,
      tableIsIndeterminate: false,
      checkAlldisabled: true,
      multipleSelectionAll: "",
      refreshTime: 300,
      timer: 0,
      t: 0,
      timerOn: true,
      tagLoading: false,
      viewerVendors: [],
      vendorKey: 0,
      showDisableVendor: false,
      optionCount: 0,
      usedOutVenders: [],
      allSorts: [],
      filterSorts: [],
      artists: [],
      venders: [],
      tags: [],
      filterTags: [],
      video: Object.assign({}, defaultVideo),
      videoPageList: [],
      total: 0,
      searchId: undefined,
      searchTitle: "",
      searchSort: undefined,
      searchVIP: undefined,
      searchRecommand: undefined,
      searchEnable: undefined,
      searchVUpload: undefined,
      searchIUpload: undefined,
      searchLanguage: undefined,
      searchProcessStatus: undefined,
      searchTag: "",
      searchVender: this.$store.getters.vendorId,
      sortKey: "id",
      sortOrder: "descending",
      size: 20,
      currentPage: 1,
      previewVisible: false,
      dialogVisible: false,
      filterVisible: true,
      uploadVisible: false,
      dataReload: false,
      changeSequenceVisible: false,
      dialogType: "new",
      listLoading: false,
      videoPath: undefined,
      imagePath: undefined,
      //fakeSpaceId: 0,
      noEdit: true,
      imgStatus: "",
      vidStatus: "",
      actionLoading: false,
      action: "",
      canPublish: false,
      actionOptions: [
        { value: "1", label: "重轉圖片" },
        { value: "2", label: "重轉影片" },
        { value: "3", label: "刷新圖片" },
        { value: "4", label: "刷新影片" },
      ],
      rule: {
        //欄位規則
        languages: [
          { required: true, message: "視頻語系為必填", trigger: "change" },
        ],
        // tag: [{ required: true, message: "視頻標籤為必填", trigger: "blur" }],
        sort: [{ required: true, message: "視頻分類為必填", trigger: "blur" }],
        spaceId: [
          { required: true, message: "供影商為必填", trigger: "change" },
        ],
        // artistId: [
        //   { required: true, message: "作者為必填", trigger: "change" },
        // ],
        cnTitle: [{ required: true, trigger: "blur", validator: cehckCnTitle }],
        viTitle: [{ required: true, trigger: "blur", validator: cehckViTitle }],
      },
      trueOrFalse_ch: [
        { value: false, label: "否" },
        { value: true, label: "是" },
      ],
      upload: [
        { value: 0, label: "未上傳" },
        { value: 1, label: "已上傳" },
      ],
      allLanguages: [
        { value: "zh-cn", label: "簡體中文" },
        { value: "vi", label: "越南語" },
      ],
      processStatusOption: [
        { value: 1, label: "完成" },
        { value: 0, label: "轉檔中" },
        { value: -2, label: "轉檔失敗" },
      ],
    };
  },
  components: {
    newBtn,
    editBtn,
    saveBtn,
    cancelBtn,
    deleteBtn,
    aesImage,
    player,
    pagination,
    fileUpload,
    selectVendor,
    selectSort,
    autoautocompleteVideoTitle,
  },
  watch: {
    searchVender: function (val) {
      if (val != undefined && val !== "") {
        this.searchSort = undefined;
        this.filtVideo();
        this.checkPublishStatus();
        this.setTags(val);
        // this.setSorts();
      } else {
        this.searchVender = undefined;
        this.videoPageList = [];
        this.total = 0;
        this.currentPage = 1;
      }
    },
    uploadVisible: function () {
      this.imgStatus = "";
      this.vidStatus = "";
      if (!this.uploadVisible && this.dataReload) {
        this.getAllVideos();
        this.dataReload = false;
      }
    },
    "video.spaceId": async function (val) {
      this.filterSorts = this.allSorts.filter((i) => i.spaceId == val);
      var find = this.filterSorts.find((e) => e.value == this.video.sort);
      if (!find) this.video.sort = "";
      //影片商有變動才重取Tag
      if (val) {
        this.setFilterTags(val);
      }
    },
  },
  computed: {
    rolePermission() {
      return this.getRolePermissions();
    },
  },

  filters: {
    chValue: function (value, item) {
      let find = item.find((e) => e.value == value);
      if (find) return find.label;
      else return value;
    },
  },

  async created() {
    if (this.$store.getters.vendorId == 0) this.filterVisible = true;
    //this.setSorts();
    this.setArtists();
    if (this.$store.getters.vendorId != 0)
      this.setTags(this.$store.getters.vendorId);
    this.setTimer();
    this.checkPublishStatus();
    // if (this.searchVender == 0) {
    //   this.searchVender = undefined;
    // }

    if (this.$store.getters.vendorId != 0) {
      this.filtVideo();
    }
    ClearVendorList();
    if (this.rolePermission.canDef2) {
      const vendorsRes = await GetVenders();
      this.vendors = vendorsRes.data;
      var cdnRes = await GetCdns();
      this.cdns = cdnRes.data;
      // var cosRes = await GetCos();
      // this.cos = cosRes.data;
    }
  },
  beforeDestroy() {
    this.timer = 0;
    this.timerOn = false;
    clearTimeout(this._timer);
  },
  methods: {
    setTimer() {
      this.timer = parseInt(this.refreshTime);
      this.t = this.timer;
      setTimeout(this.showTime, 1000);
    },
    showTime() {
      if (this.timer > 0) {
        this.timerOn = true;
        this.t -= 1;
        if (this.t == 0) {
          this.checkPublishStatus();
        } else _timer = setTimeout(this.showTime, 1000);
      } else {
        this.timer = 0;
        this.timerOn = false;
      }
    },
    async checkPublishStatus() {
      var res = await GetSystembyName("CornJobStatus");
      if (res && res.data && res.data.length > 0) {
        var data = res.data[0];
        if (data.value && data.value == "0") this.canPublish = true;
        else this.canPublish = false;
        //console.log(`canPublish=${this.canPublish}`)
      }
      this.setTimer();
    },
    // fileterMethod(val) {
    //   //this.searchVal = val
    //   if (val) {
    //     this.filterTags = this.tags;
    //     this.filterTags = this.filterTags.filter((item) => {
    //       if (item.label.includes(val)) {
    //         return item;
    //       }
    //     });
    //   } else {
    //     this.filterTags = this.tags;
    //   }
    // },

    childByValue: function (childValue) {
      this.dataReload = childValue;
    },
    imgChangeStatus: function (childValue) {
      this.imgStatus = childValue;
      //console.log(`imgStatus=${this.imgStatus}`);
    },
    viChangeStatus: function (childValue) {
      this.vidStatus = childValue;
      //console.log(`vidStatus=${this.vidStatus}`);
    },
    resetVendor() {
      this.vendorKey += 1;
    },
    getVendors(data) {
      this.venders = data;
    },
    getSorts(data) {
      this.allSorts = data;
      this.filterSorts = data;
    },
    async getTags(spaceId) {
      const res = await GetVedioAllTags(spaceId);

      var tags = res.data.map(function (o) {
        return { value: o.id, label: o.title };
      });
      return tags;
    },
    async setFilterTags(spaceId) {
      this.filterTags = await this.getTags(spaceId);
    },
    async setTags(spaceId) {
      this.tagLoading = true;
      this.searchTag = "";
      this.tags = await this.getTags(spaceId);
      setTimeout(() => {
        this.tagLoading = false;
      }, 0.3 * 1000);
    },
    /*
    async setVenders() {
      const domain = this.$store.getters.appconfig.domain;
      const res = await GetVenders(domain);

      this.venders = res.data.map(function (o) {
        return { value: o.id, label: o.spaceName };
      });

      const temp = { value: 0, label: "全部" };

      this.venders[this.venders.length] = temp;
    },
*/

    async setArtists() {
      const domain = this.$store.getters.appconfig.domain;
      const res = await GetVideoOwner(domain);

      this.artists = res.data.map(function (o) {
        return { value: o.id, label: o.artist };
      });
    },

    async setSorts() {
      const domain = this.$store.getters.appconfig.domain;
      const res = await GetSorts(domain);
      var sorts = res.data;
      if (this.searchVender > 0 && sorts)
        sorts = sorts.filter((i) => i.spaceId == this.searchVender);
      this.allSorts = sorts.map(function (o) {
        return { value: o.id, label: o.title, space_id: o.spaceId };
      });
    },

    async reTransVideos(file) {
      var msg = file === "img" ? "圖片" : "影片";
      this.$confirm(`確定要重新轉檔${msg}?`, "警告", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.actionLoading = true;
          var evn =
            this.$store.getters.appconfig.domain == "prod" ? "prod" : "qa";
          const updateData = {
            Env: evn,
            ImagePath: file == "img" ? this.video.imagePath : "",
            LogoPath: "",
            VideoID: this.video.id,
            VideoSpaceId: this.video.spaceId,
            VideoPath: file == "video" ? this.video.videoPath : "",
          };
          const updateProcess = {
            LastUpdateUser: this.$store.getters.account,
            ProcessStatus: 0,
            VideoID: this.video.id,
          };
          await PostEnqueue(updateData);
          if (file == "video") await PutProcessStatus(updateProcess);
          // reTransVideos('video
          this.$notify({
            title: "轉檔開始執行",
            dangerouslyUseHTMLString: true,
            type: "success",
          });
          this.actionLoading = false;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },

    async saveVideo() {
      let isVaild = false;
      this.$refs.video.validate((valid) => {
        if (valid) isVaild = true;
      });
      if (!isVaild) return;
      const isEdit = this.dialogType === "edit";
      let type;
      isEdit ? (type = 2) : (type = 1);

      let c;
      if (type == 1) {
        c = this.$store.getters.account;
      } else {
        c = this.video.createUser;
      }

      var title = [];
      var cn = {};
      var vi = {};

      if (this.video.languages.indexOf("zh-cn") != -1) {
        cn.language = "zh-cn";
        cn.title = this.video.cnTitle;
        cn.description = this.video.cnDesc;
        title.push(cn);
      }

      if (this.video.languages.indexOf("vi") != -1) {
        vi.language = "vi";
        vi.title = this.video.viTitle;
        vi.description = this.video.viDesc;
        title.push(vi);
      }

      const updateData = {
        type: type,
        artistId: this.video.artistId ? this.video.artistId : -1,
        code: this.video.code,
        createDate: this.video.createDate,
        createUser: c,
        id: this.video.id,
        imagePath: this.video.imagePath,
        imageUpLoad: this.video.imageUpLoad,
        lastUpdateUser: this.$store.getters.account,
        sort: this.video.sort,
        spaceId: this.video.spaceId,
        tag: this.video.tag,
        title: title,
        videoPath: this.video.videoPath,
        videoUpLoad: this.video.videoUpLoad,
        views: this.video.views,
        zans: this.video.zans,
        usedOut: this.video.usedOut,
        addViewer:
          type == 2 && this.video.oldSpaceId != this.video.spaceId ? 1 : 0,
      };

      await PutVideos(updateData);
      /*修改時可寫入推薦 start */
      if (type == 2) {
        var batchUpdate = [];
        this.video.viewerData.forEach((i) => {
          var obj = {};
          obj.id = i.id;
          obj.lastupdateUser = this.$store.getters.account;
          obj.status = -1;
          obj.recommend =
            this.video.checkedRecommend.indexOf(i.id) >= 0 ? 1 : 0;
          batchUpdate.push(obj);
        });
        if (batchUpdate.length > 0) await PutViewerVideo(batchUpdate);
      }
      this.getAllVideos();
      this.dialogVisible = false;
      this.$notify({
        title: "寫入成功",
        dangerouslyUseHTMLString: true,
        type: "success",
      });
    },
    sortChange(data) {
      const { prop, order } = data;
      this.sortKey = prop;
      this.sortOrder = order;
      if (this.spaceId != "") this.getAllVideos();
    },
    async getAllVideos() {
      if (this.searchVender == undefined) {
        return false;
      }
      this.checkAll = false; //全選清除
      this.tableIsIndeterminate = false; //半選清除
      this.multipleSelectionAll = ""; //清除已選

      this.checkPublishStatus();

      this.listLoading = true;

      var s = this.searchSort;

      if (this.searchSort == "") {
        this.searchSort = undefined;
      }

      if (this.searchSort == undefined) {
        s = -1;
      }

      var v = this.searchVUpload;

      if (this.searchVUpload !== 0 && this.searchVUpload != 1) {
        this.searchVUpload = undefined;
      }

      if (this.searchVUpload == undefined) {
        v = -1;
      }

      var i = this.searchIUpload;

      if (this.searchIUpload !== 0 && this.searchIUpload != 1) {
        this.searchIUpload = undefined;
      }

      if (this.searchIUpload == undefined) {
        i = -1;
      }

      var p = -1;
      if (this.searchProcessStatus === 0) {
        (v = 1), (i = 1), (p = 0);
      } else if (this.searchProcessStatus === 1) {
        p = 1;
      } else if (this.searchProcessStatus === -2) {
        p = -2;
      } else {
        (v = this.searchVUpload == undefined ? -1 : this.searchVUpload),
          (i = this.searchIUpload == undefined ? -1 : this.searchIUpload),
          (p = -1);
      }
      if (this.searchTitle) this.searchTitle = this.searchTitle.trim();
      const condition = {
        where: {
          videosId: this.searchId ? this.searchId : -1,
          title: this.searchTitle,
          spaceId: this.searchVender,
          sort: s,
          videoUpLoad: v,
          imageUpLoad: i,
          tagTitle: this.searchTag,
          processStatus: p,
        },
        page: {
          number: this.currentPage,
          limit: this.size,
        },
        order: {
          key: this.sortKey,
          sort: this.sortOrder == "ascending" ? "asc" : "desc",
        },
      };
      const res = await GetVideosInCondition(condition);
      var videoList = res.data;
      this.total = res.total;
      for (let item of videoList) {
        item.checked = false; //清除勾選
        var obj = await GetPreviewPath(item, true);
        item.PreviewImageUrl = obj.PreviewImageUrl;
        item.PreviewVideoUrl = obj.PreviewVideoUrl;
      }
      this.videoPageList = videoList;
      this.checkAlldisabled = this.videoPageList.length == 0;
      setTimeout(() => {
        this.listLoading = false;
      }, 0.3 * 1000);
    },

    filterReset() {
      this.searchTitle = undefined;
      this.searchSort = undefined;
      this.searchId = undefined;

      /*if (this.$store.getters.vendorId == 0) {
        this.searchVender = 0;
      }*/

      this.searchRecommand = undefined;
      this.searchVUpload = undefined;
      this.searchIUpload = undefined;
      this.searchTag = undefined;
      this.searchProcessStatus = undefined;
    },
    handleChange(val) {
      if (val) {
        this.videoPageList.forEach((item) => {
          item.checked = true;
        });
        this.tableIsIndeterminate = false;
      } else {
        this.videoPageList.forEach((item) => {
          item.checked = false;
        });
        this.tableIsIndeterminate = false;
      }
      this.handleSelectionChange();
    },
    handleSelectionChange(val) {
      var selectId = [];
      this.videoPageList.forEach((item) => {
        if (item.checked) {
          selectId.push(item.id);
        }
      });
      // 全選時
      if (selectId.length == this.videoPageList.length) {
        this.checkAll = true;
      } else if (selectId.length > 0) this.tableIsIndeterminate = true;
      else {
        this.tableIsIndeterminate = false;
      }
      // row->字串
      this.multipleSelectionAll = selectId.join(",");
      console.log(this.multipleSelectionAll);
    },
    async filtVideo() {
      if (this.searchVender == undefined) {
        this.$message({
          type: "error",
          message: "請選擇操作供影商",
        });
        return false;
      }
      //檢查是否有cdn,若無隨便取一個spaceId的CDN
      // var res = await GetVendersNoCount();
      // var find = res.data.find((i) => i.id == this.searchVender);
      // if (!find || find.videoSpaceDomain == 0 || find.imageSpaceDomain == 0) {
      //   find = res.data.find(
      //     (i) =>
      //       i.usedOut == 0 && i.videoSpaceDomain != 0 && i.imageSpaceDomain != 0
      //   );
      //   if (find) this.fakeSpaceId = find.id;
      // }
      this.currentPage = 1;
      this.getAllVideos();
    },

    getRolePermissions() {
      //獲取權限
      return getRolePermission(this.$route.name);
    },

    handleAddVideo() {
      //新增資料
      var video = Object.assign({}, defaultVideo);
      if (this.$store.getters.vendorId !== 0) {
        video.spaceId = this.$store.getters.vendorId;
      } else {
        if (this.searchVender > 0) video.spaceId = this.searchVender;
      }
      for (var i = 0; i < this.venders.length; i++) {
        if (this.venders[i].usedOut == 1) {
          this.usedOutVenders[this.usedOutVenders.length] =
            this.venders[i].value;
        }
      }
      this.noEdit = this.$store.getters.vendorId != 0;
      this.video = video;
      this.dialogType = "new";
      this.dialogVisible = true;
    },

    async handleEdit(scope) {
      //編輯資料

      this.dialogType = "edit";
      var video = deepClone(scope.row);
      const res = await GetViewerVideoInfo(video.id);
      if (res && res.data) {
        var data = res.data;
        video.viewerData = data.filter((i) => i.editRecommend == 1);
      } else video.viewerData = [];

      video.checkedRecommend = video.viewerData
        .filter((i) => i.recommend == 1)
        .map(function (o) {
          return o.id;
        });

      video.artistId == -1 ? (video.artistId = undefined) : video.artistId;

      video.oldSpaceId = scope.row.spaceId;

      const Tag = await GetTagMapping(video.id);
      video.tag = Tag.data;

      const Title = await GetTitleMapping(video.id);
      video.title = Title.data;
      /* 語系改單選
      if (video.title)
        video.languages = video.title.map((e) => {
          return e.language;
        });
      else video.languages = [];
      */
      if (video.title) video.languages = video.title[0].language;

      var cn = video.title.find((o) => o.language == "zh-cn");
      if (cn) {
        video.cnTitle = cn.title;
        video.cnDesc = cn.description;
      } else {
        video.cnTitle = "";
        video.cnDesc = "";
      }

      var vi = video.title.find((o) => o.language == "vi");
      if (vi) {
        video.viTitle = vi.title;
        video.viDesc = vi.description;
      } else {
        video.viTitle = "";
        video.viDesc = "";
      }
      if (video.artistId === 0) video.artistId = undefined;

      var videoVendor = this.venders.find((o) => o.value == video.spaceId);
      this.noEdit = videoVendor.roleType != 9;
      this.video = video;
      this.dialogVisible = true;
    },

    async handlePreview(scope) {
      //預覽資料
      this.video = deepClone(scope.row);
      this.action = "";
      const res = await GetViewerVideoInfo(this.video.id);
      if (res && res.data) {
        var data = res.data;
        this.video.viewerData = data.filter((e) => e.status == 1);
      } else this.video.viewerData = [];

      this.previewVisible = true;
      this.actionLoading = false;
    },

    handleUpLoad(scope) {
      //上傳資料
      this.video = deepClone(scope.row);
      this.uploadVisible = true;
    },

    handleDelete(scope) {
      //編輯資料
      this.$confirm("確定要刪除此影片?", "警告", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteVideo(scope);
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

    async deleteVideo(scope) {
      //刪除資料
      let type = 3;
      this.video = deepClone(scope.row);

      let t = "";

      /*for (var i = 0; i < this.video.videoTag.length; i++) {
        t += this.video.videoTag[i];
        if ( i == this.video.videoTag.length-1) {
          break;
        }
        t += ","
      }*/

      const updateData = {
        type: type,
        id: this.video.id,
        title: this.video.title,
        sort: this.video.sort,
        code: this.video.code,
        space_id: this.video.space_id,
        video_file_name: this.video.video_file_name,
        url_new: this.video.url_new,
        image_new: this.video.image_new,
        desc: this.video.desc,
        sort: this.video.sort,
        tag: this.video.videoTag,
        views: this.video.views,
        vip_only: this.video.vip_only,
        is_recommend: this.video.is_recommend,
        createUser: this.video.createUser,
        lastUpdateUser: this.$store.getters.account,
        delflag: true,
        usedOut: this.usedOut,
      };

      await PutVideos(updateData);
      this.getAllVideos();
      /*
      this.dialogVisible = false;
      this.$notify({
        title: "刪除成功",
        dangerouslyUseHTMLString: true,
        type: "success",
      });
      */
    },
    closeCheck() {
      if (
        this.imgStatus == "uploading" ||
        this.vidStatus == "uploading" ||
        this.imgStatus == "merge" ||
        this.vidStatus == "merge"
      ) {
        this.$confirm(`檔案正在上傳中，確定關閉?`, "警告", {
          confirmButtonText: "確定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            this.uploadVisible = false;
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        this.uploadVisible = false;
      }
    },
    async refresh(type) {
      var msg = type === "img" ? "圖片" : "影片";
      this.$confirm(`確定要刷新${msg}?`, "警告", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.actionLoading = true;
          var refreshCdns = [];
          var v = this.video.viewerData;
          var a = this.vendors;
          this.video.viewerData.forEach((e) => {
            //輪循所有廳主的CDN
            var findCdnId = this.vendors.find((o) => o.id == e.spaceId);
            if (findCdnId && findCdnId.isEnable) {
              var findCdnName;
              //var findHost;
              if (type == "img") {
                findCdnName = this.cdns.find(
                  (o) => o.id == findCdnId.imageSpaceDomain
                );
                // findHost = this.cos.find((o) => o.id == findCdnName.cosId);
              } else {
                findCdnName = this.cdns.find(
                  (o) => o.id == findCdnId.videoSpaceDomain
                );
                // findHost = this.cos.find((o) => o.id == findCdnName.cosId);
              }
              if (findCdnName)
                refreshCdns.push({
                  host: findCdnName.host,
                  cdn: findCdnName.cdn,
                });
            }
          });
          var path = type == "img" ? this.video.imageUrl : this.video.videoUrl;
          var pathAry = path.split("/");
          pathAry.splice(-1, 1);
          var errMsg = [];

          //  await refreshCdns.forEach(async (e) => {
          for await (const e of refreshCdns) {
            var cdn = e.cdn;
            cdn = cdn.replace("https://", "").replace("http://", "");
            if (cdn.endsWith("/")) cdn.substring(0, cdn.length - 1);
            var fullPath = `\"${e.host}://${cdn}/${pathAry.join("/")}/\"`;
            var res = await PutClearPathCache(cdn, fullPath);
            if (!res) errMsg.push(cdn);
          }
          // });
          this.$notify({
            title: "刷新執行完成",
            type: "success",
          });
          if (errMsg.length > 0) console.log(errMsg.join(";"));
          // this.$notify({
          //   title: errMsg.length == 0 ? "刷新成功！" : "刷新失敗！",
          //   dangerouslyUseHTMLString: true,
          //   message:
          //     errMsg.length > 0 ? errMsg.join("<br>") + " 刷新失敗！" : "",
          //   type: errMsg.length == 0 ? "success" : "warning",
          // });
          this.actionLoading = false;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    async handleAction() {
      if (this.action == "") return false;

      var action = this.action;
      if (action == 1) {
        this.reTransVideos("img");
      } else if (action == 2) {
        this.reTransVideos("video");
      } else if (action == 3) {
        this.refresh("img");
      } else if (action == 4) {
        this.refresh("video");
      }
    },
    async handlePublish() {
      if (!this.searchVender > 0) {
        this.$message({
          type: "error",
          message: "請選擇一個供影商",
        });

        return false;
      }
      var spaceId=this.searchVender
      this.$confirm(`確定要執行發布?`, "警告", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await this.checkPublishStatus();
          if (!this.canPublish) {
            this.$message({
              type: "info",
              message: "目前已有另一項發布正在執行中，請稍候再試",
            });
            return false;
          }
          
          var updateData = new FormData();
          updateData.append("videoSpaceId", spaceId.toString());
          updateData.append("lastUpdateUser", this.$store.getters.account);

          await PostUpdateRedis(updateData);
          this.$notify({
            title: "發布執行中",
            dangerouslyUseHTMLString: true,
            type: "success",
          });
          await this.checkPublishStatus();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    async selectAction(command) {
      if (!this.searchVender > 0) {
        this.resetBatchTag();
        this.$message({
          type: "error",
          message: "請先選擇供影商",
        });
        return false;
      }
      this.batchAction = command;
      this.showTags = true;
    },
    async handleBatchTags() {
      if (this.batchTag == "" || this.batchTag == undefined) return;
      if (
        this.multipleSelectionAll == undefined ||
        this.multipleSelectionAll == ""
      ) {
        this.$message({
          type: "error",
          message: "請勾選影片",
        });
        this.batchTag = "";
        return false;
      }
      const { value, label } = this.batchTag;
      if (!value || !label) {
        this.$message({
          type: "error",
          message: "請選擇標籤",
        });
        return false;
      }
      var ids = [];
      var actionText = "";
      ids = this.multipleSelectionAll.split(",");
      if (this.batchAction == 1) {
        actionText = "新增";
      } else {
        actionText = "取消";
      }
      this.$confirm(
        `確認共有${ids.length}條視頻操作 ${actionText} 標籤：${label} ?`,
        "警告",
        {
          confirmButtonText: "確定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          const updateData = {
            videoId: ids,
            tag: value.toString(),
            createUser: this.$store.getters.account,
          };
          if (this.batchAction == 1) await PutNewTag(updateData);
          if (this.batchAction == 2) await PutDeleteTag(updateData);
          this.getAllVideos();
          this.$message({
            type: "success",
            message: "執行成功！",
          });
          this.resetBatchTag();
        })
        .catch((err) => {
          this.resetBatchTag();
        });
    },
    resetBatchTag() {
      this.batchTag = "";
      this.action = "";
      this.showTags = false;
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
