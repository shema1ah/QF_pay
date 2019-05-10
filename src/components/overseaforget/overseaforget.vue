<template lang="html">
  <div class="hwforget">
    <div class="head">{{ $t('nav.mmp') }}</div>
    <div class="tip">
      <p v-if="isNext">{{ $t('overseaForget.enterEmail') }}</p>
      <p v-else>{{ $t('overseaForget.text1') }}<span>{{ emailAddr }}</span>,{{ $t('overseaForget.text2') }}</p>
    </div>
    <el-form :model='form' :rules='formrules' ref="form">
      <!-- next -->
      <!-- email -->
      <el-form-item :label="$t('overseaForget.emailAddr')" prop="email" v-if="isNext">
        <el-input v-model="form.email" @keyup.enter.native="onEnter" id="email"></el-input>
        <span class="del" v-if="isErr">+</span>
      </el-form-item>
      <!-- Confirm -->
      <!-- 验证码 -->
      <el-form-item :label="$t('overseaForget.code')" prop="vCode" v-if="!isNext">
        <el-input v-model="form.vCode" auto-complete="new-password"></el-input>
        <span class="del" v-if="isErr2">+</span>
        <p class="count" v-if="resend">{{ $t('overseaForget.secend1') + countDown + $t('overseaForget.secend2') }}</p>
        <p class="count resend" v-if="!resend" @click="resendCode()">{{ $t('overseaForget.resend') }}</p>
      </el-form-item>
      <!-- 新密码 -->
      <el-form-item :label="$t('overseaForget.newPwd')" v-if="!isNext" prop="newPassword">
        <el-input type="password" v-model="form.newPassword" auto-complete="new-password"></el-input>
      </el-form-item>

      <div class="panel-header-btn panel-header-btn__fill" @click="isNext ? handleNext('form') : confirm('form')">
        <span class="el-icon-loading" v-if="loading"></span>
        <span v-else>{{ isNext ? $t('overseaForget.next') : $t('overseaForget.confirm') }}</span>
      </div>

    </el-form>
  </div>
</template>
<script>
import axios from 'axios';
import config from 'config';
import qs from 'qs';

