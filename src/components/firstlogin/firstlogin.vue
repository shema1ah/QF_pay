<template lang="html">
  <div class="hwforget">
    <div class="head">{{ $t('nav.mmp') }}</div>
    <div class="tip">
      <p>{{ $t('firstlogin.congratulation') }}</p>
      <p class="tipTwo">{{ $t('firstlogin.changePwd') }}</p>
    </div>
    <el-form :model='form' :rules='formrules' ref="form">
      <!-- 密码 -->
      <el-form-item :label="$t('firstlogin.newPwd')" prop="newPassword">
        <el-input :type="inputType" v-model="form.newPassword" id="pwd"></el-input>
        <span class="pwdIcon" :class="{'open': inputChange}" @click="changeType()" ></span>
      </el-form-item>
      <!-- 密码验证 -->
      <el-form-item :label="$t('firstlogin.rePwd')" prop="comfirmPassword">
        <el-input :type="inputType2" v-model="form.comfirmPassword" id="repwd"></el-input>
        <span class="pwdIcon" :class="{'open': inputChange2}" @click="changeType2()"></span>
      </el-form-item>
      <div class="panel-header-btn panel-header-btn__fill" id="confirmBtn" @click="handleSubmit('form', $event)">
        <span>{{ $t('firstlogin.confirm') }}</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';
import Store from '../../common/js/store';
import config from '../../config';

export default {
  data() {
    let passValid = (rule, val, cb) => {
      if(val === '') {
        cb(this.$t('shopmng.dialog.msg.m2'));
      } else {
        if(this.form.comfirmPassword !== '') {
          this.$refs['form'].validateField('comfirmPassword');
        }
        cb();
      }
    };
    let repassValid = (rule, val, cb) => {
      if(this.form.newPassword && this.form.newPassword !== val) {
        cb(this.$t('shopmng.dialog.msg.m3'));
      } else {
        cb();
      }
    };
    return {
      inputChange: false,
      inputChange2: false,
      inputType: 'password',
      inputType2: 'password',
      role: Store.get('role') || {},
      // 修改密码所需参数
      param: {
        mobile: '',
        password: '',
        mode: 'change',
        username: '',
        src: 'mchnt',
        format: 'cors'
      },
      form: {
        newPassword: '',
        comfirmPassword: ''
      },
      formrules: {
        newPassword: [
          { validator: passValid },
          {max: 20, min: 6, message: this.$t('overseaForget.char'), trigger: 'blur'}
        ],
        comfirmPassword: [
          { validator: repassValid },
          // {max: 20, min: 6, message: this.$t('overseaForget.char'), trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.getData();
  },
  methods: {
    // 改变密码输入框的状态，让密码显示或隐藏
    changeType() {
      this.inputChange = !this.inputChange;
      if(this.inputChange) {
        this.inputType = 'text';
      } else {
        this.inputType = 'password';
      }
    },
    changeType2() {
      this.inputChange2 = !this.inputChange2;
      if(this.inputChange2) {
        this.inputType2 = 'text';
      } else {
        this.inputType2 = 'password';
      }
    },

    // 点击提交修改密码
    handleSubmit(formname, e) {
      let _confirmBtn = e.target;
      this.param.password = this.form.newPassword;
      if(_confirmBtn.getAttribute("locked") == 'true') return;
      this.locked(_confirmBtn, false);
      this.$refs[formname].validate((valid) => {
          if (valid) {
            // debugger;
            axios.post(`${config.oHost}/mchnt/user/reset_pwd`, this.param).then((res) => {
              let data = res.data;
              if (data.respcd === config.code.OK) {
                this.$message({
                  type: 'success',
                  message: this.$t('common.modSucc')
                });
                this.locked(_confirmBtn, true);
                setTimeout(() => {
                  this.logout();
                }, 3000)
              } else {
                this.locked(_confirmBtn, false);
                this.$message.error(data.respmsg);
              }
            }).catch(() => {
              this.locked(_confirmBtn, false);
              this.$message.error(this.$t('common.netError'));
            });
          } else {
            // 提交失败
            this.locked(_confirmBtn, false);
            this.$message.error(this.$t('common.modFailed'));
            return false;
          }
      });
    },

    // 获取数据
    getData() {
      axios.get(`${config.host}/merchant/info`, {
        params: {
          is_abroad: 1,
          format: 'cors'
        }
      }).then((res) => {
          let data = res.data;
          // 获取修改密码时所需参数
          this.param.mobile = data.data.mobile;
          this.param.username = data.data.mobile;
        })
        .catch(() => {
          this.$message.error(this.$t('common.netError'));
        });
    },

    // 退出登录
    logout() {
      axios.get(`${config.host}/merchant/signout`)
        .then((res) => {
          let data = res.data;
          if (data.respcd === config.code.OK) {
            // 登出时删除.qfpay.com域下cookie
            (new Image()).src = `${config.oHost}/mchnt/set_cookie?sessionid=`;
            Store.set('flag', true);
            localStorage.removeItem('hashid');
            localStorage.removeItem('uid');
            var toRemoved = document.getElementById('unique_map');
            if(toRemoved) {
              toRemoved.onload = null;
              document.body.removeChild(toRemoved);
            }
            this.$router.push(`/login?from=logout&haiwai=${this.role.haiwai}`);
          } else {
            this.$message.error(data.respmsg);
          }
        }).catch(() => {
        this.$message.error(this.$t('common.netError'));
      });
    },

    // 按钮
    locked(el, type) {
      el.setAttribute("locked", type);
      if(type) {
        document.getElementById("confirmBtn").style.backgroundColor = "#ccc"
        document.getElementById("confirmBtn").style.border = "1px solid #ccc";
      } else {
        document.getElementById("confirmBtn").style.backgroundColor = "#FE9B20"
        document.getElementById("confirmBtn").style.border = "1px solid #FE9B20";
      }
    }
  }
}
</script>
<style lang="scss">
  .hwforget{
    height: 100%;
    background: url('./img/bg.png') no-repeat 20px bottom;
    .head {
      color: #FE9B20;
      font-size: 24px;
      text-align: center;
      padding: 30px 0;
      border-bottom: 2px solid #FE9B20;
    }
    .tip{
      width:350px;
      margin: auto;
      padding: 75px 0 50px;
      font-size:18px;
      font-family:PingFangSC-Semibold;
      color:rgba(0,0,0,1);
      line-height:25px;
      .tipTwo{
        padding-top: 13px;
        font-size: 14px;
        line-height: 14px;
        color: #FF8100;
      }
    }
    .el-form {
      width: 350px;
      margin: auto;
      .el-form-item {
        margin-bottom: 25px;
        position: relative;
        .pwdIcon{
          display: block;
          position: absolute;
          width: 25px;
          height: 25px;
          background-image: url('img/icon_close.png');
          top: 30px;
          right: 9px;
          &.open {
            background-image: url('img/icon_open.png');
          }
        }
      }
      .el-input__inner {
        width: 350px;
        height: 44px;
        margin-bottom: 5px;
      }
      .el-form-item__label {
        font-size: 16px;
        padding: 0;
        text-align: left;
        line-height: 16px;
        color: #606470;
        margin-bottom: 5px;
      }
      .el-form-item__content {
        width: 100%;
        line-height: 1;
      }
      .panel-header-btn {
        padding:0;
        width: 100%;
        height: 40px;
        line-height: 40px;
        margin-top: 30px;
      }
    }
  }
</style>
