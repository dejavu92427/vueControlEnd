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
        ></selectVendor
        ><el-checkbox
          style="margin: 0px 10px"
          v-model="showDisableVendor"
          @change="resetVendor()"
          >顯示停用供影商</el-checkbox
        >
        <selectRadioCode
          v-show="false"
          :code.sync="item.country"
          domType="select"
          codeType="country"
          @getCodeList="getCodeList"
        ></selectRadioCode>
      </div>
      <div style="padding: 10px; margin-top: 10px; border: 1px #ebeef5 solid">
        <span class="label">影片作者</span>
        <el-input
          v-model="listQuery.artist"
          placeholder="作者"
          clearable
          style="width: 300px"
        />
        <span class="label sub">熱門</span>
        <el-select
          v-model="listQuery.isHot"
          clearable
          placeholder="是否熱門"
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
        <el-button
          :disabled="spaceId == ''"
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="
            listQuery.page = 1;
            handleSearch();
          "
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
      v-loading="listLoading"
      v-if="rolePermission.canView"
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
        label="作者ID"
        prop="id"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
        width="90"
      >
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="作者">
        <template slot-scope="scope">{{ scope.row.artist }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="出生日期"
        width="100px"
      >
        <template slot-scope="scope">{{
          scope.row.birthday.trim() != ""
            ? new Date(scope.row.birthday).Format("yyyy-MM-dd")
            : ""
        }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="身高"
        prop="height"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
      >
        <template slot-scope="scope">{{ scope.row.height }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="三圍">
        <template slot-scope="scope">{{ scope.row.measurement }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="罩杯"
        prop="cup"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
      >
        <template slot-scope="scope">{{ scope.row.cup }}</template>
      </el-table-column>

      <el-table-column :resizable="false" align="header-left" label="國籍">
        <template slot-scope="scope">{{
          scope.row.country | chValue(countryOptions)
        }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="首字母"
        prop="letter"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
      >
        <template slot-scope="scope">{{ scope.row.letter }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="熱門"
        prop="isHot"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
      >
        <template slot-scope="scope">
          <span :class="[scope.row.isHot != 0 ? 'yesClass' : '']">{{
            scope.row.isHot | chValue(boolOptions)
          }}</span></template
        >
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="轉檔中 / 未上傳 / 全部"
        width="160"
      >
        <template slot-scope="scope">{{
          `${scope.row.processCount} / ${scope.row.unLoadCount} / ${scope.row.videoCount}`
        }}</template>
      </el-table-column>

      <el-table-column
        :resizable="false"
        align="header-left"
        label="更新時間"
        width="155"
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
      @pagination="getVideoOwner(false)"
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

        <el-form-item label="作者" label-position="right" prop="artist">
          <el-input v-model="item.artist" placeholder="作者" maxlength="25" />
        </el-form-item>

        <el-form-item label="圖片" label-position="right" prop="image">
          <el-input v-model="item.image" placeholder="圖片" maxlength="150" />
        </el-form-item>

        <el-form-item label="生日" label-position="right" prop="birthday">
          <el-date-picker
            v-model="item.birthday"
            default-value="1990-01-01"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="生日"
          />
        </el-form-item>

        <el-form-item label="身高" label-position="right" prop="height">
          <el-input-number
            v-model="item.height"
            :precision="0"
            :min="100"
            :max="200"
            label="身高"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="三圍" label-position="right" prop="measurement">
          <el-input
            v-model="item.measurement"
            placeholder="三圍"
            maxlength="50"
          />
        </el-form-item>

        <el-form-item label="罩杯" label-position="right" prop="cup">
          <el-select v-model="item.cup" default-first-option>
            <el-option
              v-for="item in cupOptions"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="國籍" label-position="right" prop="country">
          <selectRadioCode
            :code.sync="item.country"
            domType="select"
            codeType="country"
            @getCodeList="getCodeList"
          ></selectRadioCode>
        </el-form-item>

        <el-form-item label="描述" label-position="right" prop="desc">
          <el-input
            v-model="item.description"
            placeholder="描述"
            type="textarea"
            :rows="4"
            maxlength="500"
          />
        </el-form-item>

        <el-form-item label="首字母" label-position="right" prop="letter">
          <el-select v-model="item.letter" default-first-option>
            <el-option
              v-for="item in letterOptions"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="作者類型" label-position="right" prop="actress">
          <el-switch
            v-model="item.actress"
            actice-color="#00A854"
            active-text="女優"
            :active-value="1"
            inactive-color="#F04134"
            inactive-text="非女優"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>

        <el-form-item label="是否熱門" label-position="right" prop="isHot">
          <el-switch
            v-model="item.isHot"
            actice-color="#00A854"
            active-text="熱門"
            :active-value="1"
            inactive-color="#F04134"
            inactive-text="不熱門"
            :inactive-value="0"
          >
          </el-switch>
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
import { GetVideoOwner, GetVideoOwnerCount, PutVideoOwner } from "@/api/video";
import pagination from "@/components/Pagination";

//permission control button start
import getRolePermission from "../../utils/role-permission";
import newBtn from "@/components/PermissionControl/newButton";
import editBtn from "@/components/PermissionControl/editButton";
import deleteBtn from "@/components/PermissionControl/deleteButton";
import saveBtn from "@/components/PermissionControl/saveButton";
import cancelBtn from "@/components/PermissionControl/cancelButton";
//permission control button end
import selectRadioCode from "./components/select-radio-code";
import selectVendor from "./components/select-vendor";

const defaultItem = {
  id: 0,
  artist: "",
  image: "",
  birthday: "",
  height: 0,
  measurement: "",
  cup: "",
  country: "",
  desc: "",
  letter: "",
  actress: 1,
  isHot: 1,
  createUser: "",
  lastUpdateUser: "",
};

export default {
  data() {
    const validateStringTrim = (rule, value, callback) => {
      if (!value || value.trim().length == 0) {
        switch (rule.field) {
          case "artist":
            callback(new Error("作者為必填"));
            break;
          case "measurement":
            callback(new Error("三圍為必填"));
            break;
        }
      } else callback();
    };
    return {
      isAdmin: false,
      vendorKey: 0,
      showDisableVendor: false,
      spaceId: "",
      listQuery: {
        page: 1,
        limit: 20,
        artist: "",
        is_Hot: "",
        sortKey: "id",
        sortOrder: "ascending",
      },
      total: 0,
      item: Object.assign({}, defaultItem),
      allItemList: [],
      itemList: [],
      dialogVisible: false,
      dialogType: "new",
      listLoading: false,
      rule: {
        artist: [
          { required: true, validator: validateStringTrim, trigger: "blur" },
        ],
        birthday: [{ required: true, message: "生日為必填", trigger: "blur" }],
        height: [{ required: true, message: "身高為必填", trigger: "blur" }],
        measurement: [
          { required: true, validator: validateStringTrim, trigger: "blur" },
        ],
      },
      boolOptions: [
        { value: 1, label: "是" },
        { value: 0, label: "否" },
      ],
      cupOptions: ["A", "B", "C", "D", "E", "F", "G"],
      letterOptions: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ],
      countryOptions: [],
    };
  },
  components: {
    newBtn,
    editBtn,
    saveBtn,
    cancelBtn,
    deleteBtn,
    pagination,
    selectRadioCode,
    selectVendor,
  },
  watch: {
    spaceId: function (val) {
      if (val && val !== "") this.getVideoOwner();
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
    } else this.spaceId = this.$store.getters.vendorId;
    // if (this.spaceId != "") this.getVideoOwner();
  },
  methods: {
    resetVendor() {
      this.vendorKey += 1;
    },
    getRolePermissions() {
      return getRolePermission(this.$route.name);
    },
    async getCodeList(data) {
      this.countryOptions = data;
    },
    sortChange(data) {
      const { prop, order } = data;
      this.listQuery.sortKey = prop;
      this.listQuery.sortOrder = order;
      this.getVideoOwner(false);
    },
    handleSearch() {
      if (!this.spaceId || this.spaceId == "") {
        this.$message({
          type: "error",
          message: "請選擇操作供影商",
        });
        return false;
      }
      this.getVideoOwner(true);
    },
    async getVideoOwner(isCallApi = true) {
      if (!this.spaceId || this.spaceId == "") {
        return false;
      }
      this.listLoading = true;
      if (isCallApi) {
        const res = await GetVideoOwnerCount(this.spaceId);
        this.allItemList = res.data;
      }
      const { sortKey, sortOrder } = this.listQuery;
      this.allItemList = this.allItemList.sort(function (a, b) {
        if (sortOrder == "ascending") return a[sortKey] < b[sortKey] ? -1 : 1;
        else if (sortOrder == "descending")
          return a[sortKey] > b[sortKey] ? -1 : 1;
      });
      if (this.listQuery.artist)
        this.listQuery.artist = this.listQuery.artist.trim();
      let { page = 1, limit = 20, artist = "", isHot = "" } = this.listQuery;
      let filterList = [];
      let str_isHot = isHot.toString();
      filterList = this.allItemList.filter(function (item) {
        if (artist != "" && item.artist.indexOf(artist) == -1) return false;
        if (str_isHot != "" && item.isHot != str_isHot) return false;
        return true;
      });

      this.total = filterList.length;

      const pageList = filterList.filter(
        (item, index) => index < limit * page && index >= limit * (page - 1)
      );
      this.itemList = pageList;
      setTimeout(() => {
        this.listLoading = false;
      }, 0.3 * 1000);
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    handleAdd() {
      this.item = Object.assign({}, defaultItem);
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
        artist: this.item.artist.trim(),
        image: this.item.image,
        birthday: this.item.birthday,
        height: this.item.height,
        measurement: this.item.measurement.trim(),
        cup: this.item.cup,
        country: this.item.country,
        description: this.item.description,
        letter: this.item.letter,
        actress: this.item.actress,
        isHot: this.item.isHot,
        createUser: isEdit ? this.item.createUser : this.$store.getters.account,
        lastupdateUser: this.$store.getters.account,
      };
      //檢查名稱是否重覆
      if (!isEdit) {
        const res = await GetVideoOwner();
        if (res.data.find((o) => o.artist == updateData.artist)) {
          this.$notify({
            title: "error",
            dangerouslyUseHTMLString: true,
            message: "作者姓名重覆",
            type: "error",
          });
          return;
        }
      }
      //寫入帳號
      await PutVideoOwner(updateData);
      this.getVideoOwner();
      const { title } = updateData;
      this.dialogVisible = false;
      this.$notify({
        title: "寫入成功",
        dangerouslyUseHTMLString: true,
        message: `
            <div>作者: ${this.item.artist}</div>
          `,
        type: "success",
      });
    },
    handleDelete({ $index, row }) {
      this.$confirm(`確定刪除：${row.artist} ?`, "警告", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const delData = {
            type: 3,
            id: row.id,
            artist: row.artist,
            image: row.image,
            birthday: row.birthday,
            height: row.height,
            measurement: row.measurement,
            cup: row.cup,
            country: row.country,
            description: row.description,
            letter: row.letter,
            actress: row.actress,
            isHot: row.isHot,
            delflag: 1,
            createUser: row.createUser,
            lastupdateUser: this.$store.getters.account,
          };
          await PutVideoOwner(delData);
          this.$message({
            type: "success",
            message: "刪除成功！",
          });
          this.getVideoOwner();
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
