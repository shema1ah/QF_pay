<template>
  <div class="cashierdetail" v-loading="loading">
    <div class="banner_wrapper">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item class="first" :to="{ path: '/main/cashiermanage' }" replace>{{ $t('cashMng.crumbs.L1') }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $t('cashMng.crumbs.L2') }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="panel">
      <div class="panel-header panel-header__fix">
        <div class="panel-select-group panel-select-group__justify">
          <span class="panel-header__desc">{{ $t('cashMng.detail.title') }}</span>
        </div>
      </div>
      <div class="panel-body" >
        <div class="info_wrapper" :class="{'wrapper': lang === 'ja' || lang === 'en'}">
          <div class="info">
            <div class="info__title">{{ $t('cashMng.common.status') }}</div>
            <div class="info__desc">
              <el-switch v-model="opinfo.status" on-text="" off-text="" on-color="#FF8100" off-color="#d8d8d8" on-value=1 off-value=0 @change="changeStatus"></el-switch>
            </div>
          </div>
          <div class="info">
            <div class="info__title">{{ $t('cashMng.common.name') }}</div>
            <div class="info__desc">{{ opinfo.opname }}</div>
          </div>
          <div class="info">
            <div class="info__title">{{ $t('cashMng.common.mobile') }}</div>
            <div class="info__desc">{{ opinfo.mobile }}</div>
          </div>
          <div class="info">
            <div class="info__title">{{ $t('cashMng.common.shop') }}</div>
            <div class="info__desc">{{ shop.shopname }}</div>
          </div>
          <div class="info">
            <div class="info__title">{{ $t('cashMng.common.user') }}</div>
            <div class="info__desc">{{ shop.mobile }}</div>
          </div>
          <div class="info">
            <div class="info__title">{{ $t('cashMng.common.number') }}</div>
            <div class="info__desc">{{ opinfo.opuid }}</div>
          </div>
          <div class="info next-bottom">
            <div class="info__title">{{ $t('cashMng.common.password') }}</div>
            <div class="info__desc">******</div>
          </div>
          <div class="info">
            <div class="info__title"></div>
            <div class="gray-explain">{{ $t('cashMng.common.tip1') }}</div>
          </div>
          <div class="info next-bottom" v-if="!role.haiwai">
            <div class="info__title">退款权限</div>
            <div class="info__desc">
              <el-switch v-model="opinfo.refund" on-text="" off-text="" on-color="#7ed321" off-color="#d8d8d8" on-value=1 off-value=0 @change="changeRights"></el-switch>
            </div>
          </div>
          <div class="info" v-if="!role.haiwai">
            <div class="info__title"></div>
            <div class="gray-explain">* 目前收银员仅支持查看活动信息，不支持对红包、集点、储值活动、特卖、店铺公告、会员特权的增删改</div>
          </div>
          <div class="panel-btn-group__wrapper">
            <a :href="downHref" download v-if="!role.haiwai">
              <div class="panel-btn__download panel-btn__download_detail">
                <i class="icon-download"></i>
                <span>下载收款码</span>
              </div>
            </a>
            <div class="panel-btn__download panel-btn__download_record" @click="changeInfo">
              <span>{{ $t('cashMng.detail.btn') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog :title="$t('cashMng.detail.btn')" :visible.sync="showChangeInfo" @close="handleClose" :custom-class="(lang === 'ja' || lang === 'en')?'mydialog haiwiadialog':'mydialog'" top="20%" :show-close="false">
      <el-form :model="form" :rules="formrules" ref="form" :label-width="(lang === 'ja' || lang === 'en')?'135px':'90px'">
        <el-form-item :label="$t('cashMng.common.name')" prop="opname">
          <el-input v-model.trim="form.opname" size="small" type="text" :placeholder="$t('cashMng.common.m5')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('cashMng.common.mobile')" prop="mobile">
          <el-input v-model.trim="form.mobile" size="small" type="text" :placeholder="$t('cashMng.common.m6')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('cashMng.common.shop')">
          <div>{{ shop.shopname }}</div>
        </el-form-item>

        <el-form-item :label="$t('cashMng.common.user')">
          <div>{{ shop.mobile }}</div>
        </el-form-item>
        <el-form-item :label="$t('cashMng.common.number')">
          <div>{{ opuid }}</div>
        </el-form-item>
        <el-form-item :label="$t('cashMng.common.password')" prop="password">
          <el-input v-model="form.password" size="small" type="password" :placeholder="$t('cashMng.common.m7')" @change="passChange" @blur="passBlur" @focus="passFocus" id="end-length"></el-input>
        </el-form-item>
      </el-form>
      <div class="divider"></div>
      <div slot="footer" class="dialog-footer">
        <div @click="showChangeInfo = false" class="cancel">{{ $t('common.close') }}</div>
        <div @click="submit" class="submit">
          <span class="el-icon-loading" v-if="iconShow"></span>
          <span v-else>{{ $t('common.confirm') }}</span>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Store from '../../common/js/store';
  import axios from 'axios';
  import config from 'config';

  export default {
    beforeRouteEnter (to, from, next) {
      next((vm) => {
        vm.opuid = vm.$route.query.id || '';
        vm.getInfo();
      });
    },

    data() {
      let mobileValid = (rule, val, cb) => {
        if(val === '') {
          cb(this.$t('cashMng.common.m6'));
        } else if((!this.role.haiwai && !/^1[34578]\d{9}$/.test(val)) || (this.role.haiwai && val.length > 15)) {
          cb(this.$t('cashMng.common.m9'));
        } else {
          cb();
        }
      };

      return {
        lang: config.lang,
        role: Store.get('role') || {},
        opinfo: {},
        opuid: '',
        loading: false,
        iconShow: false,
        flag: false,
        oldPass: '',
        isChange: false,
        showChangeInfo: false,
        form: {
          opname: '',
          mobile: '',
          password: ''
        },
        formrules: {
          opname: [
            { required: true, message: this.$t('cashMng.common.m5') },
            { max: 20, min: 2, message: this.$t('cashMng.common.m8') }
          ],
          mobile: [
            {validator: mobileValid}
          ],
          password: [
            { required: true, message: this.$t('cashMng.common.m7') },
            { max: 20, min: 6, message: this.$t('cashMng.common.m10') }
          ]
        }
      };
    },

    computed: {
      downHref() {
        return `${config.host}/merchant/qrcode?userid=${this.shop.uid}&opuid=${this.opuid}`;
      }
    },

    props: {
      shop: {
        type: Object
      }
    },

    methods: {
      // 获取收银员信息
      getInfo() {
        this.loading = true;
        axios.get(`${config.host}/merchant/opuser/info`, {
          params: {
            opuid: this.opuid,
            format: 'cors'
          }
        }).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data.respcd === config.code.OK) {
            this.opinfo = data.data || {};
            this.opinfo.status = this.opinfo.status + '';
            this.opinfo.refund = this.opinfo.refund + '';
            this.form = {
              opname: this.opinfo.opname,
              mobile: this.opinfo.mobile,
              password: '******'
            }
          } else {
            this.$message.error(data.respmsg);
          }
        }).catch(() => {
          this.loading = false;
          this.$message.error(this.$t('common.netError'));
        });
      },

      // 改变状态
      changeStatus(st) {
        if(!this.loading) {
          this.loading = true;
          axios.post(`${config.oHost}/mchnt/opuser/change`, {
            opuid: this.opuid,
            status: st,
            format: 'cors'
          }).then((res) => {
            this.loading = false;
            let data = res.data;
            if (data.respcd === config.code.OK) {
              let message;
              if(st === '1') {
                message = this.$t('cashMng.common.m2');
              }else {
                message = this.$t('cashMng.common.m1');
              }
              this.$message({
                type: 'success',
                message: message
              });
            } else {
              this.$message.error(data.resperr);
            }
          }).catch(() => {
            this.loading = false;
            this.$message.error(this.$t('common.netError'));
          })
        }
      },

      // 改变权限
      changeRights(rg) {
        if(!this.loading) {
          this.loading = true;
          axios.post(`${config.oHost}/mchnt/opuser/perm/change`, {
            opuid: this.opuid,
            type: 'refund',
            status: rg,
            format: 'cors'
          }).then((res) => {
            this.loading = false;
            let data = res.data;
            if (data.respcd === config.code.OK) {
              let message;
              if(rg === '1') {
                message = '权限已开启';
              }else {
                message = '权限已关闭';
              }
              this.$message({
                type: 'success',
                message: message
              });
            } else {
              this.$message.error(data.resperr);
            }
          }).catch(() => {
            this.loading = false;
            this.$message.error(this.$t('common.netError'));
          })
        }
      },

      // 基本信息弹层
      changeInfo() {
        this.showChangeInfo = true;
      },

      // 输入框聚焦改变时清空
      passChange(val) {
        if(!this.flag) {
          if(this.oldPass.length > val.length) {
            this.form.password = '';
          }else {
            let dom = document.querySelector("#end-length");
            let index = dom.selectionStart - 1;
            this.form.password = val.substr(index, 1) || '';
          }
          this.isChange = true;
          this.flag = true;
        }
      },

      // 失焦
      passBlur() {
        this.flag = false;
      },
      // 聚焦
      passFocus() {
        this.oldPass = this.form.password;
      },

      // 提交修改
      submit() {
        this.$refs['form'].validate((valid) => {
          if (valid && !this.iconShow) {
            this.iconShow = true;
            let params;
            if(this.isChange) {
              params = Object.assign({}, this.form, {
                opuid: this.opuid,
                format: 'cors'
            });
            }else {
              params = {
                opname: this.form.opname,
                mobile: this.form.mobile,
                opuid: this.opuid,
                format: 'cors'
              }
            }
            axios.post(`${config.oHost}/mchnt/opuser/change`, params).then((res) => {
              this.iconShow = false;
              this.showChangeInfo = false;
              let data = res.data;
              if (data.respcd === config.code.OK) {
                this.$message({
                  type: 'success',
                  message: this.$t('common.modSucc')
                });
                // 路由重新渲染
                this.getInfo();
              } else {
                this.$message.error(data.resperr);
              }
            }).catch(() => {
              this.iconShow = false;
              this.showChangeInfo = false;
              this.$message.error(this.$t('common.netError'));
            })
          }
        });
      },

      // 关闭弹出层,清除表单
      handleClose() {
        this.isChange = false;
        this.$refs['form'].resetFields();
      }
    }

  };
</script>
<style lang="scss">
  .cashierdetail {
    .next-bottom {
      margin-bottom: 0;
    }
  }
</style>
