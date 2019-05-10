<template lang="html">
  <!-- <h1>contact us</h1> -->
  <div class="contact">
    <div class="banner_wrapper">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>{{$t('nav.contact')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="panel">
      <div class="panel-header panel-header__fix">
        <div class="panel-select-group panel-select-group__justify">
          <span class="panel-header__desc">{{$t('nav.contact')}}</span>
        </div>
      </div>
      <div class="panel-body panel-body-contact">
        <div class="panel-body-phone panel-body-con-box" v-if="isTel">
          <h5>{{$t('contact.phone')}}:</h5>
          <div class="panel-body-con">
            <p v-for="tel in tels">{{ tel }}</p>
          </div>
        </div>
        <div class="panel-body-email panel-body-con-box" v-if="isEmail">
          <h5>{{$t('contact.email')}}:</h5>
          <div class="panel-body-con">
            <p v-for="email in emails">{{ email }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import config from '../../config';

export default {
  data() {
    return {
      isTel: false,
      isEmail: false,
      tels: [],
      emails: []
    }
  },

  mounted() {
    this.getContact();
  },

  methods: {
    getContact() {
      // 获取相关的联系方式
      axios.get(`${config.oHost}/mchnt/user/csinfo`, {
          params: {
            format: 'cors'
          }
        })
      .then((res) => {
        let data = res.data;
        if(data.respcd === config.code.OK) {
          let tels = data.data.csinfo.mobiles ? data.data.csinfo.mobiles : [];
          let emails = data.data.csinfo.emails ? data.data.csinfo.emails : [];
          if(tels.length) {
            this.isTel = true;
            this.tels = tels;
          }
          if(emails.length) {
            this.isEmail = true;
            this.emails = emails;
          }
        } else {
          this.$message.error(data.resperr);
        }
      }).catch(() => {
        this.$message.error(this.$t('setting.msg.m3'));
      })

    }
  }
}
</script>

<style lang="scss">

  .panel-header__desc {
    font-size: 18px;
    color: #FE9B20;
  }
  .panel-header__fix {
    padding-right: 15px;
  }
  .panel-select-group__justify {
    justify-content: space-between;
  }
  .panel-body.panel-body-contact {
    padding: 35px 0 20px 21px;
    min-height: inherit;
    .panel-body-con-box {
      display: flex;
      padding: 0;
      h5 {
        font-size:16px;
        font-family:PingFangSC-Regular;
        color:rgba(38,36,36,1);
        line-height:16px;
      }
      .panel-body-con {
        margin-left: 30px;
        p{
          font-size:14px;
          color:rgba(152,152,158,1);
          line-height:14px;
          padding-bottom:15px;
        }
      }
    }
    .panel-body-con-box:nth-child(even) {
      padding: 37px 0 0 0;
    }
  }
</style>
