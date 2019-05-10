<template>
  <div class="addcashier" v-loading="loading">
    <div class="banner_wrapper">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item class="first" :to="{ path: '/main/cashiermanage' }" replace>{{ $t('cashMng.crumbs.L1') }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $t('cashMng.crumbs.L3') }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="panel">
      <div class="panel-header panel-header__fix">
        <div class="panel-select-group">
          <span class="panel-header__desc">{{ $t('cashMng.add.title') }}</span>
        </div>
      </div>
      <div class="panel-body">
        <div class="myform_wrapper" :class="{'wrapper': lang === 'ja' || lang === 'en'}">
          <el-form :rules="formrules" :model="form" ref="form">
            <el-form-item :label="$t('cashMng.common.name')" prop="opname">
              <el-input size="small" v-model.trim="form.opname" type="text" :placeholder="$t('cashMng.common.m5')" class="panel-select-input-220"></el-input>
            </el-form-item>
            <el-form-item :label="$t('cashMng.common.mobile')" prop="mobile">
              <el-input size="small" v-model.trim="form.mobile" type="text" :placeholder="$t('cashMng.common.m6')" class="panel-select-input-220"></el-input>
            </el-form-item>
            <el-form-item :label="$t('cashMng.common.user')">
              <span class="input-content">{{ shop.mobile }}</span>
            </el-form-item>
            <el-form-item :label="$t('cashMng.common.number')">
              <span class="input-content">{{ opuid }}</span>
            </el-form-item>
            <el-form-item :label="$t('cashMng.common.password')" prop="password">
              <el-input size="small" type="password" v-model.trim="form.password" :placeholder="$t('cashMng.common.m7')" class="panel-select-input-220"></el-input>
            </el-form-item>
            <div class="gray-explain">{{ $t('cashMng.common.tip1') }}</div>
          </el-form>
          <div class="divider"></div>
          <div class="form-submit_wrapper">
            <span class="cancel" @click="cancelCreat">{{ $t('cashMng.add.btn1') }}</span>
            <div class="panel-btn__download panel-btn__download_detail" @click="submit">
              <span class="el-icon-loading" v-if="loading1"></span>
              <span v-else>{{ $t('cashMng.add.btn2') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';
  import config from 'config';
  import Store from '../../common/js/store';

  export default {
    beforeRouteEnter (to, from, next) {
      next((vm) => {
        vm.$refs['form'].resetFields();
        vm.getOpuid();
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
        role: Store.get('role') || {},
        lang: config.lang,
        loading: false,
        loading1: false,
        opuid: '',
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
            { validator: mobileValid }
          ],
          password: [
            { required: true, message: this.$t('cashMng.common.m7') },
            { max: 20, min: 6, message: this.$t('cashMng.common.m10') }
          ]
        }
      };
    },
    props: {
      shop: {
        type: Object
      }
    },

    methods: {
      // 放弃添加
      cancelCreat() {
        this.$router.push('/main/cashiermanage');
      },

      // 提交
      submit() {
        this.$refs['form'].validate((valid) => {
          if (valid && !this.loading1) {
            this.loading1 = true;
            axios.post(`${config.oHost}/mchnt/opuser/add`, Object.assign({}, this.form, {
              opuid: this.opuid,
              format: 'cors'
            })).then((res) => {
              this.loading1 = false;
              let data = res.data;
              if(data.respcd === config.code.OK) {
                this.$message({
                  type: 'success',
                  message: this.$t('cashMng.add.tip1')
                });
                this.$router.push('/main/cashiermanage');
              } else {
                this.$message.error(data.resperr);
              }
            }).catch(() => {
              this.loading1 = false;
              this.$message.error(this.$t('common.netError'));
            })
          }
        });
      },

      // 获取收银员编号
      getOpuid() {
        this.loading = true;
        axios.get(`${config.oHost}/mchnt/opuser/opuid`, {
          params: {
            format: 'cors'
          }
        }).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data.respcd === config.code.OK) {
            this.opuid = data.data.opuid;
          } else {
            this.$message.error(data.respmsg);
          }
        }).catch(() => {
          this.loading = false;
          this.$message.error(this.$t('cashMng.add.tip2'));
        });
      }
    }
  };
</script>
<style lang="scss">
  .addcashier {
    .input-content {
      color: #777A7D;
      font-size: 16px;
    }
    .wrapper {
      .el-form-item {
        display: flex;
        align-items: center;

        .el-form-item__label {
          float: none;
          width: 150px;
          text-align: left;
        }
        .el-form-item__content {
          padding: 0;
          margin-left: 20px;
        }
        .panel-select-input-220 {
          width: 300px;
        }
      }

      .gray-explain {
        margin-left: 190px;
        margin-bottom: 20px;
      }
    }
    .gray-explain {
      margin-left: 120px;
      margin-bottom: 20px;
    }
  }
</style>

