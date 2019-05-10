<template>
  <div class="sidebar">
    <div class="sidebar-logo__wrapper">
      <img src="data:image/png;base64,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" alt="logo" class="sidebar-img"/>
      <!-- <h1 class="sidebar-logo__title">{{ shop.shopname }}</h1> -->
    </div>
    <ul class="left-nav">
      <li v-for="nav in navs">
        <router-link class="sidebar-nav__item" v-if="nav.pathname" :to="router('main/' + nav.pathname)">{{ nav.val }}</router-link>
        <a v-else class="sidebar-nav__item" @click="toggle(nav.subnav)" :class="{'dark': $route.fullPath.indexOf(nav.subnav) > -1}">
          {{ nav.val }}
          <i v-if="nav.sub" class="icon-down_arrow" :class="{'icon-down_arrow__rotate': !isDark[nav.subnav]}"></i>
        </a>
        <transition name="collpase">
          <ul v-if="nav.sub" v-show="isDark[nav.subnav]" class="collpase" :class="{'dark': $route.fullPath.indexOf(nav.subnav) > -1}">
            <li v-for="ls in nav.sub">
              <router-link class="sidebar-nav__item sidebar-nav__subitem" :to="router('main/' + ls.pathname)">
                {{ ls.val }}
              </router-link>
            </li>
          </ul>
        </transition>
      </li>
    </ul>
    <div class="copyright_wrapper" v-if="role.haiwai">
      <el-select v-model="lang"  icon="caret-bottom" @change="switchLanguage" size="small" popperClass="popperBg" style="width:80%;">
        <el-option v-for="item in langLists" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
  import Store from '../../common/js/store';
  import config from 'src/config';
  export default {
    data() {
      return {
        lang: config.lang,
        role: Store.get('role') || {},
        navs: [],
        isDark: {
          trans: true,
          Setting: true
        },
        langLists: [
          {label: '日本語', value: 'ja'},
          {label: 'English', value: 'en'},
          {label: '繁體中文', value: 'zh-TW'},
          {label: '简体中文', value: 'zh-CN'}
          ]
      };
    },

    props: {
      shop: {
        type: Object
      }
    },

    created() {
      this.getNav();
    },

    methods: {
      switchLanguage(value, label) {
        localStorage.setItem("lang", JSON.stringify({label: label, value: value}));
        window.location.reload()
      },
      router(router) {
        return `/${router}`;
      },

      toggle(val) {
        this.isDark[val] = !this.isDark[val];
      },

      getNav() {
        switch (this.role.country) {
          case 'HK':
            if(this.role.single) { // 香港单店,无收银员管理
              if(this.role.isCashier) { // 是收营员
                this.navs = [
                  {
                    val: this.$t('nav.tradeMng'), // 交易管理
                    pathname: 'transctl'
                  },
                  {
                    val: this.$t('nav.shopMng'), // 账户信息
                    pathname: 'singlemanage'
                  },
                  {
                    val: this.$t('nav.contact'), // 客服
                    pathname: 'contact'
                  }
                ];
              } else { // 不是收营员
                if(this.role.isMerchant) { // 单店
                  this.navs = [
                    {
                      val: this.$t('nav.index'), // 首页
                      pathname: 'index'
                    },
                    {
                      val: this.$t('nav.settlement'), // 清算查询
                      pathname: 'settlement'
                    },
                    {
                      val: this.$t('nav.tradeMng'), // 交易管理
                      subnav: 'trans',
                      sub: [{
                        val: this.$t('nav.tradeAssign'), // 交易流水
                        pathname: 'transctl'
                      }, {
                        val: this.$t('nav.refundCheck'), // 退款审核
                        pathname: 'transCheck'
                      }]
                    },
                    {
                      val: this.$t('nav.shopMng'), // 账户信息
                      pathname: 'singlemanage'
                    },
                    {
                      val: this.$t('nav.setup'), // 设置
                      subnav: 'Setting',
                      sub: [{
                        val: this.$t('nav.emailSet'), // 邮箱设置
                        pathname: 'emailSetting'
                      }, {
                        val: this.$t('nav.device'), // 绑定设备编号
                        pathname: 'deviceSetting'
                      }]
                    },
                    {
                      val: this.$t('nav.contact'), // 客服
                      pathname: 'contact'
                    }
                  ];
                }else { // 分店
                  this.navs = [
                    {
                      val: this.$t('nav.index'), // 首页
                      pathname: 'index'
                    },
                    {
                      val: this.$t('nav.tradeMng'), // 交易管理
                      pathname: 'transctl'
                    },
                    {
                      val: this.$t('nav.shopMng'), // 账户信息
                      pathname: 'singlemanage'
                    },
                    {
                      val: this.$t('nav.emailSet'), // 邮箱设置
                      pathname: 'emailSetting'
                    },
                    {
                      val: this.$t('nav.contact'), // 客服
                      pathname: 'contact'
                    }
                  ];
                }

              }
            } else { // 香港大商户
              this.navs = [
                {
                  val: this.$t('nav.index'), // 首页
                  pathname: 'index'
                },
                {
                  val: this.$t('nav.settlement'), // 清算查询
                  pathname: 'settlement'
                },
                {
                  val: this.$t('nav.tradeMng'), // 交易管理
                  subnav: 'trans',
                  sub: [{
                    val: this.$t('nav.tradeAssign'), // 交易流水
                    pathname: 'transctl'
                  }, {
                    val: this.$t('nav.refundCheck'), // 退款审核
                    pathname: 'transCheck'
                  }]
                },
                {
                  val: this.$t('nav.shopMng'), // 账户信息
                  pathname: 'chainmanage'
                },
                {
                  val: this.$t('nav.setup'), // 设置
                  subnav: 'Setting',
                  sub: [{
                      val: this.$t('nav.passSet'), // 管理密码设置
                      pathname: 'passSetting'
                    }, {
                    val: this.$t('nav.emailSet'), // 邮箱设置
                    pathname: 'emailSetting'
                  }, {
                    val: this.$t('nav.device'), // 绑定设备编号
                    pathname: 'deviceSetting'
                  }]
                },
                {
                  val: this.$t('nav.contact'), // 客服
                  pathname: 'contact'
                }
              ];
            }
            break;
          case 'AR':
          case 'JP':
            if(this.role.single) { // 迪拜单店
              if(this.role.isCashier) { // 是收营员
                this.navs = [
                  {
                    val: this.$t('nav.tradeMng'), // 交易管理
                    pathname: 'transctl'
                  },
                  {
                    val: this.$t('nav.shopMng'), // 账户信息
                    pathname: 'singlemanage'
                  },
                  {
                    val: this.$t('nav.contact'), // 客服
                    pathname: 'contact'
                  }
                ];
              } else { // 不是收营员
                if(this.role.isMerchant) { // 单店
                  this.navs = [ // 单店
                    {
                      val: this.$t('nav.index'), // 首页
                      pathname: 'index'
                    },
                    {
                      val: this.$t('nav.settlement'), // 清算查询
                      pathname: 'settlement'
                    },
                    {
                      val: this.$t('nav.tradeMng'), // 交易管理
                      subnav: 'trans',
                      sub: [{
                        val: this.$t('nav.tradeAssign'), // 交易流水
                        pathname: 'transctl'
                      }, {
                        val: this.$t('nav.refundCheck'), // 退款审核
                        pathname: 'transCheck'
                      }]
                    },
                    {
                      val: this.$t('nav.shopMng'), // 账户信息
                      pathname: 'singlemanage'
                    },
                    {
                      val: this.$t('nav.cashMng'), // 收银员管理
                      pathname: 'cashiermanage'
                    },
                    {
                      val: this.$t('nav.setup'), // 设置
                      subnav: 'Setting',
                      sub: [{
                        val: this.$t('nav.emailSet'), // 邮箱设置
                        pathname: 'emailSetting'
                      }, {
                        val: this.$t('nav.device'), // 绑定设备编号
                        pathname: 'deviceSetting'
                      }]
                    },
                    {
                      val: this.$t('nav.contact'), // 客服
                      pathname: 'contact'
                    }
                  ];
                }else { // 分店
                  this.navs = [ // 单店
                    {
                      val: this.$t('nav.index'), // 首页
                      pathname: 'index'
                    },
                    {
                      val: this.$t('nav.tradeMng'), // 交易管理
                      pathname: 'transctl'
                    },
                    {
                      val: this.$t('nav.shopMng'), // 账户信息
                      pathname: 'singlemanage'
                    },
                    {
                      val: this.$t('nav.cashMng'), // 收银员管理
                      pathname: 'cashiermanage'
                    },
                    {
                      val: this.$t('nav.emailSet'), // 邮箱设置
                      pathname: 'emailSetting'
                    },
                    {
                      val: this.$t('nav.contact'), // 客服
                      pathname: 'contact'
                    }
                  ];
                }
              }
            } else { // 迪拜大商户
              this.navs = [
                {
                  val: this.$t('nav.index'), // 首页
                  pathname: 'index'
                },
                {
                  val: this.$t('nav.settlement'), // 清算查询
                  pathname: 'settlement'
                },
                {
                  val: this.$t('nav.tradeMng'), // 交易管理
                  subnav: 'trans',
                  sub: [{
                    val: this.$t('nav.tradeAssign'), // 交易流水
                    pathname: 'transctl'
                  }, {
                    val: this.$t('nav.refundCheck'), // 退款审核
                    pathname: 'transCheck'
                  }]
                },
                {
                  val: this.$t('nav.shopMng'), // 账户信息
                  pathname: 'chainmanage'
                },
                {
                  val: this.$t('nav.setup'), // 设置
                  subnav: 'Setting',
                  sub: [{
                    val: this.$t('nav.passSet'), // 管理密码设置
                    pathname: 'passSetting'
                  }, {
                    val: this.$t('nav.emailSet'), // 邮箱设置
                    pathname: 'emailSetting'
                  }, {
                    val: this.$t('nav.device'), // 绑定设备编号
                    pathname: 'deviceSetting'
                  }]
                },
                {
                  val: this.$t('nav.contact'), // 客服
                  pathname: 'contact'
                }
              ];
            }
            break;
          default:
            // 其它国家没有客服模块
            if(this.role.single) { // 其它国家 单店
              if(this.role.isCashier) { // 是收营员
                this.navs = [
                  {
                    val: this.$t('nav.tradeMng'), // 交易管理
                    pathname: 'transctl'
                  },
                  {
                    val: this.$t('nav.shopMng'), // 账户信息
                    pathname: 'singlemanage'
                  }
                ];
              } else { // 不是收营员
                if(this.role.isMerchant) { // 单店
                  this.navs = [ // 单店
                    {
                      val: this.$t('nav.index'), // 首页
                      pathname: 'index'
                    },
                    {
                      val: this.$t('nav.settlement'), // 清算查询
                      pathname: 'settlement'
                    },
                    {
                      val: this.$t('nav.tradeMng'), // 交易管理
                      subnav: 'trans',
                      sub: [{
                        val: this.$t('nav.tradeAssign'), // 交易流水
                        pathname: 'transctl'
                      }, {
                        val: this.$t('nav.refundCheck'), // 退款审核
                        pathname: 'transCheck'
                      }]
                    },
                    {
                      val: this.$t('nav.shopMng'), // 账户信息
                      pathname: 'singlemanage'
                    },
                    {
                      val: this.$t('nav.cashMng'), // 收银员管理
                      pathname: 'cashiermanage'
                    },
                    {
                      val: this.$t('nav.setup'), // 设置
                      subnav: 'Setting',
                      sub: [{
                        val: this.$t('nav.emailSet'), // 邮箱设置
                        pathname: 'emailSetting'
                      }, {
                        val: this.$t('nav.device'), // 绑定设备编号
                        pathname: 'deviceSetting'
                      }]
                    }
                  ];
                }else { // 分店
                  this.navs = [ // 单店
                    {
                      val: this.$t('nav.index'), // 首页
                      pathname: 'index'
                    },
                    {
                      val: this.$t('nav.tradeMng'), // 交易管理
                      pathname: 'transctl'
                    },
                    {
                      val: this.$t('nav.shopMng'), // 账户信息
                      pathname: 'singlemanage'
                    },
                    {
                      val: this.$t('nav.cashMng'), // 收银员管理
                      pathname: 'cashiermanage'
                    },
                    {
                      val: this.$t('nav.emailSet'), // 邮箱设置
                      pathname: 'emailSetting'
                    }
                  ];
                }
              }
            } else { // 其它国家大商户
              this.navs = [
                {
                  val: this.$t('nav.index'), // 首页
                  pathname: 'index'
                },
                {
                  val: this.$t('nav.settlement'), // 清算查询
                  pathname: 'settlement'
                },
                {
                  val: this.$t('nav.tradeMng'), // 交易管理
                  subnav: 'trans',
                  sub: [{
                    val: this.$t('nav.tradeAssign'), // 交易流水
                    pathname: 'transctl'
                  }, {
                    val: this.$t('nav.refundCheck'), // 退款审核
                    pathname: 'transCheck'
                  }]
                },
                {
                  val: this.$t('nav.shopMng'), // 账户信息
                  pathname: 'chainmanage'
                },
                {
                  val: this.$t('nav.setup'), // 设置
                  subnav: 'Setting',
                  sub: [{
                    val: this.$t('nav.passSet'), // 管理密码设置
                    pathname: 'passSetting'
                  }, {
                    val: this.$t('nav.emailSet'), // 邮箱设置
                    pathname: 'emailSetting'
                  }, {
                    val: this.$t('nav.device'), // 绑定设备编号
                    pathname: 'deviceSetting'
                  }]
                }
              ];
            }
        }
      }
    }
  };