export default {
  data() {
    // 邮箱验证
    let emailValid = (rul, val, cb) => {
      if (val === '') {
        cb(this.$t('overseaForget.enterEmail'))
      } else if(!/^[\w-]+[\w-.]*@[a-zA-Z\d-]+(\.[a-zA-Z\d-]+)*\.[a-zA-Z\d]{2,6}$/.test(val)) {
        // 不满足邮箱的格式，出现错误提示信息
        this.isErr = true;
        cb(this.$t('overseaForget.invalidEmail'));
      }else{
        this.isErr = false;
        cb();
      }
    };
    // 验证码验证
    let vCodeValid = (rul, val, cb) => {
      if( val === '') {
        cb(this.$t('overseaForget.filledCode'))
      } else {
        let param = {
          email: this.form.email,
          code: val,
          format: 'cors'
        }
        this.checkCode(param, (data) => {
          if(data.respcd === config.code.OK) {
            this.isErr2 = false;
            cb();
          }else{
            this.isErr2 = true;
            cb(data.respmsg);
          }
        });
      }
    };
    //  密码
    let passValid = (rul, val, cb) => {
      if( val === '') {
        cb(this.$t('shopmng.dialog.msg.m1'));
      } else {
        cb();
      }
    }
    return {
      isNext: true,
      loading: false,
      isErr: false,
      isErr2: false,
      resend: true,
      emailAddr: '',
      countDown: 60,
      form: {
        email: '',
        vCode: '',
        newPassword: ''
      },
      formrules: {
        email: [
          { validator: emailValid, trigger: 'blur' }
        ],
        vCode: [
          { validator: vCodeValid, trigger: 'blur' }
        ],
        newPassword: [
          { validator: passValid, trigger: 'blur' },
          { max: 20, min: 6, message: this.$t('overseaForget.char'), trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    // 倒计时
    count() {
      this.resend = true;
      var timer = setInterval(() => {
        this.countDown -= 1;
        // 小于0的时候关闭计时器
        if(this.countDown < 0) {
          clearInterval(timer);
          this.countDown = 60;
          this.resend = false;
        }
      }, 1000);
    },

    // 点击next按钮
    handleNext(formname) {
      this.$refs[formname].validateField('email', (valid) => {
          if (valid === '' && !this.loading) {
            this.loading = true;
            // 向邮箱发送验证码
            this.sendCode();
            // 倒计时
            this.count();
          } else {
            return false;
          }
      });
    },

    // 点击再次发送验证码按钮
    resendCode() {
      this.loading = true;
      this.sendCode();
      this.count();
    },

    // 发送验证码
    sendCode() {
      let param = {
        email: this.form.email,
        format: 'cors'
      };
      axios.get(`${config.oHost}/mchnt/emailcode/send`, {
        params: param
      }).then((res) => {
        this.loading = false;
        // 发送成功
        if(res.data.respcd === config.code.OK) {
          // 切换出验证的表单
          this.isNext = false;
          // 隐藏@前的三位
          let arr = this.form.email.split("@");
          arr[0] = arr[0].substring(0, arr[0].length - 3) + "***";
          this.emailAddr = arr.join("@");
          this.$message({
            type: 'success',
            message: this.$t('overseaForget.codeResent')
          })
        } else {
          this.$message.error(res.data.respmsg);
        }
      }).catch(() => {
        this.$message.error(this.$t('common.netError'));
        this.loading = false;
      });
    },

    // 验证码验证
    checkCode(param, cb) {
      axios.post(`${config.oHost}/mchnt/smscode/check`, qs.stringify(param), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        if(res.data.respcd === config.code.OK) {
          cb(res.data);
          this.isErr2 = false;
        } else {
          this.isErr2 = true;
          this.$message.error(res.data.respmsg)
        }
      }).catch(() => {
        this.$message.error(this.$t('common.netError'));
      });
    },

    // 提交
    confirm(formname) {
      this.$refs[formname].validate((valid) => {
        if(valid && !this.loading) {
          this.loading = true;
          let param = {
            username: this.form.email,
            code: this.form.vCode,
            password: this.form.newPassword,
            format: 'cors'
          }
          axios.post(`${config.oHost}/mchnt/user/reset_pwd`, qs.stringify(param), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then((res) => {
            if(res.data.respcd === config.code.OK) {
              this.$message({
                type: 'success',
                message: this.$t('common.modSucc')
              })
              // 跳转至登录页面
              setTimeout(() => {
                this.loading = false;
                this.$router.push('/login')
              }, 2000)
            } else {
              this.loading = false;
              this.$message.error(res.data.respmsg);
            }
          }).catch(() => {
            this.loading = false;
            this.$message.error(this.$t('common.netError'));
          });
        } else {
          this.$message.error(this.$t('common.modFailed'));
          return false;
        }

      })
    },

    //  点击回车
    onEnter() {
        if(this.isNext) {
          this.handleNext('form');
        } else {
          this.confirm('form');
        }
    },
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
      padding: 100px 0 50px;
      font-size:18px;
      font-family:PingFangSC-Semibold;
      color:rgba(0,0,0,1);
      line-height:25px;
      span{
        color: #3878DE;
      }
    }
    .el-form {
      width: 350px;
      margin: auto;

      .el-form-item {
        margin-bottom: 20px;
        position: relative;
        .count {
          color: #9B9B9B;
          text-align: right;
        }
        .resend {
          color: #FE9B20;
          cursor: pointer;
        }
        .del{
          display:block;
          width: 20px;
          height:20px;
          border-radius:10px;
          position:absolute;
          background: red;
          top:34px;
          right:12px;
          text-align: center;
          line-height:15px;
          font-size:20px;
          font-weight:900;
          color:#fff;
          transform:rotate(45deg);
        }
      }
      .el-input__inner {
        width: 350px;
        height: 44px;
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
