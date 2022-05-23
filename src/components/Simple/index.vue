<template>
  <div class="simple-upload-container">
    <div class="total-progress">
      <div class="btns">
        <el-button-group>
          <el-button :disabled="changeDisabled">
            <i class="el-icon-upload2 el-icon--left" size="mini"></i>選擇文件
            <input
              v-if="!changeDisabled"
              type="file"
              :multiple="multiple"
              class="select-file-input"
              :accept="accept"
              οnclick="f.outerHTML=f.outerHTML"
              @change="handleFileChange"
            />
          </el-button>
          <el-button :disabled="uploadDisabled" @click="handleUpload"
            ><i class="el-icon-upload el-icon--left" size="mini"></i
            >{{ status == "error" ? "重試" : "上傳" }}</el-button
          >
          <el-button :disabled="pauseDisabled" @click="handlePause"
            ><i class="el-icon-video-pause el-icon--left" size="mini"></i
            >暫停</el-button
          >
          <el-button :disabled="resumeDisabled" @click="handleResume"
            ><i class="el-icon-video-play el-icon--left" size="mini"></i
            >恢復</el-button
          >
          <el-button :disabled="clearDisabled" @click="clearFiles"
            ><i class="el-icon-delete el-icon--left" size="mini"></i
            >清空</el-button
          >
        </el-button-group>
        <slot name="header"></slot>
      </div>
    </div>
    <div class="file-list">
      <el-collapse v-if="uploadFiles.length" accordion>
        <el-collapse-item v-for="(item, index) in uploadFiles" :key="index">
          <template slot="title">
            <div class="progress-box">
              <div class="list-item">
                <div class="item-name">
                  <span>{{ item.name }}</span>
                </div>
                <div class="item-size">
                  {{ item.size | transformByte }}
                </div>
                <div v-if="item.hashProgress !== 100" class="item-progress">
                  <span
                    >{{
                      status === "wait" ? "準備讀取文件" : "正在讀取文件"
                    }}：</span
                  >
                  <el-progress :percentage="item.hashProgress" />
                </div>
                <div v-else class="item-progress">
                  <span>上傳進度：</span
                  ><el-progress :percentage="item.uploadProgress" />
                </div>
                <div class="item-status">
                  <i
                    :class="
                      status != 'error'
                        ? fileStatuIcon(item.status)
                        : fileStatuIcon(status)
                    "
                  ></i>
                  {{ (status != "error" ? item.status : "error") | fileStatus }}
                </div>
              </div>
            </div>
          </template>
          <div class="item-chunk-box">
            <el-table :data="item.chunkList" border max-height="300">
              <el-table-column
                :resizable="false"
                prop="index"
                label="#"
                align="center"
              />
              <el-table-column
                :resizable="false"
                prop="hash"
                label="切片md5"
                align="center"
                show-overflow-tooltip
              />
              <el-table-column
                :resizable="false"
                label="大小"
                align="center"
                width="120"
              >
                <template v-slot="{ row }">
                  {{ row.size | transformByte }}
                </template>
              </el-table-column>
              <el-table-column
                :resizable="false"
                prop="uploaded"
                label="是否完成"
                align="center"
              >
                <template v-slot="{ row }">
                  {{ row.uploaded ? "完成" : "進行中" }}
                </template>
              </el-table-column>

              <el-table-column :resizable="false" label="進度" align="center">
                <template v-slot="{ row }">
                  <el-progress
                    v-if="!row.status || row.status === 'wait'"
                    :percentage="row.progress"
                  />
                  <el-progress
                    v-else
                    :percentage="row.progress"
                    :status="row.status"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>
      <slot name="tip"></slot>
    </div>
  </div>
</template>
<script>
import {
  PostupliadFileChunk,
  PostVideoMerge,
  PutFileUploadMaster,
} from "@/api/upload";
import {
  saveObjArr,
  getObjArr,
  clearLocalStorage,
  clearAllFileLocalStorage,
} from "./localstorage";
import { CancelToken } from "axios";

//var instance = axios.create({});

var chunkSize = 10 * 1024 * 1024; // default切片大小
var fileIndex = 0; // 当前正在被遍历的文件下标

