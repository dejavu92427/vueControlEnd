<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">{{`${this.title}管理后台`}}</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
          
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model.trim="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          maxlength="12"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="login"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >Login</el-button>

      <div class="tips">
        <!--
        <span style="margin-right:20px;">
          username: test1
          <br />password: 1234
        </span>
        -->
      </div>
    </el-form>

    <!-- *** Arvin Captcha Check **************************-->
    <el-dialog :close-on-click-modal="false" :visible.sync="captchaCodeDialogVisible" class="captCode"
      :title="'UB Auth驗證'" @close='checkCaptchaCode' @submit.native.prevent>
      <el-form v-if="captchaCodeDialogVisible" label-width="100px" >
        <el-form-item prop="captchaCode">
          <el-input 
            ref="captchaCode"
            v-model="captchaForm.captchaCode"
            placeholder="輸入驗證碼"
            maxlength="6"
            name="captchaCode"
            class="el-input-dialog"
             @keyup.enter.native="captchaCodeDialogVisible=false"            
            />
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button type="primary" style="width:80px;" @click.native.prevent="captchaCodeDialogVisible=false;">確認</el-button>
      </div>
    </el-dialog>


    <el-dialog title="手機掃瞄QR Code註冊裝置" :visible.sync="qrCodeDialogVisible"  @close='closeQRCode' class="qrCode">
      <div style="padding-left :27px;">
      <div id="qrcode"></div>
      </div>      
      <div style="text-align:center;">
      <br/><br/>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" style="width:80%;" @click="closeQRCode">確定</el-button>
      </span>
      </div>
    </el-dialog>
    
    <!-- *** Arvin Captcha Check **************************-->
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import store from "@/store";
//import { health } from '@/api/user'
import QRCode from 'qrcodejs2';

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("請輸入正確的帳號密碼"));
      } else {
        callback();
      }
    };

    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }

    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密碼不得少於6碼"));
      } else {
        callback();
      }
    };
    return {
      captchaCodeDialogVisible:false,
      qrCodeDialogVisible:false,
      loginForm: {
        username: "",
        password: "",
        domain: "",
      },
      captchaForm: {
        captchaCode: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
    };
  },
  created() {
    this.logout();
   // var res = health();
  },
  computed: {
    title() {
      if (this.$store.getters.getAppconfig)
        return this.$store.getters.appconfig.title;
      else return "";
    },
  },
  mounted() {
    //  this.getTitle();
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    getTitle() {
      if (this.$store.getters.getAppconfig)
        this.title = this.$store.getters.appconfig.title;
    },
    async logout() {
      await this.$store.dispatch("removeRoute");
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    UbAuthDeviceCheck(authAccount){  //20210324 UBAuth
      //檢查裝置
      this.$store.dispatch("user/CheckDevice", authAccount)
      .then(info => {    
        if(info.status == '000' && info.errorCode == '00') {
          if(info.data.isRegistered == false){
            //註冊裝置
            var registerQRcode = decodeURIComponent(info.data.qrcodeStr);
            // console.log('[registerQRcode] '+registerQRcode)
            this.initQRCode(registerQRcode);
          }
          else {
            //輸入驗證碼
            this.showCaptcha();   
          } 
        }
      })
    },    
    validateCaptcha(info) {  //20210324 UBAuth      
      const vendorUBAuthCheck = this.$store.getters.appconfig.vendorUBAuthCheck;//目前廳別是否需要檢查ubauth
      var logmsg = 'validateCaptcha..... [account] '+ info.account +' [auth] '+ info.auth +'[vendorUBAuthCheck] '+vendorUBAuthCheck;
      if(info.auth == 'N' || vendorUBAuthCheck == false) {//不檢查UB Auth
        // console.log(logmsg);
        this.forwardRouter_S(this.loginForm);
        return;
      }
      
      // *****************  UBAuth  ***************
      var authAccount = this.$store.getters.appconfig.domainUBAuth +'_'+ this.loginForm.username
      //var authAccount = this.loginForm.username
      this.$store.dispatch("user/GetAccount", authAccount)
      .then(info => {     
        if(info.status == '000' && info.errorCode == '00') {          
          // console.log(logmsg + ' [auth-type] '+ info.data.type);       
          if(info.data.type !== "9"){
            // this.$notify({
            //   title: "UB Auth帳號已停用",
            //   dangerouslyUseHTMLString: true,
            //   message: `<div>請連繫管理員!!!</div>`,
            //   type: "error"
            // });
            
            //啟用帳號
            var updAuth ={ account: authAccount,type : "9" }
            this.$store.dispatch("user/UpdateAccount", updAuth )
            .then(info => {
              this.UbAuthDeviceCheck(authAccount);//檢查是否已註冊裝置，有：輸入驗證碼，無：顯示qrcode
              // console.log(logmsg + ' [auth-type] => 9'); 
            }) 

            this.loading =false;
          }
          else {
            this.UbAuthDeviceCheck(authAccount);//檢查是否已註冊裝置，有：輸入驗證碼，無：顯示qrcode
          }
        }        
      })
      .catch((error) => {
        //ubauth帳號不存在時自動建立  500015arvin_chen
        var auth ={ account:[ authAccount ] }
        this.$store.dispatch("user/CreateAccount", auth )
        .then(info => {   
          this.UbAuthDeviceCheck(authAccount)   
        })
      });      
    },
    closeQRCode() {  //20210324 UBAuth
      this.qrCodeDialogVisible=false;
      this.loading=false;
    },
    initQRCode(url) {  //20210324 UBAuth
      this.qrCodeDialogVisible = true;
      const qrsize = 200;
      this.$nextTick(function () {        
        document.getElementById("qrcode").innerHTML = "";
        let qrcode = new QRCode("qrcode", {
          width: qrsize,
          height: qrsize,
          text: url,
          colorDark: "#000",
          colorLight: "white"
        });
      });
    },
    showCaptcha() {  //20210324 UBAuth
      this.captchaForm.captchaCode = '';
      this.captchaCodeDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.captchaCode.focus();
      });
    },
    checkCaptchaCode() {  //20210324 UBAuth
      if(this.captchaForm.captchaCode == '') {
        this.loading = false;
        return;
      }
      if(this.captchaForm.captchaCode.length !== 6){
        this.loading = false;
        this.$notify({
          title: "驗證碼錯誤",
          dangerouslyUseHTMLString: true,
          message: `<div>驗證碼為6碼，請重新登入</div>`,
          type: "error"
        });
        return;
      }      
      
      var authAccount = this.$store.getters.appconfig.domainUBAuth +'_'+ this.loginForm.username
      var verifyInfo ={
        account: authAccount,
        code: this.captchaForm.captchaCode
      }
      this.$store.dispatch("user/VerifyCode", verifyInfo)
      .then(info => {     
        if(info.status == '000' && info.errorCode == '00') {
          if(info.errors == undefined){
            this.loginForm.auth = "defaultY";
            this.forwardRouter_S(this.loginForm);
          }
          else
          {
            this.logout();
            this.$notify({
              title: "驗證碼錯誤",
              dangerouslyUseHTMLString: true,
              message: `<div>驗證失敗，請重新登入</div>`,
              type: "error"
            });
          }
        }
      })
      .catch((error) => {
        this.logout();
        this.$notify({
          title: "驗證碼錯誤!",
          dangerouslyUseHTMLString: true,
          message: `<div>驗證失敗，請重新登入</div>`,
          type: "error"
        });
      });    
    },
    //登入成功，導頁
    forwardRouter_S(formData) { 
      // console.log('captchaCode success');
      this.$store
        .dispatch("user/commitUser", formData)/* commitUser */
        .then(info => {              
          sessionStorage.removeItem("thirdOutSrc")   
          this.$router.push({ path: this.redirect || "/" });
          this.loading = false;
        })
    }, 
    async handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.loginForm.domain = this.$store.getters.appconfig.domain;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(info => {
              this.validateCaptcha(info);
              this.loading = false;
              // sessionStorage.removeItem("thirdOutSrc")
              // this.$router.push({ path: this.redirect || "/" });
               
            })
            .catch((error) => {
              this.loading = false;

              this.$notify({
                title: "登入失敗！",
                dangerouslyUseHTMLString: true,
                message: error,
                type: "error",
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: rgb(4, 52, 58);
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {      
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }  

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }

  .el-dialog .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    margin: 0 0 0 0;

    input {
      text-align: right;
      background: white;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #000;
      height: 47px;
      caret-color: #000;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #000 !important;
      }
    }
  }

  .el-dialog .el-form-item {
    border: 1px solid gray;
    background: white;
    border-radius: 6px;
    color: white;
    margin-left: 0px !important;
  }

  .el-dialog__wrapper.captCode .el-dialog {
    transform: none;
    // position: relative;
    position:absolute;
    left: 43%;
    margin: 0 auto;
    width:250px;
    min-width: 250px;
    top:6%;
  }

  .el-dialog__wrapper.qrCode .el-dialog {
    transform: none;
    // position: relative;
    position:absolute;
    left: 42%;
    margin: 0 auto;
    width:300px;
    min-width: 300px;
    top:-10px;
  }
  
}
</style>

<style lang="scss" scoped>
$bg:#013A40;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

    .el-form-item .el-form-item__content {
    margin-left: 30px !important;
   }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

.el-button--login.is-active,
.el-button--login:active {
  background: #BF6341;
  border-color: #BF6341;
  color: #fff;
}

.el-button--login:focus,
.el-button--login:hover {
  background: #BF6341;
  border-color: #BF6341;
  color: #fff;
}

.el-button--login {
  color: #FFF;
  background-color: #6BBF90;
  border-color: #6BBF90;
}

}
</style>
