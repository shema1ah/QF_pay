<template>
  <div class="cashiermanage">
    <div class="banner_wrapper">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>{{ $t('cashMng.crumbs.L1') }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="btn-wrap btn-group">
        <div class="banner-btn primary-btn" :class="{'banner-btn-ja': lang === 'ja'}" @click="batchAdd">
          <i class="icon-create"></i>
          <span class="banner-btn__desc">{{ $t('cashMng.crumbs.L4') }}</span>
        </div>
        <div class="banner-btn" :class="{'banner-btn-ja': lang === 'ja'}" @click="addCashier">
          <i class="icon-create"></i>
          <span class="banner-btn__desc">{{ $t('cashMng.crumbs.L3') }}</span>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-header">
        <div class="panel-select-group">
          <div class="panel-select__wrapper">
            <span class="panel-select__desc">{{ $t('cashMng.common.status') }}</span>
            <el-select v-model="stateValue" :placeholder="$t('common.all')" size="small" @change="stateChange">
              <el-option v-for="item in stateLists" :label="item.name" :value="item.value" :key="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="panel-select__wrapper" v-if="!role.haiwai">
            <span class="panel-select__desc">退款权限</span>
            <el-select v-model="rightsValue" :placeholder="$t('common.all')" size="small" @change="rightsChange">
              <el-option v-for="item in rightsLists" :label="item.name" :value="item.value" :key="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="panel-body">
        <el-table :data="cashierData.opusers" style="width: 100%" row-class-name="el-table__row_fix" v-loading="loading" id="memberredcollect">
          <el-table-column prop="opuid" :label="$t('cashMng.common.number')"></el-table-column>
          <el-table-column prop="opname" :label="$t('cashMng.mng.name')"></el-table-column>
          <el-table-column prop="mobile" min-width="80px" :label="$t('cashMng.mng.mobile')"></el-table-column>
          <el-table-column :label="$t('cashMng.common.status')" :min-width="role.haiwai?'140px':'80px'">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" on-text="" off-text="" on-color="#FF8100" off-color="#d8d8d8" on-value=1 off-value=0 @change="changeStatus(scope.row.opuid, scope.row.status)"></el-switch>
              <span class="explain">{{ scope.row.status == 1 ? $t('cashMng.mng.status3') : $t('cashMng.mng.status4') }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="120" :label="$t('cashMng.mng.op')">
            <template slot-scope="scope">
              <el-button type="text" size="small" class="el-button__fix" @click="goDetail(scope.row.opuid)">{{ $t('cashMng.mng.detail') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination_wrapper" v-if="cashierData.count >= 10">
        <el-pagination
          ref="page"
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="pageSize"
          @size-change="handleSizeChange"
          :total="cashierData.count"
          @current-change="currentChange"
          :current-page="currentPage">
        </el-pagination>
      </div>
      <div class="table_placeholder" v-else></div>
    </div>
    <el-dialog :title="$t('cashMng.dialog.title')" :visible.sync="showConfirm" custom-class="mydialog" top="20%" :before-close="uploadClose">
      <div style="margin-bottom: 20px;">{{$t('cashMng.dialog.d1')}}:</div>
      <div class="upload-contain">
        <div>{{ fileList.length > 0 ? fileList[0]['name'] : '' }}</div>
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="uploadUrl"
          :on-change="handleChange"
          :on-success="avatarSuccess"
          :on-error="avatarFailed"
          :show-file-list="false"
          :auto-upload="false"
          :headers="{'lang': lang}"
          accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
          <el-button slot="trigger" size="small" type="primary" @click="uploadClick">{{ $t('cashMng.dialog.d2') }}</el-button>
        </el-upload>
      </div>

      <div class="divider"></div>
      <div slot="footer" class="dialog-footer">
        <a :href="downUrl" download class="el-button--text">{{ $t('cashMng.dialog.d4') }}</a>
        <span class="footer-right">
          <div @click="showConfirm = false" class="cancel">{{ $t('common.cancel') }}</div>
          <div class="submit" @click="submitUpload">
            <span class="el-icon-loading" v-if="iconLoading"></span>
            <span v-else>{{$t('cashMng.dialog.d3')}}</span>
          </div>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import axios from 'axios';
  import config from 'config';
  import Store from '../../common/js/store';

  export default {
    beforeRouteEnter (to, from, next) {
      next((vm) => {
        Object.assign(vm, {
          flag: false,
          pageSize: 10,
          rightsValue: '',
          stateValue: '',
          currentPage: 1
        });

        vm.getData();

        // 延时改变
        setTimeout(() => {
          Object.assign(vm, {
            flag: true
          });
        }, 200);
      });
    },

    data() {
      return {
        role: Store.get('role') || {},
        lang: config.lang,
        showConfirm: false,
        iconLoading: false,
        fileList: [],
        uploadUrl: `${config.host}/merchant/user/add/opusers`,
        cashierData: [],
        pageSize: 10,
        rightsValue: '',
        stateValue: '',
        loading: false,
        currentPage: 1,
        stateLists: [
          {
            name: this.$t('common.all'),
            value: ''
          },
          {
            name: this.$t('cashMng.mng.status1'),
            value: 1
          },
          {
            name: this.$t('cashMng.mng.status2'),
            value: 0
          }
        ],
        rightsLists: [
          {
            name: this.$t('common.all'),
            value: ''
          },
          {
            name: '有权限',
            value: 1
          },
          {
            name: '无权限',
            value: 0
          }
        ]
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
          refund: this.rightsValue,
          status: this.stateValue,
          pagesize: this.pageSize,
          page: this.currentPage - 1,
          format: 'cors'
        };
      },

      downUrl() {
        return `${config.host}/merchant/user/download/template?lang=${this.lang}&format=cors`;
      }
    },

    methods: {
      submitUpload() {
        if(this.fileList.length > 0) {
          this.iconLoading = true;
          this.$refs.upload.submit();
        }else {
          this.$message.error(this.$t('cashMng.dialog.d1'));
        }

      },

      handleChange(file, fileList) {
        if(fileList.length > 0) {
          fileList = fileList.slice(-1);
          fileList[0].status = 'ready';
          this.fileList = fileList;
        }
      },

      // 上传成功
      avatarSuccess(res, file) {
        if (res.respcd === config.code.OK) {
          this.iconLoading = false;
          this.$message.success(this.$t('cashMng.dialog.d5'));
          this.showConfirm = false;
          this.handleSizeChange();
        } else {
          this.iconLoading = false;
          this.$message.error(res.resperr);
        }
      },

      // 上传失败
      avatarFailed(err, file) {
        this.iconLoading = false;
        this.$message.error(err);
        console.log(file);
      },

      // 弹框关闭之前
      uploadClose() {
        this.$refs.upload.clearFiles();
        this.showConfirm = false;
      },

      // 选择文件
      uploadClick() {
        this.$refs.upload.clearFiles();
      },
      // 批量添加
      batchAdd() {
        this.fileList = [];
        this.showConfirm = true;
      },

      // 改变活动状态
      stateChange() {
        this.handleSizeChange();
      },

      // 改变店铺名称
      rightsChange() {
        this.handleSizeChange();
      },

      // 请求数据
      getData() {
        this.loading = true;
        axios.get(`${config.host}/merchant/opuser/list`, {
          params: this.basicParams
        }).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data.respcd === config.code.OK) {
            this.cashierData = this.formatData(data.data);
          } else {
            this.$message.error(data.respmsg);
          }
        }).catch(() => {
          this.loading = false;
          this.$message.error(this.$t('cashMng.mng.m5'));
        });
      },

      // 格式化数据
      formatData(list) {
        let opusers = list.opusers || [];
        for(let i of opusers) {
          i.status = i.status + '';
          i.refund = i.refund + '';
        }
        return list;
      },

      // 改变size
      handleSizeChange(size = 10) {
        this.pageSize = size;
        this.currentChange();
      },

      // 改变当前页
      currentChange(current) {
        if (!current && this.currentPage !== 1) {
          this.currentPage = 1;
          return;
        }
        if (current) {
          this.currentPage = current;
        }
        if (this.flag) {
          this.getData();
        }
      },

      // 增加收银员
      addCashier() {
        this.$router.push('/main/cashiermanage/addcashier');
      },

      // 详情页
      goDetail(id) {
        this.$router.push({
          path: '/main/cashiermanage/cashierdetail',
          query: {
            'id': id
          }});
      },

      // 修改状态
      changeStatus(id, st) {
        let s, message;
        if(st === '1') {
          message = this.$t('cashMng.common.m2');
        }else {
          message = this.$t('cashMng.common.m1');
        }
        if(!this.loading) {
          this.loading = true;
          axios.post(`${config.oHost}/mchnt/opuser/change`, {
            opuid: id,
            status: st,
            format: 'cors'
          }).then((res) => {
            this.loading = false;
            let data = res.data;
            if (data.respcd === config.code.OK) {
              this.$message({
                type: 'success',
                message: message
              });
            } else {
              this.$message.error(data.resperr);
            }
            st = s;
            // this.getData();
          }).catch(() => {
            this.loading = false;
            this.$message.error(this.$t('common.netError'));
          })
        }
      },

      // 修改权限
      changeRights(id, rg) {
        let s, message;
        if(rg === '1') {
          message = '权限已开启';
        } else {
          message = '权限已关闭';
        }
        if(!this.loading) {
          this.loading = true;
          axios.post(`${config.oHost}/mchnt/opuser/perm/change`, {
            opuid: id,
            type: 'refund',
            status: rg,
            format: 'cors'
          }).then((res) => {
            this.loading = false;
            let data = res.data;
            if (data.respcd === config.code.OK) {
              this.$message({
                type: 'success',
                message: message
              });
            } else {
              this.$message.error(data.resperr);
            }
            rg = s;
          }).catch(() => {
            this.loading = false;
            this.$message.error(this.$t('common.netError'));
          })
        }
      }
    }
  };