// 所有文件状态
const Status = {
  wait: "wait",
  pause: "pause",
  uploading: "uploading",
  hash: "hash",
  error: "error",
  done: "done",
  merge: "merge",
};

// 单个文件的状态
const fileStatus = {
  wait: "wait",
  uploading: "uploading",
  success: "success",
  error: "error",
  secondPass: "secondPass",
  pause: "pause",
  resume: "resume",
  merge: "merge",
};
// 单个文件的状态 对应描述
const fileStatusStr = {
  wait: "待上傳",
  uploading: "上傳中",
  merge: "合併中",
  success: "成功",
  error: "失敗",
  secondPass: "已秒傳",
  pause: "暫停",
  resume: "恢復",
};

export default {
  name: "SimpleUploaderContainer",
  filters: {
    transformByte(size) {
      if (!size) {
        return "0B";
      }

      var num = 1024.0; // byte

      if (size < num) {
        return size + "B";
      }
      if (size < Math.pow(num, 2)) {
        return (size / num).toFixed(2) + "K";
      } // kb
      if (size < Math.pow(num, 3)) {
        return (size / Math.pow(num, 2)).toFixed(2) + "M";
      } // M
      if (size < Math.pow(num, 4)) {
        return (size / Math.pow(num, 3)).toFixed(2) + "G";
      } // G
      return (size / Math.pow(num, 4)).toFixed(2) + "T"; // T
    },
    // 单个文件状态格式化
    fileStatus(status) {
      return fileStatusStr[fileStatus[status]];
    },
  },
  props: {
    headers: {
      type: Object,
      default: null,
    },
    beforeUpload: {
      type: Function,
      default: null,
    },
    accept: {
      type: String,
      default: "",
    },
    // 上傳文件时携带的参数
    uploadArguments: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 是否傳递cookie
    withCredentials: {
      type: Boolean,
      default: false,
    },
    // 文件个数
    limit: {
      type: Number,
      default: 0,
    },
    // 文件超出个数限制时的钩子
    onExceed: {
      type: Function,
      default: () => {},
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    // axios baseUrl
    // baseUrl: {
    //   type: String,
    //   default: "",
    // },
    // 切片大小
    chunkSize: {
      type: Number,
      default: 10 * 1024 * 1024,
    },
    // 上傳并发数
    threads: {
      type: Number,
      default: 3,
    },
    // 错误重試次数
    chunkRetry: {
      type: Number,
      default: 3,
    },
  },
  data: () => ({
    uploadFiles: [],
    worker: null,
    cancels: [], // 存储要取消的请求
    tempThreads: 3,
    // 默认状态
    status: Status.wait,
  }),
  computed: {
    changeDisabled() {
      return ![Status.wait, Status.done].includes(this.status);
    },
    uploadDisabled() {
      return (
        !this.uploadFiles.length ||
        [Status.pause, Status.done, Status.uploading, Status.hash,Status.merge].includes(
          this.status
        )
      );
    },
    pauseDisabled() {
      return [Status.hash, Status.wait, Status.done, Status.pause,,Status.merge].includes(
        this.status
      );
    },
    resumeDisabled() {
      return ![Status.pause].includes(this.status);
    },
    clearDisabled() {
      return !this.uploadFiles.length;
    },
    fileStatuIcon(status) {
      return function (status) {
        var className = "";
        switch (status) {
          case "uploading":
            className = "el-icon-loading";
            break;
          case "merge":
            className = "el-icon-loading";
            break;
          case "success":
          case "secondPass":
            className = "el-icon-circle-check";
            break;
          case "error":
            className = "el-icon-circle-close";
            break;
        }
        return className + " el-icon--left";
      };
    },
  },
  beforeDestroy() {
    clearAllFileLocalStorage();
    /*
    this.uploadFiles.forEach((o) => {
     clearLocalStorage(o.fileHash);
    });
    */
  },
  destroyed() {
    this.clearFiles();
  },
  created() {
    clearAllFileLocalStorage();
    this.setAxios();
    this.tempThreads = this.threads;
  },
  watch: {
    status(val) {
      this.$emit("getStatus", val);
    },
  },
  methods: {
    handleFileChange(e) {
      //上傳新文件前清空列表
      this.clearFiles();
      const files = e.target.files;
      //console.log("handleFileChange -> file", files);
      if (!files) return;

      fileIndex = 0; // 重置文件下标
      //console.log("handleFileChange -> this.uploadFiles", this.uploadFiles);
      // 判断文件选择的个数
      if (this.limit && files.length > this.limit) {
        this.onExceed && this.onExceed(files);
        return;
      }

      this.status = Status.wait;

      const postFiles = Array.prototype.slice.call(files);
      //console.log("handleFileChange -> postFiles", postFiles);
      postFiles.forEach((item) => {
        this.handleStart(item);
      });
    },
    handleStart(rawFile) {
      // 初始化部分自定义属性
      rawFile.status = fileStatus.wait;
      rawFile.chunkList = [];
      rawFile.uploadProgress = 0;
      rawFile.fakeUploadProgress = 0; // 假进度条，处理恢復上傳后，进度条后移的问题
      rawFile.hashProgress = 0;

      if (this.beforeUpload) {
        const before = this.beforeUpload(rawFile);
        if (before && before.then) {
          before.then((res) => {
            this.uploadFiles.push(rawFile);
          });
        }
      }

      if (!this.beforeUpload) {
        this.uploadFiles.push(rawFile);
      }
    },
    async handleUpload() {
      //console.log("handleUpload -> this.uploadFiles", this.uploadFiles);
      if (!this.uploadFiles) return;
      this.status = Status.uploading;
      const filesArr = this.uploadFiles;

      for (let i = 0; i < filesArr.length; i++) {
        fileIndex = i;
        if (["secondPass", "success", "error"].includes(filesArr[i].status)) {
          //console.log("跳過已成功的分片");
          continue;
        }

        const fileChunkList = this.createFileChunk(filesArr[i]);

        // 若不是恢復，再进行hash计算
        if (filesArr[i].status !== "resume") {
          this.status = Status.hash;
          // hash校验，是否为秒傳
          filesArr[i].hash = await this.calculateHash(fileChunkList);

          // 若清空或者状态为等待，则跳出循环
          if (this.status === Status.wait) {
            console.log("若清空或者状態为等待，跳出循環");
            break;
          }

          //console.log("handleUpload -> hash", filesArr[i].hash);
        }

        this.status = Status.uploading;
        //乎略不檢驗是否已存在
        // const verifyRes = await this.verifyUpload(filesArr[i].name, filesArr[i].hash);
        // if (verifyRes.data.status) {
        //   filesArr[i].status = fileStatus.secondPass;
        //   filesArr[i].uploadProgress = 100;
        //   this.isAllStatus();
        // } else {
        console.log("開始上傳文件----》", filesArr[i].name);
        filesArr[i].status = fileStatus.uploading;

        const getChunkStorage = this.getChunkStorage(
          `file_${filesArr[i].hash}`
        );
        filesArr[i].fileHash = filesArr[i].hash; // 文件的hash，合并时使用
        filesArr[i].chunkList = fileChunkList.map(({ file }, index) => ({
          fileHash: filesArr[i].hash,
          fileName: filesArr[i].name,
          index,
          hash: filesArr[i].hash + "-" + index,
          chunk: file,
          size: file.size,
          uploaded: getChunkStorage && getChunkStorage.includes(index), // 标识：是否已完成上傳
          progress:
            getChunkStorage && getChunkStorage.includes(index) ? 100 : 0,
          status:
            getChunkStorage && getChunkStorage.includes(index)
              ? "success"
              : "wait", // 上傳状态，用作进度状态显示
        }));

        this.$set(filesArr, i, filesArr[i]);

        //console.log("handleUpload ->  this.chunkData", filesArr[i]);
        await this.uploadChunks(filesArr[i]);
        // }
      }
    },
    // 将切片傳输给服务端
    async uploadChunks(data) {
      //console.log("uploadChunks -> data", data);
      var chunkData = data.chunkList;
      return new Promise(async (resolve, reject) => {
        const requestDataList = chunkData
          .filter(({ uploaded }) => !uploaded)
          .map(({ fileHash, chunk, fileName, index }) => {
            // const formData = new FormData();
            // formData.append("md5", fileHash);
            // formData.append("file", chunk);
            // formData.append("fileName", index); // 文件名使用切片的下标
            return { fileHash, chunk, index, fileName, fileSize: data.size };
          });

        //console.log("uploadChunks -> requestDataList", requestDataList);

        //通知上傳
        try {
          const chunkStorage = this.getChunkStorage(data.fileHash);
          if (!chunkStorage || chunkStorage.length == 0)
            await this.fileuploadmaster(data);
        } catch (error) {
          console.log("/upload/fileuploadmaster api exception");
          this.status = Status.error;
          return;
        }

        try {
          const ret = await this.sendRequest(requestDataList, chunkData);
          //console.log("uploadChunks -> chunkData", chunkData);
          //console.log("ret", ret);
        } catch (error) {
          // 上傳有被reject的
          this.$message.error("上傳失敗,請重試");
          this.status = Status.error;
          return;
        }

        // 合并切片
        const isUpload = chunkData.some((item) => item.uploaded === false);
        console.log("created -> isUpload", isUpload);
        if (isUpload) {
          this.$message.error("檔案上傳失敗：存在失敗的切片");
        } else {
          // 执行合并
          try {
            data.status = Status.merge;
            this.status = Status.merge;
            await this.mergeRequest(data);
            resolve();
          } catch (error) {
            reject("merge api exception");
          }
        }
      });
    },
    // 并发处理
    sendRequest(forms, chunkData) {
      // console.log("sendRequest -> forms", forms);
      // console.log("sendRequest -> chunkData", chunkData);
      var finished = 0;
      const total = forms.length; //檔案總數
      const that = this;
      const retryArr = []; // 每個文件hash请求的重試次數，做累加 比如[1,0,2],就是第0個切片報错1次，第2個報错2次

      return new Promise((resolve, reject) => {
        const handler = async () => {
         // console.log("handler -> forms", forms);
          if (forms.length) {
            const contentCount = chunkData.length;

            const formInfo = forms.shift();
            const index = formInfo.index;
            const chunk = formInfo.chunk;

            //const spiltDataLength = chunk.byteLength;
            //const chunkAry = await chunk.arrayBuffer();
            //var s2 = new TextDecoder("utf-8").decode(chunkAry);

            const spiltDataLength = chunk.size;
            // var s1 = await chunk.text();

            //const spiltData = s2; //

            const mergeIdx = formInfo.index + 1;
            const fileName = formInfo.fileName;
            const fileHash = formInfo.fileHash;
            const contentLength = formInfo.fileSize;
            const fileType = this.uploadArguments.fileType;
            const fileClass = fileName
              .substring(fileName.lastIndexOf(".") + 1, fileName.length)
              .toLowerCase();
            const videoId = this.uploadArguments.videoId;
            const videoSpaceId = this.uploadArguments.videoSpaceId;
            /* 
            const detail = {
              mergeIdx,
              spiltData,
              spiltDataLength,
            };

            const master = {
              spiltDataLength,
              contentCount,
              contentLength,
              fileClass,
              fileType,
              md5: fileHash,
              videoId,
              videoSpaceId,
            };

            var request = {
              detail,
              master,
              editUser: this.$store.getters.account,
            };
*/
            var formData = new FormData();
            formData.append("detail_mergeIdx", mergeIdx);
            formData.append("detail_spiltData", chunk);
            formData.append("detail_size", spiltDataLength);
            formData.append("master_contentCount", contentCount);
            formData.append("master_contentLength", contentLength);
            formData.append("master_fileClass", fileClass);
            formData.append("master_fileType", fileType);
            formData.append("master_md5", fileHash);
            formData.append("master_videoId", videoId);
            formData.append("master_videoSpaceId", videoSpaceId);
            formData.append("editUser", this.$store.getters.account);
            const config = {
              onUploadProgress: that.createProgresshandler(chunkData[index]),
              cancelToken: new CancelToken((c) => this.cancels.push(c)),
              timeout: 0,
              type: "form-data", //form-data
            };

            try {
              // var res = await PostupliadFileChunk(request, config);
              // console.log(
              //   `detail_mergeIdx=${mergeIdx} ; master_contentCount=${contentCount}`
              // );
              var res = await PostupliadFileChunk(formData, config);
              console.log(`index:${index}: res.status:${res.status}`);
              // if (res.status != "000") {
              // } else {
              console.log("handler -> res", res);
              // 更改状态
              chunkData[index].uploaded = true;
              chunkData[index].status = "success";
              // 存储已上傳的切片下标
              this.addChunkStorage(`file_${chunkData[index].fileHash}`, index);
              finished++;
              handler();
              //}
            } catch (error) {
              // deal with non-ok fetch
              // 暫停或等待時，禁止重試
              console.warn("api错誤", error);

              //console.log("handler -> .statthisus", this.status);
              if ([Status.pause, Status.wait].includes(this.status)) return;

              //console.log("handler -> retryArr", retryArr);
              if (typeof retryArr[index] !== "number") {
                retryArr[index] = 0;
              }

              // 更新状态
              chunkData[index].status = "warning";

              // 累加错误次数
              retryArr[index]++;

              // 重試3次
              if (retryArr[index] >= this.chunkRetry) {
                console.warn(
                  " 重試失敗--- > handler -> retryArr",
                  retryArr,
                  chunkData[index].hash
                );
                return reject("重試失敗", retryArr);
              }

              console.log(
                "handler -> retryArr[finished]",
                `${chunkData[index].hash}--第 ${retryArr[index]} '次重試'`
              );
              //console.log(retryArr);

              this.tempThreads++; // 释放当前占用的通道

              // 失敗重新加入
              forms.push(formInfo);
              handler();
            }

            // instance
            //   .post("Video/upliadFileChunk", formData, {
            //     onUploadProgress: that.createProgresshandler(chunkData[index]),
            //     cancelToken: new CancelToken((c) => this.cancels.push(c)),
            //     timeout: 0,
            //   })
            //   .then((res) => {
            //     console.log("handler -> res", res);
            //     // 更改状态
            //     chunkData[index].uploaded = true;
            //     chunkData[index].status = "success";

            //     // 存储已上傳的切片下标
            //     this.addChunkStorage(chunkData[index].fileHash, index);

            //     finished++;
            //     handler();
            //   })
            //   .catch((e) => {
            //     // 若状态为暫停或等待，则禁止重試
            //     console.log("handler -> this.status", this.status);
            //     if ([Status.pause, Status.wait].includes(this.status)) return;

            //     console.warn("出现错误", e);
            //     console.log("handler -> retryArr", retryArr);
            //     if (typeof retryArr[index] !== "number") {
            //       retryArr[index] = 0;
            //     }

            //     // 更新状态
            //     chunkData[index].status = "warning";

            //     // 累加错误次数
            //     retryArr[index]++;

            //     // 重試3次
            //     if (retryArr[index] >= this.chunkRetry) {
            //       console.warn(
            //         " 重試失敗--- > handler -> retryArr",
            //         retryArr,
            //         chunkData[index].hash
            //       );
            //       return reject("重試失敗", retryArr);
            //     }

            //     console.log(
            //       "handler -> retryArr[finished]",
            //       `${chunkData[index].hash}--进行第 ${retryArr[index]} '次重試'`
            //     );
            //     console.log(retryArr);

            //     this.tempThreads++; // 释放当前占用的通道

            //     // 将失敗的重新加入队列
            //     forms.push(formInfo);
            //     handler();
            //   });
          }

          if (finished >= total) {
            resolve("done");
          }
        };

        // 控制并发
        for (let i = 0; i < this.tempThreads; i++) {
          handler();
        }
      });
    },
    //通知開始上傳
    async fileuploadmaster(data) {
      //return  new  Promise((resolve, reject) => {
      const obj = {
        contentCount: data.chunkList.length,
        contentLength: data.size,
        fileClass: data.name
          .substring(data.name.lastIndexOf(".") + 1, data.name.length)
          .toLowerCase(),
        fileType: this.uploadArguments.fileType,
        md5: data.fileHash,
        videoId: this.uploadArguments.videoId,
        videoSpaceId: this.uploadArguments.videoSpaceId,
      };
      await PutFileUploadMaster(obj);
    },
    // 通知合并切片
    async mergeRequest(data) {
      //return  new  Promise((resolve, reject) => {
      const obj = {
        editUser: this.$store.getters.account,
        fileClass: data.name
          .substring(data.name.lastIndexOf(".") + 1, data.name.length)
          .toLowerCase(),
        fileType: this.uploadArguments.fileType,
        md5: data.fileHash,
        videoId: this.uploadArguments.videoId,
        videoSpaceId: this.uploadArguments.videoSpaceId,
        /*
        md5: data.fileHash,
        fileName: data.name,
        fileChunkNum: data.chunkList.length,
        ...this.uploadArguments,
        */
      };
      try {
        var res = await PostVideoMerge(obj);

        data.status = fileStatus.success;
        //console.log("mergeRequest -> data", data);
        clearLocalStorage(`file_${data.fileHash}`);
        // this.$message.success('上傳成功');
        // 判断是否所有都成功上傳
        this.isAllStatus();
        //resolve();
      } catch (error) {
        //合併失敗
        clearLocalStorage(`file_${data.fileHash}`);
        //data.status = fileStatus.error;
        this.status = Status.error;
      }

      // instance
      //   .post("Video/merge", obj, {
      //     timeout: 0,
      //   })
      //   .then((res) => {
      //     // 清除storage
      //     if (res.data.status === "000") {
      //       data.status = fileStatus.success;
      //       console.log("mergeRequest -> data", data);
      //       clearLocalStorage(data.fileHash);
      //       // this.$message.success('上傳成功');
      //       // 判断是否所有都成功上傳
      //       this.isAllStatus();
      //       resolve();
      //     } else {
      //       // 文件块数量不对，清除缓存
      //       clearLocalStorage(data.fileHash);
      //       data.status = fileStatus.error;
      //       this.status = Status.wait;
      //       resolve();
      //     }
      //   })
      //   .catch((err) => {
      //     console.log("mergeRequest -> err", err);
      //     data.status = fileStatus.error;
      //     reject();
      //   });
      //});
    },
    // 创建文件切片
    createFileChunk(file, size = this.chunkSize) {
      const fileChunkList = [];
      var count = 0;
      while (count < file.size) {
        fileChunkList.push({
          file: file.slice(count, count + size),
        });
        count += size;
      }
      //console.log("createFileChunk -> fileChunkList", fileChunkList);
      return fileChunkList;
    },

    // 暫停上傳
    handlePause() {
      this.status = Status.pause;
      if (this.uploadFiles.length) {
        const currentFile = this.uploadFiles[fileIndex];
        currentFile.status = fileStatus.pause;
        // 将当前进度赋值给假进度条
        currentFile.fakeUploadProgress = currentFile.uploadProgress;
        //console.log("handlePause -> currentFile", currentFile);
      }
      while (this.cancels.length > 0) {
        this.cancels.pop()("取消或暫停上傳");
      }
    },
    // 恢復上傳
    handleResume() {
      this.status = Status.uploading;
      // console.log(
      //   "handleResume -> this.uploadFiles[fileIndex]",
      //   this.uploadFiles[fileIndex]
      // );
      this.uploadFiles[fileIndex].status = fileStatus.resume;
      this.handleUpload();
    },
    // 文件上傳之前的校验： 校验文件是否已存在
    verifyUpload(fileName, fileHash) {
      return new Promise((resolve) => {
        const obj = {
          md5: fileHash,
          fileName,
          ...this.uploadArguments,
        };
        instance
          .get("Video/checkeExists", { params: obj })
          .then((res) => {
            //console.log("verifyUpload -> res", res);
            resolve(res.data);
          })
          .catch((err) => {
            //console.log("verifyUpload -> err", err);
          });
      });
    },
    // 生成文件 hash（web-worker）
    calculateHash(fileChunkList) {
      //console.log("calculateHash -> fileChunkList", fileChunkList);
      return new Promise((resolve) => {
        this.worker = new Worker("../hash.js");
        this.worker.postMessage({ fileChunkList });
        this.worker.onmessage = (e) => {
          const { percentage, hash } = e.data;
          if (this.uploadFiles[fileIndex]) {
            this.uploadFiles[fileIndex].hashProgress = Number(
              percentage.toFixed(0)
            );
            this.$set(this.uploadFiles, fileIndex, this.uploadFiles[fileIndex]);
          }

          if (hash) {
            resolve(hash);
          }
        };
      });
    },
    // 切片上傳进度
    createProgresshandler(item) {
      //console.log("createProgresshandler -> item", item);
      return (p) => {
        item.progress = parseInt(String((p.loaded / p.total) * 100));
        this.fileProgress();
      };
    },
    // 文件总进度
    fileProgress() {
      const currentFile = this.uploadFiles[fileIndex];
      if (currentFile) {
        const uploadProgress = currentFile.chunkList
          .map((item) => item.size * item.progress)
          .reduce((acc, cur) => acc + cur);
        const currentFileProgress = parseInt(
          (uploadProgress / currentFile.size).toFixed(2)
        );
        // 真假进度条处理--处理进度条后移
        if (!currentFile.fakeUploadProgress) {
          currentFile.uploadProgress = currentFileProgress;
          this.$set(this.uploadFiles, fileIndex, currentFile);
        } else if (currentFileProgress > currentFile.fakeUploadProgress) {
          currentFile.uploadProgress = currentFileProgress;
          this.$set(this.uploadFiles, fileIndex, currentFile);
        }
      }
    },
    // 存储已上傳完成的切片下标
    addChunkStorage(name, index) {
      const data = [index];
      //console.log("addChunkStorage -> name, data", name, data);
      const arr = getObjArr(name);
      if (arr) {
        saveObjArr(name, [...arr, ...data]);
      } else {
        saveObjArr(name, data);
      }
    },
    // 获取已上傳完成的切片下标
    getChunkStorage(name) {
      return getObjArr(name);
    },
    // axios 设置axios参数
    setAxios() {
      // if (!this.headers) return;
      // for (const i in this.headers) {
      //   instance.defaults.headers.common[i] = this.headers[i];
      // }

      // // 是否携带cookie
      // if (this.withCredentials) {
      //   instance.defaults.withCredentials = true;
      // }

      // // 设置baseUrl
      // if (this.baseUrl) {
      //   instance.defaults.baseURL = this.baseUrl;
      // }

      // 设置切片大小
      chunkSize = this.chunkSize;
    },
    // 清空文件
    clearFiles() {
      //console.log("清空文件");
      fileIndex = 0;
      this.handlePause();

      this.worker && this.worker.terminate(); // 中断worker
      this.status = Status.wait;

      Object.assign(this.$data, this.$options.data()); // 重置data所有数据
    },
    // 判断是否都已完成上傳
    isAllStatus() {
      const isAllSuccess = this.uploadFiles.every((item) =>
        ["success", "secondPass", "error"].includes(item.status)
      );
      //console.log("mergeRequest -> isAllSuccess", isAllSuccess);
      if (isAllSuccess) {
        this.status = Status.done;
        this.$emit("success");
      }
    },
  },
};
</script>
<style scoped lang="scss">
.simple-upload-container {
  width: 100%;
  border: 1px solid #d2d2d2;
  border-radius: 4px;
  background-color: #fff;
  padding-bottom: 15px;
  padding: 10px;
  .progress-box {
    width: 100%;
  }
  .total-progress {
    margin-bottom: 15px;
    .btns {
      position: relative;
      .select-file-input {
        position: absolute;
        display: inline-block;
        left: 0;
        top: 0;
        border: none;
        opacity: 0;
        width: 96px;
        height: 28px;
      }
    }
  }

  .file-list {
    .list-item {
      padding: 8px 10px;
      display: flex;
      justify-content: center;
      justify-items: center;
      line-height: 25px;
      position: relative;
      &:hover .item-chunk-box {
        display: block;
      }
      div {
        flex: 1;
        margin-top: 6px;
      }
      .item-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 0 0 25%;
        margin-right: 6px;
        .svg-icon {
          font-size: 22px;
          vertical-align: sub;
        }
      }
      .item-status {
        flex: 0 0 10%;
        text-align: center;
        text-align: left;
        .el-icon-circle-check {
          color: #67c23a;
        }
        .el-icon-circle-close {
          color: #f00;
        }
      }
      .item-chunk-box {
        display: none;
        transition: all 3s;
        position: absolute;
        top: 0;
        left: 40px;
        z-index: 10;
      }
      .item-progress {
        flex: 0 0 50%;
      }
    }
  }

  .upload-tip {
    font-size: 12px;
    color: #606266;
    margin-top: 7px;
  }

  .el-progress {
    width: 80%;
    display: inline-block;
  }

  >>> .el-collapse-item__header {
    height: auto;
  }
}
</style>
