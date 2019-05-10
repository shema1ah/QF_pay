<template>
  <div class="login">
    <div class="switch-language">
      <el-select v-model="lang"  icon="caret-bottom" @change="switchLanguage" size="small" popperClass="popperBg" style="width:80%;">
        <el-option v-for="item in langLists" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
    <div class="content">
      <div class="head">{{$t('login.head')}}</div>
      <el-tabs v-model="userType" @tab-click="handleClick">
        <el-tab-pane :label="$t('login.tab1')" name="merchant"></el-tab-pane>
        <el-tab-pane :label="$t('login.tab2')" name="cash"></el-tab-pane>
      </el-tabs>
      <el-form :model="merchant" :rules="merchantRules" ref="merchant" v-if="userType === 'merchant'">
        <el-form-item prop="username" class="username">
          <el-input v-model.trim="merchant.username" size="small" type="text" :placeholder="$t('login.reg')" @keyup.enter.native="onEnter"></el-input>
        </el-form-item>
        <el-form-item prop="password" class="password">
          <el-input v-model.trim="merchant.password" size="small" type="password" :placeholder="$t('login.ltsix')" @keyup.enter.native="onEnter"></el-input>
        </el-form-item>
        <div class="panel-header-btn panel-header-btn__fill" @click="login">
          <span class="el-icon-loading" v-if="loading"></span>
          <span v-else>{{$t('login.login')}}</span>
        </div>
      </el-form>
      <el-form :model="cash" :rules="cashRules" ref="cash" v-else>
        <el-form-item prop="name" class="username">
          <el-input v-model.trim="cash.name" size="small" type="text" :placeholder="$t('login.user')" @keyup.enter.native="onEnter"></el-input>
        </el-form-item>
        <el-form-item prop="opuid" class="cashier">
          <el-input v-model.trim="cash.opuid" size="small" type="text" :placeholder="$t('login.cash')" @keyup.enter.native="onEnter"></el-input>
        </el-form-item>
        <el-form-item prop="pass" class="password">
          <el-input v-model.trim="cash.pass" size="small" type="password" :placeholder="$t('login.ltsix')" @keyup.enter.native="onEnter"></el-input>
        </el-form-item>
        <div class="panel-header-btn panel-header-btn__fill" @click="login">
          <span class="el-icon-loading" v-if="loading"></span>
          <span v-else>{{$t('login.login')}}</span>
        </div>
      </el-form>
      <!-- 忘记密码 -->
      <div class="bottom">
        <router-link :to="{ name: 'overseaForget'}" class="forget">{{$t('login.forgetPwd')}}</router-link>
      </div>

    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import config from 'config';
  import { getRole, getCookie, clearCookie, getParams } from '../../common/js/util';
  import Store from '../../common/js/store';
  export default {
    data() {
      return {
        lang: config.lang,
        role: Store.get('role') || {},
        langLists: [
          {label: '日本語', value: 'ja'},
          {label: 'English', value: 'en'},
          {label: '繁體中文', value: 'zh-TW'},
          {label: '简体中文', value: 'zh-CN'}
        ],
        loading: false,
        userType: 'merchant',
        merchant: {
          username: '',
          password: '',
          format: 'cors'
        },
        merchantRules: {
          username: [
            { required: true, message: this.$t('login.msg.m1') }
          ],
          password: [
            { required: true, message: this.$t('login.msg.m2') }
          ]
        },
        cash: {
          name: '',
          opuid: '',
          pass: ''
        },
        cashRules: {
          name: [
            { required: true, message: this.$t('login.msg.m4') }
          ],
          opuid: [
            { required: true, message: this.$t('login.msg.m5') }
          ],
          pass: [
            { required: true, message: this.$t('login.msg.m2') }
          ]
        }
      };
    },

    created() {
      let token = getParams('t');
      if(token) {
        // 其它地址跳转过来的，之前有session的先清除
        getCookie('sessionid') && clearCookie('sessionid', config.oHost);

        let host = {
          host: getParams('host'),
          oHost: getParams('oHost'),
          payHost: getParams('payHost'),
        };
        Store.set('hosts', host);
        Object.assign(config, host);
        this.oldSign(token, true);
      }else if(getCookie('sessionid')) {
        if(Store.get('flag')) {
          // 退出之后清除session
          clearCookie('sessionid', config.oHost);
        }else {
          // cookie存在跳转首页
          this.$router.push('/main/index');
        }
      }

      // 浏览器兼容模式下，提示
      /* if(this.isIe() && !this.checkBrowser()) {
          this.$message({
            message: '为保证系统的正常使用，建议您将浏览器升级到最新版本并且切换至急速模式。',
            duration: 0,
            type: 'error'
          });
      } */
    },

    methods: {
      // 切换语言
      switchLanguage(value, label) {
        localStorage.setItem("lang", JSON.stringify({label: label, value: value}));
        window.location.reload()
      },

      // 点击登录
      login() {
        this.$refs[this.userType].validate((valid) => {
          if(!this.loading && valid) {
            let params;
            if(this.userType === 'merchant') {
              params = this.merchant;
            }else {
              let cash = this.cash;
              params = {
                username: cash.name,
                opuid: cash.opuid,
                password: cash.pass
              };
            }
            this.loading = true;
            if(location.hostname.includes('jp.qfapi') || process.env.NODE_ENV === 'development') {
              this.oldSign(params, false);
            }else {
              this.getAppName(params);
            }
          }
        });
      },

      // 登录
      oldSign(param, flag) {
        let [params, uri] = [];
        // 新登录接口
        if(flag) {
          params = {
            login_token: param
          };
          uri = 'merchant/v1/login';
        }else {
          // 老登录接口
          params = param;
          uri = 'merchant/login';
        }
        axios.post(`${config.host}/${uri}`, Object.assign({}, params, {
          format: 'cors'
        })).then((res) => {
          this.loading = false;
          let data = res.data;
          if(data.respcd === config.code.OK) {
            let val = getRole(data.data);
            this.$store.state.role = val;
            Store.set('role', val);
            Store.set('flag', false);

            // 进行是否是首次登录的判断，返回need_change_pwd字段，1为需要重置，0为不需要重置
            let needChangePwd = data.data.need_change_pwd;
            if(needChangePwd) {
              setTimeout(() => {
                this.$router.push('/firstlogin');
              }, 0)
            } else {
              setTimeout(() => {
                this.$router.push('/main/index');
              }, 0)
            }

          } else {
            this.$router.push('/login');
            this.$message.error(data.resperr);
          }
        }).catch(() => {
          this.loading = false;
          this.$router.push('/login');
          this.$message.error(this.$t('login.msg.m3'));
        });
      },

      // 迁移商户下发域名
      newSign(params) {
        let hostName = location.hostname;
        axios.post('https://g.qfapi.com/gr/v1/login', Object.assign({}, params, {
          format: 'cors'
        })).then((res) => {
          let data = res.data;
          if(data.respcd === config.code.OK) {
            let con = data.data || {};
            let token = con.token;

            let hosts = con.server;
            let host = {
              host: hosts.sh.addrs[0].addr,
              oHost: hosts.o.addrs[0].addr,
              payHost: hosts.openapi.addrs[0].addr,
            };

            // 不包括新加坡白牌
            if(!host.host.includes(hostName) && !hostName.includes('wimerchant.com')) {
              this.loading = false;
              // 北京global跳转
              if(hostName.includes('qfpay.com')) {
                window.location.href = `${host.host}#/login?t=${token}&host=${host.host}&oHost=${host.oHost}&payHost=${host.payHost}`;
              } else {
                // 其它域名不跳转，提示商户不存在
                this.$message.error(this.$t('login.msg.m6'));
              }
              return;
            }

            Store.set('hosts', host);
            Object.assign(config, host);
            this.oldSign(token, true);
          } else {
            this.loading = false;
            this.$message.error(data.resperr);
          }
        }).catch(() => {
          this.loading = false;
          this.$message.error(this.$t('login.msg.m3'));
        });
      },

      // 判断app_name
      getAppName(params) {
        let hostName = location.hostname;

        // appName对应列表
        let list = {
          'sh-hk.qfapi.com': 'hk_web',
          // 'sh-jp.qfapi.com': 'jp_web',
          'sh-db.qfapi.com': 'db_web',
          'sh-th.qfapi.com': 'th_web',
          'sh-sg.qfapi.com': 'sg_web',
          'wimerchant.com': 'sg_web',
          'sh-sh-t.qfapi.com': 'shh_t_web',
          'sh-sz-t.qfapi.com': 'shz_t_web'
        };
        let appName = list[hostName] || 'zh_web';

        Object.assign(params, {
          app_name: appName
        });
        this.newSign(params);
      },

      // 点击enter键调用登录
      onEnter() {
          this.login();
      },

      // 切换标签清除表单
      handleClick(event) {
        if(event.name === 'cash') {
          this.$refs['merchant'] && this.$refs['merchant'].resetFields();
        }else {
          this.$refs['cash'] && this.$refs['cash'].resetFields();
        }
      },

      // 是否为IE内核
      isIe() {
        return ("ActiveXObject" in window);
      },

      // IE还是兼容模式
      checkBrowser() {
          let lastInfo = navigator.userAgent.split(";").pop();
          if(lastInfo.indexOf("NET") > -1) {
            return true;
          }else {
            return false;
          }
      }
    }
  };