</script>
<style lang="scss">
  .cashiermanage {
    .explain {
      color: #777A7D;
      font-size: 12px;
    }
    .upload-contain {
      display: flex;
      padding-bottom: 25px;
      &>div:first-child {
        flex: 1;
      }
      .upload-demo {
        width: 70px;
        padding-left: 20px;
        .el-upload {
          width: 100%;
          button {
            width: 100%;
          }
        }
      }
    }
    .mydialog {
      .el-button--text {
        text-decoration: underline;
      }
      .el-dialog__footer .dialog-footer {
        justify-content: space-between;
        align-items: center;
      }
      .footer-right {
        flex: 1;
        display: flex;
        justify-content: flex-end;
      }
    }

  }
  .form-item__detail {
    margin-top: 10px;
    color: #98989E;
    font-size: 14px;
    line-height: 1;
  }

  .form-submit_wrapper {
    display: flex;
    padding: 20px;
    align-items: center;
    .cancel {
      margin-right: 46px;
      text-decoration: underline;
      font-size: 16px;
      color: #FE9B20;
      cursor: pointer;
    }
    .icon-create {
      margin-right: 10px;
    }
  }

  .divider {
    width: 100%;
    height: 1px;
    background-color: #E8E7E6;
  }

  .myform_wrapper {
    margin-top: 20px;
    .el-form-item {
      margin-left: 20px;
      margin-bottom: 20px;
      .el-form-item {
        display: inline-block;
        margin: 0px;
      }
    }
    .el-form-item__content {
      margin-left: 110px;
      line-height: 32px;
      font-size: 16px;
    }
    .el-radio__label {
      font-size: 16px;
    }
    .el-form-item__label {
      padding: 8px 0px;
      font-size: 16px;
    }
    .el-input {
      display: inline-block;
    }
  }

  .add_rule {
    display: inline-block;
    width: 100px;
    line-height: 30px;
    margin-top: 2px;
    margin-left: 20px;
    background-color: #7ED321;
    border-radius: 3px;
    color: #fff;
    text-align: center;
    font-size: 15px;
    cursor: pointer;
    .icon-create {
      margin-right: 8px;
    }
  }
  .el-form-item.is-required .el-form-item__label:before {
    display: none !important;
  }
  .remark {
    margin-top: 10px;
    color: red !important;
    font-size: 14px !important;
  }
</style>