</script>
<style lang="scss">

  .sidebar {
    overflow-y: scroll;
    position: fixed;
    width: 220px;
    height: 100%;
    background-color: #2A2A2A;
    @at-root .sidebar-logo__wrapper {
      margin: 20px auto 28px;
      text-align: center;
    }
    @at-root .sidebar-img {
      margin-bottom: 13px;
    }
    @at-root .sidebar-logo__title {
      font-size: 20px;
      color: #fff;
      word-break: break-all;
      word-wrap: break-word;
      line-height: 1.4;
      padding: 0 27px;
    }
    .sidebar-nav__item {
      position: relative;
      display: block;
      line-height: 48px;
      padding-left: 27px;
      cursor: pointer;
      &.sidebar-nav__subitem {
        position: relative;
        padding-left: 45px;
        overflow: hidden;
        &::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 1px;
          top: 0px;
          left: 27px;
          background-color: #373737;
        }
      }
      &.active {
        background-color: #000;
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 7px;
          height: 100%;
          background-color: #FE9B20;
        }
      }
      .icon-down_arrow {
        position: absolute;
        font-size: 14px;
        right: 16px;
        top: 17px;
        transform-origin: center center;
        transition: .3s cubic-bezier(.33,.48,.74,.86);
      }
    }
    .left-nav {
      padding-bottom: 50px;
    }
  }
  .icon-down_arrow__rotate {
    transform: rotateZ(-90deg);
  }
  .dark {
    background-color: #000;
  }

  .copyright_wrapper {
    position: fixed;
    left: 6px;
    bottom: 10px;
    text-align: center;
    font-size: 14px;
    @at-root .copyright-text {
      color: #fff;
    }
    @at-root .copyright-desc {
      text-align: center;
      color: #FE9B20;
    }
    .custom-stylee {
      background-color: #2a2a2a;
      color: #8a8c92;
    }
  }
  .collpase {
    overflow: hidden;
  }
  .collpase-enter-active {
    animation: expand-enter .3s cubic-bezier(.33,.48,.74,.86);
  }
  .collpase-leave-active {
    animation: expand-leave .3s cubic-bezier(.33,.48,.74,.86);
  }

  @keyframes expand-enter {
    0% {
      height: 0px;
    }

    100% {
      height: 144px;
    }
  }
  @keyframes expand-leave {
    0% {
      height: 144px;
    }

    100% {
      height: 0px;
    }
  }
  .popperBg {
    background-color: white;
  }
</style>
