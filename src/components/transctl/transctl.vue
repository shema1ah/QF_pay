<template>
  <div class="transctl">
    <div class="banner_wrapper">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>{{$t('tradeMng.crumbs.L1')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('tradeMng.crumbs.L4')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="panel down">
      <div class="panel-header panel-header__auto">
        <el-form :model="form" :rules="formrules" ref="form">
          <div class="panel-select-group">
            <div class="panel-select__wrapper">
              <span class="panel-select__desc">{{$t('tradeMng.panel.time')}}</span>
              <el-form-item prop="dateRangeValue">
                <el-date-picker
                  v-model="form.dateRangeValue"
                  type="datetimerange"
                  :editable="false"
                  :placeholder="$t('tradeMng.panel.range')"
                  size="small"
                  :clearable="false">
                </el-date-picker>
              </el-form-item>
            </div>
            <div class="panel-select__wrapper">
              <el-form-item prop="choosetime">
                <el-radio-group v-model="form.choosetime" @change="changeTime">
                  <el-radio-button v-for="item in choosetimes" :label="item.value" :key="item.value">{{ item.name }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
          <div class="panel-select-group">
            <div class="panel-select__wrapper" v-if="!role.single">
              <span class="panel-select__desc">{{$t('tradeMng.panel.shopName')}}</span>
              <el-form-item prop="selectShopUid">
                <el-select v-model="form.selectShopUid" :placeholder="$t('common.all')" size="small" @change="getOperators(form.selectShopUid)">
                  <el-option v-for="shop in shopData.list" :label="shop.shop_name" :value="shop.uid" :key="shop.uid">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="panel-select__wrapper" v-if="!role.isCashier">
              <span class="panel-select__desc">{{$t('tradeMng.panel.operator')}}</span>
              <el-form-item prop="operaValue">
                <el-select v-model="form.operaValue" :placeholder="$t('tradeMng.table.all')" size="small" @change="operaChange" :disabled="form.selectShopUid === ''">
                  <el-option :label="$t('tradeMng.table.all')" value=""></el-option>
                  <el-option :label="$t('tradeMng.table.main')" value="vl"></el-option>
                  <el-option v-for="(label, value) in operaList" :label="label" :value="value" :key="value"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <!-- 支付方式 -->
          <div class="panel-select-group" v-if="typeList.length > 0">
            <div class="panel-select__wrapper">
              <span class="panel-select__desc">{{$t('tradeMng.table.colWay')}}</span>
              <el-form-item prop="checkAll1">
                <el-checkbox v-model="form.checkAll1" @change="handleCheckAllChange1">{{$t('tradeMng.panel.noLimit')}}</el-checkbox>
              </el-form-item>
              <el-form-item prop="type">
                <el-checkbox-group v-model="form.type" @change="handleCheckedCitiesChange1">
                  <el-checkbox v-for="item in typeList" :label="item.value" :key="item.value">{{ item.name }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
          </div>
          <!-- 更多筛选 -->
          <!-- <div class="panel-select-group">
            <div class="panel-select__wrapper">
              <span class="panel-select__desc">{{$t('tradeMng.panel.moreFilter')}}</span>
              <el-form-item prop="checkAll2">
                <el-checkbox v-model="form.checkAll2" @change="handleCheckAllChange2">{{$t('tradeMng.panel.noLimit')}}</el-checkbox>
              </el-form-item>
              <el-form-item prop="other">
                <el-checkbox-group v-model="form.other" @change="handleCheckedCitiesChange2">
                  <el-checkbox v-for="item in otherList" :label="item.value" :key="item.value">{{ item.name }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
          </div> -->

          <div class="panel-select-group">
            <div class="panel-select__wrapper orderno_nowrap">
              <span class="panel-select__desc">{{$t('tradeMng.panel.sNum')}}</span>
              <el-form-item prop="orderno">
                <el-input v-model="form.orderno" type="number" :placeholder="$t('tradeMng.msg.m8')" size="small" class="panel-select-input__fix panel-select-input-220"></el-input>
              </el-form-item>
            </div>
            <div class="panel-header-btn-group">
              <div class="panel-header-btn panel-header-btn__fill" @click="search">
                <span class="el-icon-loading" v-if="loading"></span>
                <span v-else>{{$t('tradeMng.panel.btn.query')}}</span>
              </div>
              <div class="panel-header-btn transctl-btn" @click="reset">{{$t('tradeMng.panel.btn.reset')}}</div>
            </div>
          </div>
        </el-form>
      </div>
      <div class="panel-body">
        <div class="panel-btn-group__wrapper panel-body-btn-group flex-normal">
          <div class="num_total">
            <!--<div class="num_wrapper">
              <p class="num-title">{{$t('tradeMng.table.totalAmount')}}</p>
              <p class="num-desc">{{ transData.total_amt | formatNumber }} {{ role.currency }}</p>
            </div>
            <div class="num_wrapper">
              <p class="num-title">{{$t('tradeMng.table.totalNum')}}</p>
              <p class="num-desc">{{ transData.total_num || 0 }} </p>
            </div>-->
            <div class="num_wrapper">
              <p class="num-title">{{$t('tradeMng.table.succAmount')}}</p>
              <p class="num-desc">{{ transData.sucamt | formatNumber }} {{ role.currency }}</p>
            </div>
            <div class="num_wrapper">
              <p class="num-title">{{$t('tradeMng.table.succ')}}</p>
              <p class="num-desc">{{ transData.sucnum || 0 }}</p>
            </div>
            <div class="num_wrapper">
              <p class="num-title">{{$t('tradeMng.table.refundMount')}}</p>
              <p class="num-desc">{{ transData.cancel_amt | formatNumber }} {{ role.currency }}</p>
            </div>
            <div class="num_wrapper">
              <p class="num-title">{{$t('tradeMng.table.refundNum')}}</p>
              <p class="num-default">{{ transData.cancel_num || 0 }}</p>
            </div>
          </div>
          <div class="a-wrapper">
            <el-dropdown>
              <span class="el-dropdown-link"><img src="./img/download.png" alt="download"></span>
              <el-dropdown-menu slot="dropdown">
                <a :href="detailHref" download><el-dropdown-item command=1>{{$t('tradeMng.table.btn.downDetail')}}</el-dropdown-item></a>
                <a :href="separateHref" download><el-dropdown-item command=2>{{$t('tradeMng.table.btn.downTrade')}}</el-dropdown-item></a>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <el-table
          :data="transData.data"
          style="width: 100%"
          row-class-name="el-table__row_fix"
          :row-class-name="getStyle"
          v-loading="loading">
          <el-table-column
            :label="$t('tradeMng.table.shopName')" width="110">
            <template slot-scope="scope">
              <div>{{ scope.row.username }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('tradeMng.table.operator')" width="100">
            <template slot-scope="scope">{{ scope.row.opuser || '-' }}</template>
          </el-table-column>
          <el-table-column
            prop="busicd_info"
            :label="$t('tradeMng.table.tradeType')" min-width="100">
          </el-table-column>
          <el-table-column prop="sysdtm" min-width="160" :label="$t('tradeMng.table.tradeTime')">
            <template slot-scope="scope">{{ scope.row.sysdtm }}</template>
          </el-table-column>

          <el-table-column
            :label="$t('tradeMng.table.tradeAmount') + '(' + role.currency + ')'" min-width="100" >
            <template slot-scope="scope" >
              <div class="table-title">{{ scope.row.txamt | formatCurrency }}</div>
              <div class="table-content" v-if="scope.row.busicd === '802101'">{{ $t('tradeMng.table.originAmount') }} {{ scope.row.order_amt | formatCurrency }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="status_str" :label="$t('tradeMng.table.tradeState')" min-width="80">
          </el-table-column>
          <el-table-column min-width="160" :label="$t('tradeMng.table.sNum')">
            <template slot-scope="scope">
              <div>{{ scope.row.origssn ? scope.row.syssn + '(' + $t('tradeMng.detail.syssn2') + ':' + scope.row.origssn + ')' : scope.row.syssn }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="chnlsn" :label="$t('tradeMng.table.chnlsn')" min-width="120"></el-table-column>
          <el-table-column prop="src" :label="$t('tradeMng.table.src')" min-width="80"></el-table-column>
          <el-table-column prop="cardcd" :label="$t('tradeMng.table.cardCd')" min-width="80"></el-table-column>

          <el-table-column prop="note" :label="$t('tradeMng.table.remark')" min-width="88"></el-table-column>
          <el-table-column min-width="215" :label="$t('tradeMng.table.op')">
            <template slot-scope="scope">
              <el-button type="text" size="small" :disabled="showRefund(scope.row.sysdtm, scope.row.allow_refund_amt)" class="el-button__fix" @click="confirm(scope.row)">{{$t('tradeMng.table.cancel')}}</el-button>
              <el-button type="text" size="small" class="el-button__fix" @click.native="detail(scope.row)">{{$t('tradeMng.table.detail')}}</el-button>
              <a :href="downUrl" @click="downHref(scope.$index, $event)">
                  <span id="tr-download">{{ $t('tradeMng.table.download') }}</span>
              </a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination_wrapper" v-if="transData.num >= 10">
        <el-pagination
          ref="page"
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="pageSize"
          @size-change="handleSizeChange"
          :total="transData.num"
          @current-change="currentChange"
          :current-page="currentPage">
        </el-pagination>
      </div>
      <div class="table_placeholder" v-else></div>
    </div>

    <el-dialog :title="$t('tradeMng.dialog.d2')" :visible.sync="showConfirm" custom-class="mydialog" top="20%" @close="handleClose('formpwd')">
      <div style="margin-bottom: 20px;">{{$t('tradeMng.dialog.d1')}}</div>
      <el-form :model="formpwd" :rules="pwdrules" ref="formpwd" :label-width="(lang === 'ja' || lang === 'en') ? '110px' : '80px'" autocomplete="off">
        <el-form-item :label="$t('tradeMng.panel.sNum')">
          <span>{{ refundData.syssn }}</span>
        </el-form-item>
        <el-form-item prop="amount" :label="$t('tradeMng.detail.amount2')" class="amount">
          <span>{{ role.currency }}</span>
          <el-input name="amount" class="showAmount" v-model="formpwd.amount" :placeholder="$t('tradeMng.msg.m14') + ' ' + refundAmount" type="number" @keyup.enter.native="onEnter"></el-input>
        </el-form-item>
        <el-form-item prop="pwd" :label="$t('tradeMng.dialog.d5')">
          <el-input v-model="formpwd.pwd" :placeholder="$t('tradeMng.msg.m9')" type="password" @keyup.enter.native="onEnter"></el-input>
        </el-form-item>
      </el-form>
      <div class="divider"></div>
      <div slot="footer" class="dialog-footer">
        <div @click="checkPwd" class="submit">
          <span class="el-icon-loading" v-if="iconLoading"></span>
          <span v-else>{{$t('common.confirm')}}</span>
        </div>
      </div>
    </el-dialog>

    <el-dialog :title="refundStates !==3 ? (refundStates === 1 ? $t('tradeMng.dialog.d3') : $t('tradeMng.dialog.d7')) : $t('tradeMng.dialog.d4')" :visible.sync="showArefund" custom-class="mydialog refund" :class="[refundStates !== 3 ? (refundStates === 1 ? 'success' : 'wait') : 'fail']" top="20%" :show-close="false">
      <div v-if="refundStates !== 3">
        <el-form :label-width="(lang === 'ja' || lang === 'en') ? '150px' : '90px'">
          <el-form-item :label="$t('tradeMng.detail.amount2')">
            <div>
              <span style="font-size: 18px;">{{ role.currency }}</span>
              <span style="font-size: 24px;">{{ refundInfo.txamt | formatCurrency }}</span>
            </div>
          </el-form-item>
          <el-form-item :label="$t('tradeMng.table.tradeType')">
            <div>{{ $t('tradeMng.dialog.d6') }}</div>
          </el-form-item>
          <el-form-item :label="$t('tradeMng.detail.syssn3')">
            <div>{{ refundInfo.syssn }}</div>
          </el-form-item>
        </el-form>
      </div>
      <div v-else class="refundfail">
        {{ refundInfo.resperr }}
      </div>
      <div class="divider"></div>
      <div slot="footer" class="dialog-footer">
        <div class="submit" @click="showArefund = false">
          <span>{{$t('common.confirm')}}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios';
  import config from 'config';
  import qs from 'qs';
  import {formatDate, formatData} from '../../common/js/util';
  import Store from '../../common/js/store';

  // cancel 0未撤销 1撤销 status  0:交易中 1:交易成功 2:交易失败 3:交易超时

  export default {
    data() {
      let checkOrderNo = (rule, val, cb) => {
        if(val && !/^\d+$/.test(val)) {
          cb(this.$t('tradeMng.msg.m1'));
        } else if(val && !/\d{14}/.test(val)) {
          cb(this.$t('tradeMng.msg.m2'));
        } else {
          cb();
        }
      };
      let checkAmount = (rule, val, cb) => {
        if(+val === 0) {
          cb(this.$t('tradeMng.msg.m15'));
        }else if(+val > +this.refundAmount) {
          cb(this.$t('tradeMng.msg.m12'));
        } else {
          cb();
        }
      };
      return {
        downUrl: 'javascript:;',
        lang: config.lang,
        refundAmount: 0,
        refundStates: 3,
        role: Store.get('role') || {},
        showConfirm: false,
        showArefund: false,
        refundData: {},
        refundInfo: {},
        formpwd: {
          amount: null,
          pwd: ''
        },
        iconLoading: false,
        pageSize: 10,
        status: false,
        loading: false,
        choosetimes: [
          {'name': this.$t('tradeMng.panel.today'), 'value': '1'},
          {'name': this.$t('tradeMng.panel.yestoday'), 'value': '2'},
          {'name': this.$t('tradeMng.panel.near7'), 'value': '7'},
          {'name': this.$t('tradeMng.panel.near30'), 'value': '30'}
        ],
        form: {
          selectShopUid: '',
          orderno: null,
          dateRangeValue: '',
          operaValue: '',
          checkAll1: true,
          checkAll2: true,
          choosetime: '1',
          type: []
        },
        currentPage: 1,
        operaList: {},
        transData: {},
        formrules: {
          orderno: [
            { validator: checkOrderNo, trigger: 'change' }
          ]
        },
        pwdrules: {
            pwd: [
              { required: true, message: this.$t('tradeMng.msg.m9') }
            ],
          amount: [
            { required: true, message: this.$t('tradeMng.msg.m15') },
            { validator: checkAmount, trigger: 'change' }
          ]
        }
      };
    },
    props: {
      shop: {
        type: Object
      }
    },

    computed: {
      mergeHref() {
        let collectParmas = Object.assign({}, {combine_opuser: 1}, this.basicParams);
        return `${config.host}/merchant/trade/total?${qs.stringify(collectParmas)}`;
      },
      separateHref() {
        let collectParmas = Object.assign({}, {combine_opuser: 0}, this.basicParams);
        return `${config.host}/merchant/trade/total?${qs.stringify(collectParmas)}`;
      },

      detailHref() {
        let detailParmas = Object.assign({}, this.basicParams, {isdownload: true});
        return `${config.host}/merchant/trade/download?${qs.stringify(detailParmas)}`;
      },

      shopData() {
        return this.$store.state.shopData;
      },

      typeList() {
        return this.shop.trade_type || []
      },

      allType() {
        let type = this.shop.trade_type || [];
        let list = [];
        if(type.length > 0) {
          for(let val of type) {
            list.push(val.value);
          }
        }
        return list;
      },

      basicParams() {
        let str = '';
        if(!this.form.choosetime) {
          str = 'yyyy-MM-dd HH:mm:ss';
        }
        return {
          userid: this.form.selectShopUid,
          opuid: this.form.operaValue,
          starttime: formatDate(this.form.dateRangeValue[0], str),
          endtime: formatDate(this.form.dateRangeValue[1], str),
          orderno: this.form.orderno,
          charset: 'utf-8',
          isdownload: false,
          page: this.currentPage,
          maxnum: this.pageSize,
          paytypes: this.form.type.join(','),
          // filters: this.form.other.join(','),
          lang: this.lang,
          format: 'cors'
        };
      }
    },

    watch: {
      'form.dateRangeValue': function(val) {
        if(!this.status) {
          this.form.choosetime = '';
        }
        this.status = false;
      },
      'formpwd.amount': function(val, old) {
        if(val) {
          if(this.role.point) {
            // let t = new RegExp('^\\d+(\\.\\d{0,' + this.role.point + '})?$');
            if(!/^\d+(\.\d{0,2})?$/.test(val)) {
              setTimeout(() => {
                this.formpwd.amount = old;
              }, 10);
            }
          }else {
            if(!/^\d+$/.test(val)) {
              setTimeout(() => {
                this.formpwd.amount = old;
              }, 10);
            }
          }
        }
      }
    },

    created() {
      this.changeTime('1');
      // 子商户查询其收银员
      if(this.role.single) {
        this.form.selectShopUid = this.shop.uid;
        this.getOperators(this.shop.uid);
      }

      this.getTransData();
    },

    methods: {
      // 关闭弹出层
      handleClose(form) {
        this.$refs[form] && this.$refs[form].resetFields();
      },

      // 是否展示撤销按钮,单店展示分店当天展示
      showRefund(val, count) {
        if(this.role.single) {
          let date = formatDate(this.transData.date || new Date());
          if(formatDate(val) === date && count > 0) {
            return false;
          }else {
            return true;
          }
        }else {
          return true;
        }
      },

      // 撤销操作
      revoke() {
        let val = this.refundData;
        let params = {
          format: 'cors',
          txamt: formatData(this.formpwd.amount, this.role.rate),
          txdtm: formatDate(val.sysdtm, 'yyyy-MM-dd HH:mm:ss'),
          syssn: val.syssn,
          out_trade_no: Date.now(),
          udid: 'bigmerchant'
        };
        axios.post(`${config.payHost}/trade/v1/refund`, qs.stringify(params), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          this.iconLoading = false;
          this.showConfirm = false;
          this.showArefund = true;
          let data = res.data;
          this.refundInfo = data;
          if (data.respcd === config.code.OK) {
            this.refundStates = 1;
            this.getTransData();
          } else if(data.respcd === '1145') {
            // 退款中的处理
            this.refundStates = 2;
            this.getTransData();
          } else {
            this.refundStates = 3;
          }
        }).catch((res) => {
          this.iconLoading = false;
          this.$message.error(this.$t('tradeMng.msg.m7'));
        });
      },

      // 下载小票
      downHref(index, e) {
        let data = this.transData.data[index];
        let totalAmt = (formatData(data.total_amt, 1 / this.role.rate)).toFixed(2);
        e.target.parentNode.href = `${config.host}/merchant/receipt/download?username=${data.username}&busicd_info=${data.busicd_info}&sysdtm=${data.sysdtm}&total_amt=${totalAmt}&status_str=${data.status_str}&syssn=${data.syssn}&format=cors`;
      },

      // 交易，撤销详情
      detail(item) {
        let type = 'trans';
        if(item.origssn) {
          type = 'refund';
        }
        if(item.busicd === '802101') {
          type = 'digital';
        }
        this.$router.push(`/main/transctl/transdetail?syssn=${item.syssn}&type=${type}`);
      },

      // 点击enter键提交
      onEnter() {
        this.checkPwd();
      },

      // 确认弹框验证密码
      checkPwd() {
        this.$refs['formpwd'].validate((valid) => {
          if (valid && !this.iconLoading) {
            this.iconLoading = true;
            axios.post(`${config.host}/merchant/validate_password`, {
              password: this.formpwd.pwd,
              format: 'cors'
            }).then((res) => {
              let data = res.data;
              if (data.data.result === 'success') {
                this.revoke();
              } else {
                this.iconLoading = false;
                this.$message.error(this.$t('tradeMng.msg.m10'));
              }
            }).catch(() => {
              this.iconLoading = false;
              this.$message.error(this.$t('common.netError'));
            })
          }

        })
      },

      // 撤销按钮
      confirm(val) {
        // 如果有小数点，就显示小数点
        if(this.role.point) {
          this.formpwd.amount = formatData(val.allow_refund_amt, 1 / this.role.rate);
          let v = this.formpwd.amount + '';
          if(v.includes('.')) {
            let p = v.split('.')[1].padEnd(2, 0);
            this.refundAmount = v.split('.')[0] + '.' + p;
          }else {
            let arr = '0';
            arr = arr.padEnd(2, 0);
            this.refundAmount = v + '.' + arr;
          }

        }else {
          this.refundAmount = this.formpwd.amount = formatData(val.allow_refund_amt, 1 / this.role.rate);
        }
        this.refundData = val;
        if(this.role.isCashier) {
          this.cheekRefund();
        }else {
          this.showConfirm = true;
        }
      },

      // 验证收银员退款权限
      cheekRefund() {
        axios.get(`${config.oHost}/mchnt/opuser/perms`, {
          params: {
            format: 'cors'
          }
        }).then((res) => {
          let data = res.data;
          if(data.respcd === config.code.OK) {
            let response = data.data || {};
            if(response.refund === 1) {
              this.showConfirm = true;
            }else {
              this.$message.error(this.$t('tradeMng.msg.m11'));
            }
          } else {
            this.$message.error(data.resperr);
          }
        }).catch(() => {
          this.$message.error(this.$t('common.netError'));
        });
      },

      // 选择时间
      changeTime(value) {
        if(value) {
          this.status = true;
          let end = new Date();
          let start = new Date(end.getTime() - 3600 * 1000 * 24 * (value - 1));

          if(value == 2) {
              end = new Date(end.getTime() - 3600 * 1000 * 24);
          }

          start.setHours(0);
          start.setMinutes(0);
          start.setSeconds(0);

          if(value != 1) {
            end.setHours(23);
            end.setMinutes(59);
            end.setSeconds(59);
          }
          this.form.dateRangeValue = [start, end];
        }
      },

      // 支付方式全选check选择功能
      handleCheckAllChange1(event) {
        this.form.type = event.target.checked ? [] : this.allType;
      },

      // 支付方式单选或多选
      handleCheckedCitiesChange1(value) {
        let checkCount = value.length;
        this.form.checkAll1 = !(checkCount > 0);
      },

      // 点击查询
      search() {
        this.handleSizeChange();
      },

      // 获取数据
      getTransData() {
        if(!this.loading) {
          this.loading = true;
          axios.get(`${config.host}/merchant/trade/info`, {
            params: this.basicParams
          }).then((res) => {
            this.loading = false;
            let data = res.data;
            if(data.respcd === config.code.OK) {
              this.transData = data.data;
            } else {
              this.$message.error(data.resperr);
            }
          }).catch(() => {
            this.loading = false;
            this.$message.error(this.$t('tradeMng.msg.m4'));
          });
        }
      },

      operaChange(opuid) {
        this.basicParams.opuid = opuid;
      },

      // 查询收银员列表
      getOperators(uid) {
        this.form.operaValue = '';
        axios.get(`${config.host}/merchant/sub/opusers`, {
            params: {
              userid: uid,
              format: 'cors'
            }
          }).then((res) => {
            let data = res.data;
            if(data.respcd === config.code.OK) {
              this.operaList = data.data;
            } else {
              this.$message.error(data.resperr);
            }
          }).catch(() => {
            this.$message.error(this.$t('tradeMng.msg.m5'));
          });
      },

      currentChange(current) {
        if (!current && this.currentPage !== 1) {
          this.currentPage = 1;
          return;
        }
        if (current) {
          this.currentPage = current;
        }

        this.getTransData();
      },

      // 重置表单
      reset() {
        this.status = true;
        this.$refs['form'].resetFields();
      },

      handleSizeChange(size = 10) {
        this.pageSize = size;
        this.currentChange();
      },

      // 行样式
      getStyle(row, index) {
        if(row.allow_refund_amt === 0 && !row.is_refund) {
          return 'trans-refund';
        }
        return '';
      }
    }
  };
</script>

<style lang="scss">
  .el-date-table td {
    vertical-align: middle;
  }

  .panel-select-group {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
  }

  .panel-header__auto {
    height: auto !important;
    padding: 25px 0 20px 15px;
  }

  .panel-btn-group__wrapper {
    display: flex;
    margin-top: 25px;
  }

  .panel-body__fix {
    padding: 5px 15px !important;
  }

  .panel-body-btn-group {
    margin: 10px 0px 20px;
  }
  .trans-refund {
    color: #afafaf;
  }

  .el-table__row_fix {
    height: 62px;
    min-height: 62px;
    color: #282A2D;
  }
  #tr-download {
    color: #FF8100;
  }
  /*.panel-header__auto {*/
    /*position: relative;*/
    /*height: auto !important;*/
    /*padding: 25px 0;*/
  /*}*/

  .panel-select-group__fix {
    margin-bottom: 15px;

  }
  .el-form-item__content {
    .el-checkbox-group{
      display: inline-block;
      .el-checkbox{
        margin-left: 15px;
      }
    }
  }
  .panel-select-input__fix {
    width: auto;
  }

  .down{
    .panel-header {
      background-color: #fff;
    }
    .panel-select-group {
      margin-bottom: 10px;
      position: relative;

      .orderno_nowrap .el-form-item__error {
        overflow: visible;
        white-space: nowrap;
      }
      .panel-select__desc {
        width: 120px;
        margin: 0;
        display: inline-block;
      }
      .el-input__inner {
        width: 220px;
        display:inline-block;
      }
      .el-checkbox__label {
        color: #090909;
      }
    }
    .panel-header__auto {
      padding-bottom: 10px;
    }
    .table-title {
      font-size: 16px;
      font-weight: 500;
    }
    .table-content {
      font-size: 14px;
      text-decoration: line-through;
    }
    .num_total {
      text-align: center;
      display: flex;
      p {
        height: 30px;
        line-height: 30px;
      }
      .num-title {
        font-size: 15px;
      }
      .num-desc {
        font-size: 18px;
        color: #FF8100;
        font-weight: bold;
      }
      .num-default {
        font-size: 18px;
        color: #8A8C92;
        font-weight: bold;
      }
      .num_wrapper {
        margin-left: 30px;
      }
    }
    .a-wrapper {
      margin-right: 30px;
      .el-dropdown-link {
        img {
          padding: 5px;
          border: 1px solid #7ED321;
          cursor: pointer;
        }
      }
    }
  }
  .el-form-item {
    margin-bottom: 0px;
  }
  .panel-select-input-220 {
    width: 220px;
  }
  .mr-16 {
    margin-right: 30px !important;
  }
  .flex-normal {
    justify-content: space-between;
  }

  .transctl {
    .amount {
      span {
        position: absolute;
        left: 5px;
        color: #282B2D;
        z-index: 100;
        width: 30px;
        text-align: center;
      }
      .el-input__inner {
        padding-left: 35px;
        line-height: 36px;
      }
    }
    .success, .wait {
      .el-form-item__content {
        text-align: right;
        color: #2F323A;
      }
    }

    .success .el-dialog__header{
      background: url("img/success.png") top center no-repeat;
    }
    .wait .el-dialog__header{
      background: url("img/wait.png") top center no-repeat;
    }
    .fail .el-dialog__header{
      background: url("img/fail.png") top center no-repeat;
    }
    .refund .el-dialog__header {
        margin-top: 20px;
        padding-top: 48px;
        background-size: 45px 45px;
    }
    .refundfail {
      text-align: center;
      color: #262424;
      font-size: 16px;
      padding: 10px 0;
    }
  }
</style>
