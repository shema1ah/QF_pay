<template>
  <div class="top_content" v-loading.fullscreen="loading" :element-loading-text="$t('common.loading')">
    <sidebar :shop="shop"></sidebar>
    <div class="main">
      <div class="header">

        <div class="user_wrapper">
          <div class="user_name">
            <span>{{ type }}</span>
            {{ role.isCashier?`${shop.shopname}  ${(shop.opinfo || {}).opname}(${(shop.opinfo || {}).opuid})`:`${shop.shopname}`}}
          </div>
          <a href="javascript:;" @click="logout">
            <div class="user_operation">
              <i class="icon-ic_logout"></i>
              <span class="text">{{$t('common.logout')}}</span>
            </div>
          </a>
        </div>
      </div>
      <router-view :shop="shop"></router-view>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import config from '../../config';
import { getRole } from '../../common/js/util';
import Store from '../../common/js/store';
import sidebar from '../../components/sidebar/sidebar.vue';

export default {
  data() {
    return {
      role: Store.get('role') || {},
      type: '',
      loading: false,
      shop: {}
    };
  },
  components: {
    sidebar
  },
  created() {
    this.getData();
    if(this.role.isCashier) {
      this.type = this.$t('main.cashier');
    }else {
      if(this.role.single && this.role.isMerchant) {
        this.type = this.$t('main.merchant');
      }else if(this.role.single) {
        this.type = this.$t('main.subMerchant');
      }else {
        this.type = this.$t('main.bigMerchant');
      }
    }
  },
  methods: {
    // 退出登录
    logout() {
      this.loading = true;
      axios.get(`${config.host}/merchant/signout?format=cors`)
      .then((res) => {
        let data = res.data;
        this.loading = false;
        if (data.respcd === config.code.OK) {
          // 登出时删除本域cookie
          (new Image()).src = `${config.oHost}/mchnt/set_cookie?sessionid=`;
          Store.set('flag', true);
          localStorage.removeItem('hashid');
          localStorage.removeItem('uid');

          this.$router.push(`/login`);

        } else {
          this.$message.error(data.respmsg);
        }
      }).catch(() => {
        this.loading = false;
        this.$message.error(this.$t('common.netError'));
      });
    },

    getData() {
      this.loading = true;
      axios.get(`${config.host}/merchant/info`, {
        params: {
          is_abroad: 1,
          format: 'cors'
        }
      }).then((res) => {
          this.loading = false;
          let data = res.data;
          if(data.respcd === config.code.OK) {
            // 本地调试或者刷新页面时设置role
            let val = getRole(data.data);
            Store.set('role', val);

            this.$store.dispatch('getShopList');
            // this.$store.dispatch('getMemberTotal');

            this.shop = data.data || {};

          } else {
            this.$message.error(data.respmsg);
          }
        })
        .catch(() => {
          this.loading = false;
        this.$message.error(this.$t('common.netError'));
        // console.log(err && err.respmsg)
        });
    }
  }
};
</script>

<style lang="scss">
  .responsive_img {
    max-width: 100%;
    height: auto;
  }
  .main {
    padding-left: 220px;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    @at-root .header {
      display: flex;
      height: 50px;
      background-color: #FE9B20;
      justify-content: flex-end;
      align-items: center;
      color: #fff;
    }
    @at-root .user_wrapper {
      display: flex;
      align-items: center;
      @at-root .user-img__wrapper {
        width: 35px;
        height: 35px;
        background-color: #ccc;
        border-radius: 50%;
        margin-right: 14px;
      }
      @at-root .user_name {
        text-align: right;
        margin-right: 20px;
        width: 500px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span {
          background: #fff;
          color: #FE9B20;
          padding: 5px 15px;
          border-radius: 10px;
          font-size: 14px;
          display: inline-block;
          margin-right: 10px;
        }
      }
      @at-root .user_operation {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #F39118;
        padding: 0 20px;
        height: 50px;
        cursor: pointer;
        transition: .3s cubic-bezier(.645,.045,.355,1);
        &:hover {
          box-shadow: -3px 3px 5px rgba(0, 0, 0, 0.12);
        }
        .icon-ic_logout {
          font-size: 22px;
          margin-right: 10px;
        }
      }
    }
  }

  .top_content {
    height: 100%;
  }
  // 采用BEM命名规则
  .banner_wrapper {
    display: flex;
    height: 66px;
    padding: 0px 25px;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    background-color: #fff;

    @at-root .banner-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 140px;
      padding: 0 10px;
      height: 40px;
      background-color: #7ED321;
      border-radius: 3px;
      color: #fff;
      cursor: pointer;
      transition: .3s cubic-bezier(.645, .045, .355, 1);
      @at-root .banner-btn__desc {
        margin-left: 8px;
      }
      .icon-create {
        transition: .3s cubic-bezier(.645, .045, .355, 1);
        transform: rotateZ(0deg);
      }
      &:hover {
        box-shadow: -3px 3px 5px rgba(0, 0, 0, 0.12);
        .icon-create {
          transform: rotateZ(90deg);
        }
      }
    }
  }

  .panel {
    margin: 23px 25px 23px;
    background-color: #fff;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.12);
  }

  .panel-header {
    height: 50px;
    padding-left: 15px;
    border-top: 2px solid #FE9B20;
    border-bottom: 1px solid #E7EAEC;
    background-color: #FEFDFB;
    font-size: 16px;
    @at-root .panel-select__wrapper {
      display: flex;
      align-items: center;
      margin-right: 40px;
      @at-root .panel-select__desc {
        margin-right: 15px;
      }
    }
  }

  .panel-body {
    padding: 10px 10px 0px;
  }

  .pagination_wrapper {
    display: flex;
    height: 60px;
    padding-right: 20px;
    justify-content: flex-end;
    align-items: center;
  }
  .detail_dialog {
    .el-row {
      line-height: 30px;
      .title {
        font-size: 16px;
      }
    }
    .highlight {
      color: #FE9B20;
      margin: 0px 5px;
    }
  }
  .scope_cotent_title {
    margin-right: 10px;
    font-weight: 500;
  }
</style>