</script>

<style lang="scss">
  .login {
    height: 100%;
    background: #2A2A2A url("./img/bg.png") no-repeat 20px bottom;

    .switch-language {
      position: fixed;
      right: 50px;
      top: 50px;
      text-align: center;
      font-size: 14px;
    }
    .content {
      width: 500px;
      height: auto;
      border: 1px solid #979797;
      border-radius: 4px;
      background: #fff;
      position: relative;
      top: 20%;
      margin: auto;

      .head {
        color: #2F323A;
        font-size: 24px;
        text-align: center;
        padding: 30px 0;
        background: #F7F7F7;
      }

      .el-form {
        padding: 0 80px;
      }

      .el-form-item {
        border-bottom: 1px solid #2F323A;
        margin-bottom: 25px;

        .el-form-item__error {
          padding-top: 10px;
        }
      }

      .el-input {
        padding-left: 30px;
        box-sizing: border-box;
      }
      .username {
        background: url("./img/phone.png") no-repeat left center;
        background-size: 24px;
      }

      .el-input__inner {
        box-sizing: border-box;
        height: 21px;
        color: #2F323A;
        font-weight: 200;
        padding: 0 10px 0 0;
        font-size: 15px;
        line-height: 1;
        border: none;
        margin-bottom: 5px;
        background-color: transparent;
        outline: none;
        display:inline-block;
      }

      .cashier {
        background: url("./img/cashier.png") no-repeat left center;
        background-size: 24px;
      }
      .password {
        background: url("./img/password.png") no-repeat left center;
        background-size: 24px;
      }
      .panel-header-btn {
        width: 100%;
        height: 44px;
        line-height: 44px;
        margin: 25px 0;
        float: none;
      }

      .bottom {
        text-align: center;
        font-size: 17px;
        margin: 20px 0;

        span {
          padding: 0 15px;
        }

        .forget {
          color: #606470;
          &:hover {
             color: darken(#606470,10%);
           }
        }
        .register {
          color: #FE9B20;
          &:hover {
            color: darken(#FE9B20,10%);
           }
        }

      }
    }

    .el-tabs {
      .el-tabs__header {
        border: none;
      }
      .el-tabs__nav-wrap {
        margin: 0
      }
      .el-tabs__nav-scroll {
        padding: 0 80px;
      }
      .el-tabs__nav {
        display: flex;
        float: none;
        width: 100%;
      }
      .el-tabs__item {
        font-size: 20px;
        flex: 1;
        height: 55px;
        line-height: 55px;
        text-align: center;

      }
    }
  }
</style>
