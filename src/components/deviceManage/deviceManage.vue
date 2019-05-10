<template>
  <div class="device">
    <div class="banner_wrapper">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>{{$t('setting.crumbs.L1')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('setting.crumbs.L3')}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="btn-wrap">
        <div class="banner-btn" @click="addDevice">
          <i class="icon-create"></i>
          <span class="banner-btn__desc">{{ $t('setting.dialog.d1') }}</span>
        </div>
      </div>
    </div>
    <div class="panel down">
      <div class="panel-header panel-header__auto">
        <el-form :model="form" ref="form">
          <div class="panel-select-group">
            <div class="panel-select__wrapper">
              <span class="panel-select__desc">{{$t('setting.panel.amount')}}</span>
              <el-form-item prop="username">
                <el-input v-model="form.username" type="text" :placeholder="$t('setting.msg.m9')" size="small"></el-input>
              </el-form-item>
            </div>
            <div class="panel-select__wrapper">
              <span class="panel-select__desc">{{$t('setting.panel.device')}}</span>
              <el-form-item prop="device">
                <el-input v-model="form.device" type="text" :placeholder="$t('setting.msg.m10')" size="small"></el-input>
              </el-form-item>
            </div>
            <div class="panel-header-btn-group">
              <div class="panel-header-btn panel-header-btn__fill" @click="search">
                <span class="el-icon-loading" v-if="loading"></span>
                <span v-else>{{$t('setting.btn.query')}}</span>
              </div>
              <div class="panel-header-btn transctl-btn" @click="reset">{{$t('setting.btn.reset')}}</div>
            </div>
          </div>
        </el-form>
      </div>
      <div class="panel-body">
        <el-table
          :data="deviceData.list"
          style="width: 100%"
          row-class-name="el-table__row_fix"
          v-loading="loading">
          <el-table-column prop="shopname" :label="$t('setting.table.shopName')"></el-table-column>
          <el-table-column prop="username" :label="$t('setting.panel.amount')"></el-table-column>
          <el-table-column prop="device" :label="$t('setting.panel.device')" min-width="120"></el-table-column>
          <el-table-column prop="time" :label="$t('setting.table.time')" min-width="120"></el-table-column>
          <el-table-column :label="$t('tradeMng.table.op')">
            <template slot-scope="scope">
              <el-button type="text" size="small" class="el-button__fix" @click="confirm(scope.row.id)">{{$t('setting.table.close')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination_wrapper" v-if="deviceData.count >= 10">
        <el-pagination
          ref="page"
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="pageSize"
          @size-change="handleSizeChange"
          :total="deviceData.count"
          @current-change="currentChange"
          :current-page="currentPage">
        </el-pagination>
      </div>
      <div class="table_placeholder" v-else></div>
    </div>

    <el-dialog :title="$t('setting.dialog.d1')" :visible.sync="showConfirm1" custom-class="mydialog" top="20%" @close="handleClose('formDevice')">
      <el-form :model="formDevice" :rules="deviceRules" ref="formDevice" autocomplete="off" :label-width="lang === 'en' ? '120px' : '90px'">
        <el-form-item :label="$t('setting.panel.amount')" v-if="role.single">
          <span class="input-content">{{ shop.mobile }}</span>
        </el-form-item>
        <el-form-item prop="username" :label="$t('setting.panel.amount')" v-else>
          <el-input v-model.trim="formDevice.username" :placeholder="$t('setting.msg.m9')" type="text" @keyup.enter.native="onEnter"></el-input>
        </el-form-item>
        <el-form-item prop="device" :label="$t('setting.panel.device')">
          <el-input v-model.trim="formDevice.device" :placeholder="$t('setting.msg.m10') " type="text" @keyup.enter.native="onEnter"></el-input>
        </el-form-item>
      </el-form>
      <div class="divider"></div>
      <div slot="footer" class="dialog-footer">
        <div @click="deviceConfirm" class="submit">
          <span class="el-icon-loading" v-if="iconLoading"></span>
          <span v-else>{{$t('common.confirm')}}</span>
        </div>
      </div>
    </el-dialog>

    <el-dialog :title="$t('setting.dialog.d2')" :visible.sync="showConfirm2" :custom-class="(lang === 'ja' || lang === 'en')?'mydialog haiwiadialog':'mydialog'" top="20%" @close="handleClose('formpwd')">
      <el-form :model="formpwd" :rules="pwdRules" ref="formpwd" :label-width="(lang === 'ja' || lang === 'en') ? '110px' : '80px'" autocomplete="off">
        <el-form-item prop="pwd" :label="role.passState ? $t('refundCheck.msg.m1') : $t('tradeMng.dialog.d5')">
          <el-input v-model.trim="formpwd.pwd" :placeholder="role.passState ? $t('refundCheck.msg.m2') :$t('tradeMng.msg.m9') " type="password" @keyup.enter.native="onEnter1"></el-input>
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
  import Store from '../../common/js/store';

  export default {
    data() {
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
        pageSize: 10,
        currentPage: 1,
        deviceId: '',
        loading: false,
        iconLoading: false,
        showConfirm1: false,
        showConfirm2: false,
        form: {
          username: '',
          device: ''
        },
        deviceData: {},
        formDevice: {
          username: '',
          device: ''
        },
        formpwd: {
          pwd: ''
        },
        deviceRules: {
          username: [
            { required: true, message: this.$t('setting.msg.m9') }
          ],
          device: [
            { required: true, message: this.$t('setting.msg.m10') }
          ]
        },
        pwdRules: {
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
      basicParams() {
        return {
          username: this.form.username,
          device: this.form.device,
          page: this.currentPage,
          maxnum: this.pageSize,
          format: 'cors'
        };
      }
    },

    created() {
      this.getDeviceData();
    },

    methods: {
      handleClose(form) {
        this.$refs[form].resetFields();
      },
      // 解绑
      confirm(id) {
        this.deviceId = id;
        this.showConfirm2 = true;
      },

      // 添加设备
      addDevice() {
        this.showConfirm1 = true;
      },

      // 确认添加
      deviceConfirm() {
        this.$refs['formDevice'].validate((valid) => {
          if (valid && !this.iconLoading) {
            this.iconLoading = true;
            let params = {
              username: this.role.single ? this.shop.mobile : this.formDevice.username,
              device: this.formDevice.device,
              format: 'cors'
            };

            axios.post(`${config.host}/merchant/user/bind/device`, params).then((res) => {
              let data = res.data;
              this.showConfirm1 = false;
              this.iconLoading = false;
              if(data.respcd === config.code.OK) {
                this.$message.success(this.$t('setting.msg.m11'));
                this.handleSizeChange();

              } else {
                this.$message.error(data.resperr);
              }
            }).catch(() => {
              this.showConfirm1 = false;
              this.iconLoading = false;
              this.$message.error(this.$t('common.netError'));
            })
          }

        })
      },
      // 点击enter
      onEnter() {
        this.deviceConfirm();
      },

      onEnter1() {
        this.checkPwd();
      },

      // 确认弹框验证密码
      checkPwd() {
        this.$refs['formpwd'].validate((valid) => {
          if (valid && !this.iconLoading) {
            this.iconLoading = true;
            let params = {
              password: this.formpwd.pwd,
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
                this.deleteDevice();
              } else {
                // _this.showConfirm = false;
                this.iconLoading = false;
                this.$message.error(this.$t('tradeMng.msg.m10'));
              }
            }).catch(() => {
              this.showConfirm2 = false;
              this.iconLoading = false;
              this.$message.error(this.$t('common.netError'));
            })
          }

        })
      },

      // 解绑设备
      deleteDevice() {
        axios.post(`${config.host}/merchant/user/unbind/device`, {
          id: this.deviceId,
          state: 0,
          format: 'cors'
        }).then((res) => {
          let data = res.data;
          this.showConfirm2 = false;
          this.iconLoading = false;
          if (data.respcd === config.code.OK) {
            this.$message.success(this.$t('setting.msg.m8'));
            this.handleSizeChange();
          } else {
            this.$message.error(data.resperr);
          }
        }).catch(() => {
          this.showConfirm2 = false;
          this.iconLoading = false;
          this.$message.error(this.$t('common.netError'));
        })
      },

      // 点击查询
      search() {
        this.handleSizeChange();
      },

      // 获取数据
      getDeviceData() {
        if(!this.loading) {
          this.loading = true;
          axios.get(`${config.host}/merchant/user/devices`, {
            params: this.basicParams
          }).then((res) => {
            this.loading = false;
            let data = res.data;
            if(data.respcd === config.code.OK) {
              this.deviceData = data.data;
            } else {
              this.$message.error(data.resperr);
            }
          }).catch(() => {
            this.loading = false;
            this.$message.error(this.$t('common.netError'));
          });
        }
      },

      currentChange(current) {
        if (!current && this.currentPage !== 1) {
          this.currentPage = 1;
          return;
        }
        if (current) {
          this.currentPage = current;
        }

        this.getDeviceData();
      },

      // 重置表单
      reset() {
        this.$refs['form'].resetFields();
      },

      handleSizeChange(size = 10) {
        this.pageSize = size;
        this.currentChange();
      },

    }
  };
</script>

<style lang="scss">

</style>
