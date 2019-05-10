<template>
  <div class="checking">
    <div class="banner_wrapper">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>{{$t('refundCheck.crumbs.L1')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('refundCheck.crumbs.L2')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="panel down">
      <div class="panel-header panel-header__auto">
        <el-form :model="form" :rules="formrules" ref="form">
          <div class="panel-select-group">
            <div class="panel-select__wrapper">
              <span class="panel-select__desc">{{$t('refundCheck.panel.time')}}</span>
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
              <span class="panel-select__desc">{{$t('refundCheck.panel.shopName')}}</span>
              <el-form-item prop="selectShopUid">
                <el-select v-model="form.selectShopUid" :placeholder="$t('common.all')" size="small" @change="getOperators(form.selectShopUid)">
                  <el-option v-for="shop in shopData.list" :label="shop.shop_name" :value="shop.uid" :key="shop.uid">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="panel-select__wrapper" v-if="!role.isCashier">
              <span class="panel-select__desc">{{$t('refundCheck.panel.operator')}}</span>
              <el-form-item prop="operaValue">
                <el-select v-model="form.operaValue" :placeholder="$t('common.all')" size="small" @change="operaChange" :disabled="form.selectShopUid === ''">
                  <el-option :label="$t('tradeMng.table.all')" value=""></el-option>
                  <el-option :label="$t('tradeMng.table.main')" value="vl"></el-option>
                  <el-option v-for="(label, value) in operaList" :label="label" :value="value" :key="value"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="panel-select-group">
            <div class="panel-select__wrapper orderno_nowrap">
              <span class="panel-select__desc">{{$t('refundCheck.panel.oNUm')}}</span>
              <el-form-item prop="orderno">
                <el-input v-model="form.orderno" type="number" :placeholder="$t('refundCheck.panel.tip')" size="small" class="panel-select-input__fix panel-select-input-220"></el-input>
              </el-form-item>
            </div>
            <div class="panel-header-btn-group">
              <div class="panel-header-btn panel-header-btn__fill" @click="search">
                <span class="el-icon-loading" v-if="loading"></span>
                <span v-else>{{$t('refundCheck.panel.btn.query')}}</span>
              </div>
              <div class="panel-header-btn transctl-btn" @click="reset">{{$t('refundCheck.panel.btn.reset')}}</div>
            </div>
          </div>
        </el-form>
      </div>
      <div class="panel-body">
        <el-table
          :data="checkData.data"
          style="width: 100%"
          row-class-name="el-table__row_fix"
          v-loading="loading">
          <el-table-column prop="ctime" :label="$t('refundCheck.panel.time')" min-width="90"></el-table-column>
          <el-table-column prop="username" :label="$t('refundCheck.panel.shopName')"></el-table-column>
          <el-table-column min-width="100" prop="opuser" :label="$t('refundCheck.table.applyAmount')"></el-table-column>
          <el-table-column prop="busicd_info" :label="$t('refundCheck.table.tradeType')"></el-table-column>
          <el-table-column prop="sysdtm" min-width="90" :label="$t('refundCheck.table.tradeTime')"></el-table-column>
          <el-table-column
            :label="$t('refundCheck.table.refundMount') + '(' + role.currency + ')'" min-width="100">
            <template slot-scope="scope">
              <div class="table-title">{{ scope.row.refund_amt | formatCurrency }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('refundCheck.table.tradeAmount') + '(' + role.currency + ')'" min-width="100">
            <template slot-scope="scope">
              <div class="table-title">{{ scope.row.txamt | formatCurrency }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="syssn" min-width="100" :label="$t('refundCheck.table.sNum')"></el-table-column>
          <el-table-column prop="state" min-width="100" :label="$t('refundCheck.table.checkState')">
            <template slot-scope="scope">
              <div v-if="scope.row.state === 0">{{ $t('refundCheck.table.waiting') }}</div>
              <div v-else-if="scope.row.state === 2">{{ $t('refundCheck.table.rejected') }}</div>
              <div v-else-if="scope.row.state === 1">{{ $t('refundCheck.table.approved') }}</div>
            </template>
          </el-table-column>

          <el-table-column min-width="200" :label="$t('refundCheck.table.op')">
            <template slot-scope="scope">
              <el-button type="text" size="small" class="el-button__fix" :disabled="scope.row.state !== 0" @click.native="check(scope.row, 1)">{{ $t('refundCheck.table.approve') }}</el-button>
              <el-button type="text" size="small" class="el-button__fix" :disabled="scope.row.state !== 0" @click.native="check(scope.row, 0)">{{$t('refundCheck.table.reject') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination_wrapper" v-if="checkData.num >= 10">
        <el-pagination
          ref="page"
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="pageSize"
          @size-change="handleSizeChange"
          :total="checkData.num"
          @current-change="currentChange"
          :current-page="currentPage">
        </el-pagination>
      </div>
      <div class="table_placeholder" v-else></div>
    </div>

    <el-dialog :title="approved ? $t('refundCheck.dialog.d3') : $t('refundCheck.dialog.d4')" :visible.sync="showConfirm" custom-class="mydialog" top="20%" @close="handleClose('formpwd')">
      <div style="margin-bottom: 20px;">{{approved ? $t('refundCheck.dialog.d1') : $t('refundCheck.dialog.d2')}}</div>
      <el-form :model="formpwd" :rules="pwdrules" ref="formpwd" :label-width="(lang === 'ja' || lang === 'en') ? '110px' : '80px'" autocomplete="off">
        <el-form-item prop="pwd" :label="role.passState ? $t('refundCheck.msg.m1') : $t('tradeMng.dialog.d5')">
          <el-input v-model.trim="formpwd.pwd" :placeholder="role.passState ? $t('refundCheck.msg.m2') :$t('tradeMng.msg.m9') " type="password" @keyup.enter.native="onEnter"></el-input>
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
  </div>
</template>

<script>
  import axios from 'axios';
  import config from 'config';
  import qs from 'qs';
  import {formatDate} from '../../common/js/util';
  import Store from '../../common/js/store';

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
      let checkPass = (rule, val, cb) => {
        if(!val) {
          if(this.role.passState) {
            cb(this.$t('refundCheck.msg.m2'));
          }else {
            cb(this.$t('tradeMng.msg.m9'));
          }
        } else {
          cb();
        }
      };

      return {
        role: Store.get('role') || {},
        lang: config.lang,
        showConfirm: false,
        approved: false,
        refundData: {},
        formpwd: {
          pwd: ''
        },
        iconLoading: false,
        pageSize: 10,
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
          choosetime: '1'
        },
        currentPage: 1,
        operaList: {},
        checkData: {},
        formrules: {
          orderno: [
            { validator: checkOrderNo, trigger: 'change' }
          ]
        },
        pwdrules: {
            pwd: [
              { max: 20, min: 6, message: this.$t('cashMng.common.m10') },
              { validator: checkPass }
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
      shopData() {
        return this.$store.state.shopData;
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
      }
    },

    created() {
      this.changeTime('1');
      // 子商户查询其收银员
      if(this.role.single) {
        this.form.selectShopUid = this.shop.uid;
        this.getOperators(this.shop.uid);
      }

      this.getCheckData();
    },

    methods: {
      // 关闭弹出层
      handleClose(form) {
        this.$refs[form] && this.$refs[form].resetFields();
      },

      // 点击enter键提交
      onEnter() {
        this.checkPwd();
      },

      check(val, state) {
        this.showConfirm = true;
        this.refundData = val;
        if(state) {
          this.approved = true;
        } else {
          this.approved = false;
        }
      },

      // 确认弹框验证密码
      checkPwd() {
        this.$refs['formpwd'].validate((valid) => {
          if (valid && !this.iconLoading) {
            let _this = this;
            _this.iconLoading = true;
            let params = {
              password: _this.formpwd.pwd,
              format: 'cors'
            };
            if(this.role.passState) {
              Object.assign(params, {
                mode: 'manage'
              })
            }
            axios.post(`${config.host}/merchant/validate_password`, params).then((res) => {
              let data = res.data;
              if (data.data.result === 'success') {
                if(_this.approved) {
                  _this.revoke();
                }else {
                  _this.changeState();
                }
              } else {
                // _this.showConfirm = false;
                _this.iconLoading = false;
                _this.$message.error(_this.$t('tradeMng.msg.m10'));
              }
            }).catch(() => {
              _this.showConfirm = false;
              _this.iconLoading = false;
              _this.$message.error(this.$t('common.netError'));
            })
          }

        })
      },

      // 改变状态
      changeState(val) {
        axios.post(`${config.host}/merchant/trade/update_apply`, {
          id: this.refundData.id,
          state: this.approved ? 1 : 2,
          format: 'cors'
        }).then((res) => {
          let data = res.data;
          this.showConfirm = false;
          this.iconLoading = false;
          if (data.respcd === config.code.OK) {
            let message = this.$t('refundCheck.msg.m3');
            if(val) {
              message = this.$t('refundCheck.msg.m4');
            }
            this.$message.success(message);
            this.getCheckData();
          } else {
            this.$message.error(this.$t('tradeMng.msg.m10'));
          }
        }).catch(() => {
          this.showConfirm = false;
          this.iconLoading = false;
          this.$message.error(this.$t('common.netError'));
        })
      },

      // 撤销操作
      revoke() {
        let val = this.refundData;

        let params = {
          format: 'cors',
          txamt: val.refund_amt,
          txdtm: formatDate(val.sysdtm, 'yyyy-MM-dd HH:mm:ss'),
          syssn: val.syssn,
          out_trade_no: Date.now(),
          mchid: val.userid,
          bigmch_refund_mark: 'bigmch_refund_mark'
        };
        // 数字货币
        if(val.wallet_address) {
          Object.assign(params, {
            crypto_address: val.wallet_address
          })
        }

        axios.post(`${config.payHost}/trade/v1/refund`, qs.stringify(params), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          let data = res.data;
          if (data.respcd === config.code.OK) {
            this.changeState();
            // this.$message.success(this.$t('tradeMng.msg.m6'));
          } else if(data.respcd === '1145') {
            this.changeState(true);
          } else {
            this.showConfirm = false;
            this.iconLoading = false;
            this.$message.error(data.resperr);
          }
        }).catch((res) => {
          this.showConfirm = false;
          this.iconLoading = false;
          this.$message.error(this.$t('tradeMng.msg.m7'));
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

      // 点击查询
      search() {
        this.handleSizeChange();
      },

      // 获取数据
      getCheckData() {
        if(!this.loading) {
          this.loading = true;
          axios.get(`${config.host}/merchant/trade/refund_list`, {
            params: this.basicParams
          }).then((res) => {
            this.loading = false;
            let data = res.data;
            if(data.respcd === config.code.OK) {
              this.checkData = data.data;
            } else {
              this.$message.error(data.resperr);
            }
          }).catch(() => {
            this.loading = false;
            this.$message.error(this.$t('common.netError'));
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

        this.getCheckData();
      },

      // 重置表单
      reset() {
        this.status = true;
        this.$refs['form'].resetFields();
      },

      handleSizeChange(size = 10) {
        this.pageSize = size;
        this.currentChange();
      }
    }
  };
</script>

<style lang="scss">

</style>
