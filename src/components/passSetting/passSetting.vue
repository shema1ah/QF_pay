<template>
  <div class="passSet" v-loading="loading">
    <div class="banner_wrapper">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>{{ $t('passSet.crumbs.L1') }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $t('passSet.crumbs.L2') }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="panel">
      <div class="panel-header panel-header__fix">
        <div class="panel-select-group">
          <span class="panel-header__desc">{{ $t('passSet.crumbs.L2') }}</span>
        </div>
      </div>
      <div class="panel-body">
        <div class="myform_wrapper">
          <div class="gray-explain">{{$t('passSet.panel.explain')}}</div>
          <div class="passState">
            <div class="title">{{ $t('passSet.panel.passMsg') }}</div>
            <div :class="role.passState ? 'reset' : 'no-set'">{{ role.passState ? $t('passSet.panel.states2') : $t('passSet.panel.states1') }}</div>
            <div class="panel-header-btn panel-header-btn__fill" @click="changePass">
              <span>{{ role.passState ? $t('passSet.panel.bt2') : $t('passSet.panel.bt1') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :title="$t('passSet.panel.title1')" :visible.sync="setPass" @close="handleClose('form1')" :custom-class="(lang === 'ja' || lang === 'en')?'mydialog haiwiadialog':'mydialog'" top="20%" :show-close="false">
      <el-form :model="form1" :rules="form1rules" ref="form1" :label-width="lang === 'en' ? '120px' : '90px'">
        <el-form-item :label="$t('passSet.panel.safe')" prop="pass">
          <el-input v-model.trim="form1.pass" size="small" type="password" :placeholder="$t('passSet.msg.m1')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('passSet.panel.pass')" prop="msgPass">
          <el-input v-model.trim="form1.msgPass" size="small" type="password" :placeholder="$t('passSet.msg.m2')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('passSet.panel.reEnter')" prop="rePass">
          <el-input v-model="form1.rePass" size="small" type="password" :placeholder="$t('passSet.msg.m3')"></el-input>
        </el-form-item>
      </el-form>
      <div class="divider"></div>
      <div slot="footer" class="dialog-footer">
        <div @click="setPass = false" class="cancel">{{ $t('common.cancel') }}</div>
        <div @click="submit(1)" class="submit">
          <span class="el-icon-loading" v-if="iconShow"></span>
          <span v-else>{{ $t('common.confirm') }}</span>
        </div>
      </div>
    </el-dialog>
    <el-dialog :title="$t('passSet.panel.title2')" :visible.sync="resetPass" @close="handleClose('form2')" :custom-class="(lang === 'ja' || lang === 'en')?'mydialog haiwiadialog':'mydialog'" top="20%" :show-close="false">
      <el-form :model="form2" :rules="form2rules" ref="form2" :label-width="(lang === 'ja' || lang === 'en') ? '140px' : '90px'">
        <el-form-item :label="$t('passSet.panel.originPass')" prop="oldPass">
          <el-input v-model.trim="form2.oldPass" size="small" type="password" :placeholder="$t('passSet.msg.m6')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('passSet.panel.newPass')" prop="msgPass">
          <el-input v-model.trim="form2.msgPass" size="small" type="password" :placeholder="$t('passSet.msg.m7')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('passSet.panel.reEnter')" prop="rePass">
          <el-input v-model="form2.rePass" size="small" type="password" :placeholder="$t('passSet.msg.m8')"></el-input>
        </el-form-item>
        <div class="gray-explain" style="margin-left: 0; padding-top: 10px;">{{ $t('passSet.tip.m1') }}</div>
      </el-form>
      <div class="divider"></div>
      <div slot="footer" class="dialog-footer">
        <div @click="resetPass = false" class="cancel">{{ $t('common.cancel') }}</div>
        <div @click="submit(2)" class="submit">
          <span class="el-icon-loading" v-if="iconShow"></span>
          <span v-else>{{ $t('common.confirm') }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import axios from 'axios';
  import config from 'config';
  import Store from '../../common/js/store';

  export default {
    data() {
      let passValid = (rule, val, cb) => {
        if(this.form1.repass !== '') {
          this.$refs['form1'].validateField('rePass');
        }
        cb();
      };
      let repassValid = (rule, val, cb) => {
        if(this.form1.msgPass !== '' && val !== this.form1.msgPass) {
          cb(this.$t('passSet.msg.m9'));
        } else {
          cb();
        }
      };
      let pass1Valid = (rule, val, cb) => {
        if(this.form2.rePass !== '') {
          this.$refs['form2'].validateField('rePass');
        }
        cb();
      };
      let repass1Valid = (rule, val, cb) => {
        if(this.form2.msgPass && val !== this.form2.msgPass) {
          cb(this.$t('passSet.msg.m9'));
        } else {
          cb();
        }
      };

      return {
        role: Store.get('role') || {},
        lang: config.lang,
        loading: false,
        iconShow: false,
        setPass: false,
        resetPass: false,
        form1: {
          pass: '',
          msgPass: '',
          rePass: ''
        },
        form2: {
          oldPass: '',
          msgPass: '',
          rePass: ''
        },
        form1rules: {
          pass: [
            { required: true, message: this.$t('passSet.msg.m1') },
            { max: 20, min: 6, message: this.$t('passSet.msg.m4') }
          ],
          msgPass: [
            { required: true, message: this.$t('passSet.msg.m2') },
            { max: 20, min: 6, message: this.$t('passSet.msg.m4') },
            { validator: passValid }
          ],
          rePass: [
            { required: true, message: this.$t('passSet.msg.m3') },
            { max: 20, min: 6, message: this.$t('passSet.msg.m4') },
            { validator: repassValid }
          ]
        },
        form2rules: {
          oldPass: [
            { required: true, message: this.$t('passSet.msg.m6') },
            { max: 20, min: 6, message: this.$t('passSet.msg.m4') }
          ],
          msgPass: [
            { required: true, message: this.$t('passSet.msg.m7') },
            { max: 20, min: 6, message: this.$t('passSet.msg.m4') },
            { validator: pass1Valid }
          ],
          rePass: [
            { required: true, message: this.$t('passSet.msg.m8') },
            { max: 20, min: 6, message: this.$t('passSet.msg.m4') },
            { validator: repass1Valid }
          ]
        }
      };
    },

    methods: {
      changePass() {
        if(this.role.passState) {
          this.resetPass = true;
        }else {
          this.setPass = true;
        }
      },

      handleClose(form) {
        this.$refs[form].resetFields();
      },

      // 提交
      submit(val) {
        this.$refs[`form${val}`].validate((valid) => {
          if (valid && !this.iconShow) {
            this.iconShow = true;
            let [uri, params] = [];
            if(this.role.passState) {
              uri = '/merchant/user/reset_manage_password';
              params = {
                origin_password: this.form2.oldPass,
                new_password: this.form2.msgPass,
                format: 'cors'
              }
            }else {
             uri = '/merchant/user/set_manage_password';
             params = {
               login_passwd: this.form1.pass,
               password: this.form1.msgPass,
               format: 'cors'
             }
            }
            axios.post(`${config.host}${uri}`, params).then((res) => {
              this.iconShow = false;
              let data = res.data;
              if(data.respcd === config.code.OK) {
                if(!this.role.passState) {
                  this.role.passState = true;
                  this.setPass = false;
                  Store.set('role', Object.assign({}, this.role, {
                    passState: true
                  }));
                }else {
                  this.resetPass = false;
                }
                this.$message({
                  type: 'success',
                  message: this.$t('passSet.msg.m10')
                });
              } else {
                this.$message.error(data.resperr);
              }
            }).catch(() => {
              this.resetPass = false;
              this.setPass = false;
              this.iconShow = false;
              this.$message.error(this.$t('common.netError'));
            })
          }
        });
      }
    }
  };
</script>
<style lang="scss">
  .passSet {
    .panel {
      padding: 23px 25px 23px;
    }
    .gray-explain {
      color: #FF8100;
      font-size: 14px;
      margin-top: 10px;
      margin-left: 20px;
      margin-bottom: 20px;
    }
    .passState {
      display: flex;
      align-items: center;
      font-size: 16px;
      margin-left: 20px;
      .title {
        color: #2F323A;
      }
      .no-set {
        color: #C2C2C2;
        padding-right: 30px;
      }
      .reset {
        color: #98989E;
        padding-right: 30px;
      }
    }
  }
</style>

