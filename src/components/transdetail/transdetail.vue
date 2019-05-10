<template>
  <div class="detailData" v-loading="loading" :element-loading-text="$t('common.loading')">
    <div class="banner_wrapper">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>{{$t('tradeMng.crumbs.L1')}}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/main/transctl' }" replace>{{$t('tradeMng.crumbs.L4')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{type === 'refund'?$t('tradeMng.crumbs.L3'):$t('tradeMng.crumbs.L2')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="panel">
      <div class="panel-header panel-header__fix">
        <div class="panel-select-group panel-select-group__justify">
          <span class="panel-header__desc">{{type === 'refund' ? $t('tradeMng.crumbs.L3') : $t('tradeMng.crumbs.L2')}}</span>
        </div>
      </div>
      <div class="panel-body">
        <div class="info_wrapper" :class="{'wrapper': lang === 'ja' || lang === 'en'}">
          <div class="info">
            <div class="info__title">{{type === 'refund' ? $t('tradeMng.detail.amount2') : $t('tradeMng.detail.amount1')}}</div>
            <div class="info__desc" v-if="type === 'digital'">{{ role.currency }} {{ infoData.order_amt | formatCurrency }}</div>
            <div class="info__desc" v-else>{{ role.currency }} {{ infoData.txamt | formatCurrency }}</div>
          </div>
          <div v-if="type === 'digital'">
            <div class="info">
              <div class="info__title">{{$t('tradeMng.detail.amount3')}}</div>
              <div class="info__desc">{{ role.currency }} {{ infoData.txamt | formatCurrency }}</div>
            </div>
            <div class="info">
              <div class="info__title">{{$t('tradeMng.detail.count2')}}</div>
              <div class="info__desc">{{ infoData.order_quantity }}</div>
            </div>
            <div class="info">
              <div class="info__title">{{$t('tradeMng.detail.count1')}}</div>
              <div class="info__desc">{{ infoData.actual_quantity }}</div>
            </div>
          </div>
          <div class="info">
            <div class="info__title">{{$t('tradeMng.table.tradeState')}}</div>
            <div class="info__desc">{{ infoData.status === 1 ? $t('tradeMng.dialog.d3') : $t('tradeMng.dialog.d4') }}</div>
          </div>
          <div class="info" v-if="type === 'trans'">
            <div class="info__title">{{$t('tradeMng.table.tradeType')}}</div>
            <div class="info__desc">{{ infoData.busicd_info }}</div>
          </div>
          <!--<div class="info">
            <div class="info__title">{{$t('tradeMng.detail.origin')}}</div>
            <div class="info__desc">{{ infoData.customer }}</div>
          </div>-->
          <div class="info">
            <div class="info__title">{{type === 'refund' ? $t('tradeMng.detail.time') : $t('tradeMng.table.tradeTime')}}</div>
            <div class="info__desc">{{ infoData.sysdtm }}</div>
          </div>

          <div class="info" v-if="type === 'digital'">
            <div class="info__title">{{$t('tradeMng.detail.syssn4')}}</div>
            <div class="info__desc">{{ infoData.chain_order_no }}</div>
          </div>

          <div class="info">
            <div class="info__title">{{type === 'refund' ? $t('tradeMng.detail.syssn3') : $t('tradeMng.detail.syssn1')}}</div>
            <div class="info__desc">{{ infoData.syssn }}</div>
          </div>
          <div class="info" v-if="type === 'refund'">
            <div class="info__title">{{$t('tradeMng.detail.syssn2')}}</div>
            <div class="info__desc">{{ infoData.origssn }}</div>
          </div>
          <div class="info">
            <div class="info__title">{{$t('tradeMng.detail.store')}}</div>
            <div class="info__desc">{{ infoData.shopname }}</div>
          </div>
          <div class="info">
            <div class="info__title">{{$t('tradeMng.detail.account')}}</div>
            <div class="info__desc">{{ infoData.opuser }}</div>
          </div>
          <div class="info">
            <div class="info__title">{{$t('tradeMng.table.remark')}}</div>
            <div class="info__desc">{{ infoData.note || $t('common.none') }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel" v-if="type === 'trans'">
      <div class="panel-header panel-header__fix">
        <div class="panel-select-group">
          <span class="panel-header__desc">{{$t('tradeMng.detail.history')}}</span>
        </div>
      </div>
      <div class="panel-body">
        <el-table
          :data="listData"
          style="width: 100%"
          row-class-name="el-table__row_fix">
          <el-table-column
            prop="sysdtm"
            :label="$t('tradeMng.detail.time')">
          </el-table-column>
          <el-table-column
            prop="txamt"
            :label="$t('tradeMng.detail.amount2')+ '(' + role.currency + ')'">
            <template slot-scope="scope">{{ scope.row.txamt | formatCurrency }}</template>
          </el-table-column>
          <el-table-column
            prop="opuser"
            :label="$t('tradeMng.detail.account')">
          </el-table-column>

          <el-table-column
            :label="$t('tradeMng.table.op')">
            <template slot-scope="scope">
              <el-button type="text" size="small" class="el-button__fix" @click="showDetail(scope.row.syssn)">{{$t('tradeMng.table.detail')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>

</template>

<script>
  import axios from 'axios';
  import config from 'config';
  import Store from '../../common/js/store';

  export default {
    data() {
      return {
        lang: config.lang,
        role: Store.get('role') || {},
        loading: false,
        type: 'trans',
        listData: [],
        infoData: {}
      };
    },

    created() {
      this.type = this.$route.query.type;
      this.detail();
    },

    methods: {
      // 获取交易详情
      detail() {
        this.loading = true;
        let syssn = this.$route.query.syssn;
        axios.get(`${config.host}/merchant/trade/abroad/detail`, {
          params: {
            syssn: syssn,
            format: 'cors'
          }
        }).then((res) => {
          this.loading = false;
          let data = res.data;
          if(data.respcd === config.code.OK) {
            this.listData = data.data.refunds || [];
            this.infoData = data.data.detail || {};
          } else {
            this.$message.error(data.resperr);
          }
        }).catch(() => {
          this.loading = false;
          this.$message.error(this.$t('common.netError'));
        });
      },

      // 退款详情页
      showDetail(syssn) {
        this.$router.replace(`/main/transctl/transdetail?syssn=${syssn}&type=refund`);
        this.type = this.$route.query.type;
        this.detail();
      }
    }
  };
</script>

<style lang="scss">
</style>
