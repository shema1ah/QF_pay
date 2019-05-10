<template>
  <div class="single">
    <div class="banner_wrapper">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>{{$t('shopmng.crumbs.L1')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="panel">
      <div class="panel-header panel-header__fix">
        <div class="panel-select-group panel-select-group__justify">
          <span class="panel-header__desc">{{$t('shopmng.title.baseInfo')}}</span>
        </div>
      </div>
      <div class="panel-body" v-if="!role.isCashier">
        <div class="info_wrapper">
          <div class="info">
            <div class="info__title">{{$t('shopmng.panel.loginAccount')}}</div>
            <div class="info__desc">{{ shop.mobile }}</div>
          </div>
          <div class="info">
            <div class="info__title">{{$t('shopmng.dialog.shopName')}}</div>
            <div class="info__desc">{{ shop.shopname }}</div>
          </div>
          <div class="info">
            <div class="info__title">{{$t('shopmng.dialog.address')}}</div>
            <div class="info__desc">{{ shop.address }}</div>
          </div>
          <div v-if="role.country !== 'ID'">
            <div class="info">
              <div class="info__title">{{$t('shopmng.dialog.mobile')}}</div>
              <div class="info__desc">{{ shop.telephone || $t('common.none') }}</div>
            </div>
            <div class="info">
              <div class="info__title">{{$t('shopmng.dialog.cardHolder')}}</div>
              <div class="info__desc">{{ shop.bankuser }}</div>
            </div>
            <div class="info">
              <div class="info__title">{{$t('shopmng.dialog.bankAccount')}}</div>
              <div class="info__desc">{{ shop.bankaccount }} </div>
            </div>
            <div class="info">
              <div class="info__title">{{$t('shopmng.dialog.bankName')}}</div>
              <div class="info__desc">{{ shop.headbankname }}</div>
            </div>
            <div class="info">
              <div class="info__title"></div>
              <div class="info__desc">{{ shop.bankname }}</div>
            </div>
          </div>
          <div class="panel-btn-group__wrapper">
            <!-- 下载店铺收款码 -->
            <a :href="downHref" download v-if="role.country === 'TH'">
              <div class="panel-btn__download panel-btn__download_detail">
                <i class="icon-download"></i>
                <span>{{$t('shopmng.panel.btn.down')}}</span>
              </div>
            </a>
            <div class="panel-btn__download panel-btn__download_record" @click="changePass(shop.mobile)">{{$t('shopmng.panel.table.editPwd')}}</div>
          </div>
        </div>
      </div>
      <div class="panel-body" v-else>
        <div class="info_wrapper">
          <div class="info">
            <div class="info__title">{{ $t('cashMng.common.status') }}</div>
            <div class="info__desc">{{ opinfo.status? $t('cashMng.mng.status3') : $t('cashMng.mng.status4') }}</div>
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
          <div class="info next-bottom" :style="lang === 'ja'?{'margin-bottom': '10px'}:''">
            <div class="info__title">{{ $t('cashMng.common.number') }}</div>
            <div class="info__desc">{{ opinfo.opuid }}</div>
          </div>
          <div class="info">
            <div class="info__title"></div>
            <div class="gray-explain">{{ $t('cashMng.common.tip1') }}</div>
          </div>

        </div>
      </div>
    </div>

    <el-dialog :title="$t('shopmng.dialog.editPwd')" :visible.sync="showChangePass" @close="handleClose" custom-class="mydialog" top="20%" :show-close="false">
      <el-form :model="form" :rules="formrules" ref="form" label-width="80px">
        <el-form-item :label="$t('shopmng.dialog.loginAccount')">
          <div>{{ userName }}</div>
        </el-form-item>
        <el-form-item :label="$t('shopmng.dialog.inputNewPwd')" prop="pass">
          <el-input v-model="form.pass" size="small" type="password" :placeholder="$t('shopmng.dialog.msg.m1')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('shopmng.dialog.confirmNewPwd')" prop="repass">
          <el-input v-model="form.repass" size="small" type="password" :placeholder="$t('shopmng.dialog.msg.m2')"></el-input>
        </el-form-item>
      </el-form>
      <div class="divider"></div>
      <div slot="footer" class="dialog-footer">
        <div @click="showChangePass = false" class="cancel">{{$t('shopmng.dialog.cancel')}}</div>
        <div @click="submit" class="submit">
          <span class="el-icon-loading" v-if="iconShow"></span>
          <span v-else>{{$t('shopmng.dialog.ok')}}</span>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import ElButton from "../../../node_modules/qfpay-element-ui/packages/button/src/button";
  import Store from '../../common/js/store';
  import axios from 'axios';
  import config from 'config';

  export default {
    components: {ElButton},
    data() {
      let passValid = (rule, val, cb) => {
        if(val === '') {
          cb(this.$t('shopmng.dialog.msg.m1'));
        } else {
          if(this.form.repass !== '') {
            this.$refs['form'].validateField('repass');
          }
          cb();
        }
      };

      let repassValid = (rule, val, cb) => {
        if(val === '') {
          cb(this.$t('shopmng.dialog.msg.m2'));
        } else if(this.form.pass && this.form.pass !== val) {
          cb(this.$t('shopmng.dialog.msg.m3'));
        } else {
          console.log(val);
          cb();
        }
      };
      return {
        lang: config.lang,
        role: Store.get('role') || {},
        loading: false,
        iconShow: false,
        showChangePass: false,
        userName: '',
        form: {
          pass: '',
          repass: ''
        },
        formrules: {
          pass: [
            { validator: passValid },
            {max: 20, min: 6, message: this.$t('shopmng.dialog.msg.m4'), trigger: 'blur'}
          ],
          repass: [
            { validator: repassValid },
            {max: 20, min: 6, message: this.$t('shopmng.dialog.msg.m4'), trigger: 'blur'}
          ]
        }
      };
    },

    computed: {
      downHref() {
        if(this.role.isCashier) {
          return `${config.host}/merchant/qrcode?userid=${this.shop.uid}&lang=${this.lang}&opuid=${this.opuid}&format=cors`;
        }else {
          return `${config.host}/merchant/qrcode?userid=${this.shop.uid}&lang=${this.lang}&format=cors`;
        }
      },
      opinfo() {
        return this.shop.opinfo || {}
      }
    },

    props: {
      shop: {
        type: Object
      }
    },

    methods: {
      changePass(name) {
        this.userName = name;
        this.showChangePass = true;
      },

      // 退出登录
      logout() {
        axios.get(`${config.host}/merchant/signout?format=cors`)
          .then((res) => {
            let data = res.data;
            if (data.respcd === config.code.OK) {
              // 登出时删除.qfpay.com域下cookie
              (new Image()).src = `${config.oHost}/mchnt/set_cookie?sessionid=`;
              Store.set('flag', true);
              localStorage.removeItem('hashid');
              localStorage.removeItem('uid');

              this.$router.push(`/login`);
            } else {
              this.$message.error(data.respmsg);
            }
          }).catch(() => {
          this.$message.error(this.$t('common.netError'));
        });
      },

      // 修改密码提交
      submit() {
        this.$refs['form'].validate((valid) => {
          if(!this.iconShow && valid) {
            this.iconShow = true;

            axios.post(`${config.oHost}/mchnt/user/reset_pwd`, {
              mobile: this.shop.mobile,
              password: this.form.pass,
              mode: 'change',
              username: this.userName,
              src: 'mchnt',
              format: 'cors'
            }).then((res) => {
              let data = res.data;
              if (data.respcd === config.code.OK) {
                this.$message({
                  type: 'success',
                  message: this.$t('common.modSucc')
                });
                this.showChangePass = false;
                this.logout();

              } else {
                this.$message.error(data.respmsg);
              }
              this.iconShow = false;
            }).catch(() => {
              this.iconShow = false;
              this.$message.error(this.$t('common.netError'));
            });
          }
        });
      },

      // 关闭弹出层,清除表单
      handleClose() {
        this.$refs['form'].resetFields();
      }

    }
  };
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


  .info_wrapper {
    padding: 30px 0px 30px 30px;
  @at-root .info {
    display: flex;
    height: 28px;
    -webkit-align-items: center;
    align-items: center;
    margin-bottom: 18px;
    @at-root .info__title {
      font-size: 16px;
      color: #8A8C92;
      width: 100px;
      margin-right: 25px;
      text-align: left;
    }
    @at-root .info__sign {
      margin: 0px 15px 0px 10px;
    }
    @at-root .info__desc {
      font-size: 15px;
      color: #1F2D3D;
    }
  }
  }
  .table_placeholder {
    height: 50px;
  }

  .single {
    .panel-header-btn {
      width: 210px;
    }
    .next-bottom {
      margin: 0;
    }
    .gray-explain {
      margin: 0;
      line-height: 1.4;
    }
  }
</style>
