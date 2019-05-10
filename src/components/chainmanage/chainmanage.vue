<template>
  <div class="chain">
    <div class="banner_wrapper">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>{{$t('shopmng.crumbs.L1')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="panel">
      <div class="panel-header panel-header__fix">
        <div class="panel-select-group panel-select-group__justify">
          <span class="panel-header__desc">{{$t('shopmng.title.baseInfo')}}</span>
          <!--<div class="panel-header-btn" @click="changePass('chain', shop.mobile)"></div>-->
          <div type="primary" :class="lang === 'ja' ? 'panel-header-btn panel-header-btn-ja': 'panel-header-btn'" :plain="true" @click="changePass('chain', shop.mobile)">{{$t('shopmng.panel.btn.editPwd')}}</div>
        </div>
      </div>
      <div class="panel-body">
        <div class="info_wrapper">
          <div class="info">
            <div class="info__title_en">{{$t('shopmng.panel.shopName')}}</div>
            <div class="info__sign">:</div>
            <div class="info__desc">{{ shop.shopname }}</div>
          </div>
          <div class="info">
            <div class="info__title_en">{{$t('shopmng.panel.loginAccount')}}</div>
            <div class="info__sign">:</div>
            <div class="info__desc">{{ shop.mobile }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-header panel-header__fix">
        <div class="panel-select-group">
          <span class="panel-header__desc">{{$t('shopmng.title.subInfo')}}</span>
          <!-- <div class="panel-header-btn__associate" @click="associate">
            <i class="icon-create"></i>
            <span>关联分店</span>
          </div> -->

          <div class="btn-group">
            <div class="panel-header-btn__associate" v-if="role.country === 'TH'" @click="editShopDown" :style="lang === 'en'?'width:200px':''">
              <i class="icon-download"></i>
              {{$t('shopmng.panel.btn.listDown')}}
            </div>
            <el-button type="primary" class="panel-edit-btn__subshopnum" @click.native="editSubShopNum">{{$t('shopmng.panel.btn.editSubTag')}}</el-button>
          </div>

        </div>
      </div>
      <div class="panel-body">
        <el-table
          :data="pageShopData.list"
          style="width: 100%"
          row-class-name="el-table__row_fix"
          v-loading.body="loading">
          <el-table-column
            prop="shop_name"
            :label="$t('shopmng.panel.table.subName')">
          </el-table-column>
          <el-table-column
            prop="mobile"
            :label="$t('shopmng.panel.table.loginAccount')">
          </el-table-column>
          <el-table-column
            prop="join_time"
            :label="$t('shopmng.panel.table.regTime')">
            <template slot-scope="scope">{{ scope.row.join_time }}</template>
          </el-table-column>
          <el-table-column
            prop="tag"
            :label="$t('shopmng.panel.table.subTag')">
            <template slot-scope="scope">{{ scope.row.tag }}</template>
          </el-table-column>
          <el-table-column
            :label="$t('shopmng.panel.table.op')">
            <template slot-scope="scope">
              <el-button type="text" size="small" class="el-button__fix" @click="showDetail(scope)">{{$t('shopmng.panel.table.detail')}}</el-button>
              <!--<el-button type="text" size="small" class="el-button__fix" @click="unbind(scope)">解绑此分店</el-button>-->
              <el-dropdown>
                <span class="el-dropdown-link el-dropdown-link__fix">
                  {{$t('shopmng.panel.table.more')}}<i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" class="el-dropdown-menu__fix collect">
                  <el-dropdown-item class="el-dropdown-item__fix"
                                    @click.native="changePass('single', scope.row.mobile)">{{$t('shopmng.panel.table.editPwd')}}
                  </el-dropdown-item>
                  <el-dropdown-item class="el-dropdown-item__fix" @click.native="confirmDeleteShop(scope.row.uid)">
                    {{$t('shopmng.panel.table.delSub')}}
                  </el-dropdown-item>

                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination_wrapper" v-if="pageShopData.count >= 10">
        <el-pagination
          ref="page"
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="pageSize"
          @size-change="handleSizeChange"
          :total="+pageShopData.count"
          @current-change="currentChange"
          :current-page="currentpage">
        </el-pagination>
      </div>
      <div class="table_placeholder" v-else></div>
    </div>
    <el-dialog v-model="isShowDetail" class="detail_dialog" :title="$t('shopmng.dialog.shopDetail')">
      <el-row>
        <el-col :span="6" class="title">{{$t('shopmng.dialog.loginAccount')}}</el-col>
        <el-col :span="10" class="desc">{{ detailData.mobile }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6" class="title">{{$t('shopmng.dialog.shopName')}}</el-col>
        <el-col :span="10" class="desc">{{ detailData.shopname }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6" class="title">{{$t('shopmng.dialog.address')}}</el-col>
        <el-col :span="10" class="desc">{{ detailData.address }}</el-col>
      </el-row>

      <div v-if="role.country !== 'ID'">
        <el-row>
          <el-col :span="6" class="title">{{$t('shopmng.dialog.mobile')}}</el-col>
          <el-col :span="10" class="desc">{{ detailData.telephone || '无' }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="title">{{$t('shopmng.dialog.cardHolder')}}</el-col>
          <el-col :span="10" class="desc">{{ detailData.bankuser }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="title">{{$t('shopmng.dialog.bankAccount')}}</el-col>
          <el-col :span="10" class="desc">{{ detailData.bankaccount }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="title">{{$t('shopmng.dialog.bankName')}}</el-col>
          <el-col :span="14" class="desc">
            <div>{{ detailData.headbankname }}</div>
            <div>{{ detailData.bankname }}</div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog :title="$t('shopmng.dialog.editPwd')" :visible.sync="showChangePass" @close="handleClose('form')" custom-class="mydialog"
               top="20%" :show-close="false">
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

    <el-dialog :title="$t('shopmng.panel.btn.listDown')" :visible.sync="showDown" class="mydialog downlog" custom-class="mydialog_haiwai" size="small">
      <el-form label-position="left" class="down-sub-shop" :model="downForm" ref="downForm">
        <div class="desc" style="text-align: left">
          {{$t('shopmng.dialog.downTip')}}
        </div>
        <el-form-item prop="shop">
          <el-checkbox-group v-model="downForm.shop" @change="handleCheckedShopChange">
            <el-checkbox v-for="(item, index) in shopData.list" v-if="index !== 0" :label="item.uid" :key="item.uid">{{ item.shop_name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div class="divider"></div>
      <div slot="footer" class="dialog-footer">
        <el-checkbox v-model="downForm.checkAll" @change="handleCheckAllChange">{{$t('shopmng.dialog.all')}}</el-checkbox>
        <span class="footer-right">
          <div @click="showDown = false" class="cancel">{{ $t('common.cancel') }}</div>
          <div @click="downShopList" class="submit"><i class="el-icon-loading" v-show="iconShow"></i>{{$t('shopmng.dialog.confirm')}}</div>
        </span>
      </div>

    </el-dialog>

    <el-dialog :title="$t('shopmng.dialog.editSubTag')" :visible.sync="showEditSubShopNum" class="mydialog" custom-class="mydialog_haiwai" size="small" @close="refreshSubShopData">
      <el-form ref="form-edit-subshop-num" label-position="left" class="edit-sub-tag">
        <div class="desc" style="text-align: left">
          {{$t('shopmng.dialog.diaTip')}}
        </div>
        <el-form-item v-for="(shop, index) in shopData.list" v-if="index !== 0" :key="index">
          <el-tooltip placement="bottom" :content="shop.shop_name" class="subshoptip">
            <label style="width:140px">{{shop.shop_name}}</label>
          </el-tooltip>
          <el-input v-model="shop.tag" size="small" :placeholder="$t('shopmng.dialog.validateText')" :style="lang === 'ja'?'width:98%':'width:65%'" @blur="updateShopTag(shop)"></el-input>
        </el-form-item>

      </el-form>
      <div class="divider"></div>
      <div slot="footer" class="dialog-footer">
        <div @click="refreshSubShopData" class="submit"><i class="el-icon-loading" v-show="iconShow"></i>{{$t('shopmng.dialog.confirm')}}</div>
      </div>
    </el-dialog>

    <el-dialog :title="$t('shopmng.dialog.notice')" :visible.sync="showDeleteShopConfirm" custom-class="mydialog pass" top="20%"
               :show-close="true" @close="handleClose('pwdform')">
      <div style="margin-bottom: 20px;">{{$t('shopmng.dialog.noticeTip')}}</div>
      <el-form :model="formpwd" :rules="formrules" ref="pwdform">
        <el-form-item prop="primeaccountpwd">
          <el-input v-model="formpwd.primeaccountpwd" :placeholder="$t('shopmng.dialog.validateText2')" type="password" style="font-size:12px"></el-input>
        </el-form-item>
      </el-form>
      <div class="divider"></div>
      <div slot="footer" class="dialog-footer">
        <div @click="checkPrimeShopPwd('pwdform',this)" class="submit"><i class="el-icon-loading" v-show="iconShow"></i>{{$t('shopmng.dialog.ok')}}
        </div>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import axios from 'axios';
  import config from 'config';
  import qs from 'qs';
  import Store from '../../common/js/store';
  const hasSpetialChar = function (str) {
    if (!/^[\u4E00-\u9FA5\uf900-\ufa2d\u3001\u3002\u3008-\u301B\u2013\u2014\u2018\u2019\u201C\u201D\uFF01\uFF08\uFF09\uFF0C\uFF0E\uFF1A\uFF1B\uFF1F\u0020-\u007F]*$/.test(str)) {
        return 1;
    }
  }
  export default {
    data() {
      let passValid = (rule, val, cb) => {
        if (val === '') {
          cb(this.$t('shopmng.dialog.msg.m1'));
        } else {
          if (this.form.repass !== '') {
            this.$refs['form'].validateField('repass');
          }
          cb();
        }
      };
      let repassValid = (rule, val, cb) => {
        if (val === '') {
          cb(this.$t('shopmng.dialog.msg.m2'));
        } else if (this.form.pass && this.form.pass !== val) {
          cb(this.$t('shopmng.dialog.msg.m3'));
        } else {
          console.log(val);
          cb();
        }
      };
//      let tagValid = (rule, val, cb) => {
//        if (val.length > 20) {
//          cb(new Error('请输入二十以内的文字或字母'));
//        } else if (hasSpetialChar(val)) {
//          cb(new Error('含特殊字符，请重新输入'));
//        } else {
//          cb();
//        }
//      };
      let primeAccountPwdValid = (rule, val, cb) => {
        if (val === '') {
          cb(this.$t('shopmng.dialog.validateText2'));
        } else {
          console.log(val);
          cb();
        }
      };

      return {
        lang: config.lang,
        role: Store.get('role') || {},
        currentpage: 1,
        pageSize: 10,
        visible: false,
        loading: false,
        iconShow: false,
        isShowDetail: false,
        showChangePass: false,
        showEditSubShopNum: false,
        showDown: false,
        showDeleteShopConfirm: false,
        detailData: {},
        userName: '',
        type: '',
        shouldDeleteUid: '',
        downForm: {
          shop: [],
          checkAll: true
        },
        associate_form: {
          account: '',
          password: '',
          payee: '',
          cardno: '',
          format: 'cors'
        },
        formpwd: {
          primeaccountpwd: ''
        },
        form: {
          pass: '',
          repass: ''
        },
        checkTagRules: {
          tag: [
            {max: 20, min: 0, message: this.$t('shopmng.dialog.msg.m10'), trigger: 'blur'}
          ]
        },
        formrules: {
          pass: [
            {validator: passValid},
            {max: 20, min: 6, message: this.$t('shopmng.dialog.msg.m4'), trigger: 'blur'}
          ],
          repass: [
            {validator: repassValid},
            {max: 20, min: 6, message: this.$t('shopmng.dialog.msg.m4'), trigger: 'blur'}
          ],
          primeaccountpwd: [
            {validator: primeAccountPwdValid},
            {required: true, message: this.$t('shopmng.dialog.msg.m5'), trigger: 'blur'}
          ],
          account: [
            {required: true, message: this.$t('shopmng.dialog.msg.m6')}
          ],
          password: [
            {required: true, message: this.$t('shopmng.dialog.msg.m7')}
          ],
          bankuser: [
            {required: true, message: this.$t('shopmng.dialog.msg.m8')}
          ],
          bankaccount: [
            {required: true, message: this.$t('shopmng.dialog.msg.m9')}
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
      pageShopData() {
        return this.$store.state.pageShopData;
      },
      shopData() {
        return this.$store.state.shopData;
      },

      allType() {
        let type = this.shopData.list || [];
        let list = [];
        if(type.length > 0) {
          for(let val of type) {
            val.uid && list.push(val.uid);
          }
        }
        return list;
      },

    },
    created() {
      this.$store.dispatch('getPageShopData');
    },

    methods: {
      // 下载
      downShopList() {
        if(this.downForm.shop.length > 0) {
          this.iconShow = true;
          let params = {
            lang: this.lang,
            userids: this.downForm.shop.join(",")
          };
          let downUrl = `${config.host}/merchant/download/qrcodes?${qs.stringify(params)}`;
          let a = document.createElement('a');
          a.setAttribute('download', 'true');
          a.setAttribute('href', downUrl);
          a.setAttribute('target', '_self');
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            this.iconShow = false;
            this.showDown = false;
          }, 1000)
        }else {
          this.$message.error(this.$t('shopmng.dialog.nullTip'));
        }

      },

      // 点击下载分店二维码
      editShopDown() {
        this.downForm = {
          shop: this.allType,
          checkAll: true
        };

        this.showDown = true;
      },

      // 选择分店
      handleCheckedShopChange(value) {
        let checkCount = value.length;
        this.downForm.checkAll = checkCount === this.allType.length;
      },

      // 选择全部
      handleCheckAllChange(event) {
        this.downForm.shop = event.target.checked ? this.allType : [];
      },

      refreshSubShopData() {
        this.$store.dispatch('getPageShopData');
        this.$store.dispatch('getShopList');
        this.showEditSubShopNum = false;
      },
      updateShopTag(shop) {
          let _tag = shop.tag;
          if(_tag.length > 20) {
              this.$message.error(this.$t('shopmng.dialog.msg.m10'));
              return;
          }
          if(hasSpetialChar(_tag)) {
            this.$message.error(this.$t('shopmng.dialog.msg.m11'));
              return;
          }
          axios.post(`${config.host}/merchant/sub/tag_add`, {
            userid: shop.uid,
            tag: shop.tag,
            format: 'cors'
          }).then((res) => {
            let data = res.data;
            if (data.respcd === config.code.OK) {
              this.$message({
                type: 'success',
                message: this.$t('common.modSucc')
              });
            } else {
              this.$message.error(this.$t('common.modFailed'));
            }
          }).catch((e) => {
            this.$message.error(e);
          })
      },
      // 检查提交主账户密码
      checkPrimeShopPwd(formName, context) {
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid && !_this.iconShow) {
            // 发验证主账户密码请求
            _this.iconShow = true;
            _this.doCheckPrimePwd();
          } else {
            console.log("validate doesn't passed!!");
            return false;
          }
        });
      },
      doCheckPrimePwd() {
        axios.post(`${config.host}/merchant/validate_password`, {
          password: this.formpwd.primeaccountpwd,
          format: 'cors'
        }).then((res) => {
          let data = res.data;
          if (data.data.result === 'success') {
            this.unbind(this.shouldDeleteUid);
          } else {
            this.$message.error(this.$t('shopmng.dialog.msg.m12'));
            this.iconShow = false;
          }
        }).catch((e) => {
          this.iconShow = false;
          this.$message.error(e);
        })
      },

      // 编辑子商户
      editSubShopNum() {
        this.showEditSubShopNum = true;
      },
      // 确认是否删除分店
      confirmDeleteShop(uid) {
        this.shouldDeleteUid = uid;
        this.showDeleteShopConfirm = true;
      },
      // 创建子门店
      createShop() {
        this.$router.push('/main/chainmanage/createsubshop');
      },
      // 修改密码
      changePass(type, name) {
        this.type = type;
        this.userName = name;
        this.showChangePass = true;
      },

      // 关闭弹出层,清除表单
      handleClose(formName) {
        this.$refs[formName].resetFields();
      },

      // 大商户修改自己的密码提交
      submit() {
        this.$refs['form'].validate((valid) => {
          if (!this.iconShow && valid) {
            this.iconShow = true;

            let src;
            if (this.type === 'single') {
              src = 'big-submchnt';
            } else if (this.type === 'chain') {
              src = 'mchnt';
            }
            axios.post(`${config.oHost}/mchnt/user/reset_pwd`, {
              mobile: this.shop.mobile,
              password: this.form.pass,
              mode: 'change',
              username: this.userName,
              src: src,
              format: 'cors'
            }).then((res) => {
              let data = res.data;
              if (data.respcd === config.code.OK) {
                this.$message({
                  type: 'success',
                  message: this.$t('common.modSucc')
                });
                this.showChangePass = false;

                if(this.type === 'chain') {
                  this.logout();
                }
              } else {
                this.$message.error(data.respmsg);
              }
              this.iconShow = false;
            }).catch(() => {
              this.$message.error(this.$t('common.netError'));
              this.iconShow = false;
            });
          }
        });
      },

      // 退出登录
      logout() {
        axios.get(`${config.host}/merchant/signout`, {
          params: {
            format: 'cors'
          }
        })
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

      // 改变size
      handleSizeChange(size) {
        this.pageSize = size;
        this.currentChange();
      },

      currentChange(current) {
        console.log(current)

        if (!current && this.currentpage !== 1) {
          this.currentpage = 1;
          return;
        }
        if (current) {
          this.currentpage = current;
        }

        this.$store.dispatch({
          type: 'getPageShopData',
          start: current ? current - 1 : 0,
          len: this.pageSize
        });
      },

      associate() {
        this.visible = true;
      },
      submit_bind() {
        this.$refs['associate_form'].validate((valid) => {
          if (valid) {
            this.iconShow = true;
            axios.post(`${config.host}/merchant/sub/bind`, this.associate_form)
              .then((res) => {
                this.iconShow = false;
                let data = res.data;
                if (data.respcd === config.code.OK) {
                  this.$message({
                    type: 'success',
                    message: '绑定成功!'
                  });
                  this.visible = false;
                  this.$refs['associate_form'].resetFields();

                  this.handleSizeChange(10);
                  this.$store.dispatch('getShopList');
                } else {
                  this.$message.error(data.resperr);
                }
              }).catch((e) => {
              this.iconShow = false;
              console.log(e.stack);
            });
          }
        });
      },

      unbind(uid) {
        axios.get(`${config.host}/merchant/sub/remove`, {
          params: {
            sub_uid: uid,
            format: 'cors'
          }
        })
          .then((res) => {
            let data = res.data;
            if (data.respcd === config.code.OK) {
              this.$message({
                type: 'success',
                message: this.$t('shopmng.dialog.msg.m13')
              });
              this.shouldDeleteUid = '';
              this.formpwd.primeaccountpwd = '';
              this.showDeleteShopConfirm = false;

              this.handleSizeChange(10);
              this.$store.dispatch('getShopList');
            } else {
              this.$message.error(data.resperr);
            }
            this.iconShow = false;
          })
          .catch((e) => {
            this.$message.error(e);
            this.iconShow = false;
          });
      },

      showDetail(scope) {
        axios.get(`${config.host}/merchant/info`, {
          params: {
            userid: scope.row.uid,
            is_abroad: 1,
            format: 'cors'
          }
        })
          .then((res) => {
            let data = res.data;
            if (data.respcd === config.code.OK) {
              this.detailData = data.data;
              this.isShowDetail = true;
            } else {
              this.$message.error(data.respmsg);
            }
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .panel-header__desc {
    font-size: 18px;
    color: #FE9B20;
    float:left;
  }

  .panel-header__fix {
    padding-right: 15px;
    line-height:50px;
  }
  .panel-select-group {
    justify-content: space-between;
    line-height: 50px;
  }
  .panel-select-group__justify {
    justify-content: space-between;
  }
  /*.el-form-item__content:last-child {*/
    /*margin-left: 32px !important;*/
  /*}*/
  .info_wrapper {
    padding: 20px 0px 30px 10px;
    @at-root .info {
      display: flex;
      height: 28px;
      align-items: flex-end;
      &:first-child {
        margin-bottom: 18px;
      }

      @at-root .info__title {
        font-size: 16px;
        color: #8A8C92;
        width: 100px !important;
        margin-right: 0 !important;
      }
      @at-root .info__title.info__title_en {
        width: 140px !important;
      }
      @at-root .info__sign {
        margin: 0px 10px 0px 0px;
      }
      @at-root .info__desc {
        font-size: 16px;
        color: #1F2D3D;
      }
    }
  }

  .table_placeholder {
    height: 50px;
  }

  .detail_dialog {
    .el-dialog {
      width: 580px;
    }
    .el-dialog__title {
      font-size: 20px;
    }
    .title {
      font-size: 16px;
      color: black;
    }
    .desc {
      color: black;
    }
  }
  .chain {
    .panel-header-btn {
      width: 150px;
    }
    .panel-header-btn-ja {
      width: 200px;
    }
    .btn-group .panel-header-btn__associate+.el-button {
      margin-left: 20px;
    }
    .panel-edit-btn__subshopnum {
      width: 164px;
    }
    .pass {
      width: 420px;
      .el-dialog__header {
        text-align: center;
      }
      .el-form-item__label {
        width: 90px;
      }
    }
    .el-tooltip.subshoptip {
      display: inline-block;
      width: 100px;
      overflow: hidden;
      height: 16px;
      line-height: 16px;
      vertical-align: middle;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .edit-sub-tag {
      height:420px;
      overflow-y: auto;
    }
    .down-sub-shop {
      max-height:420px;
      overflow-y: auto;
      .el-checkbox-group .el-checkbox {
        display: block;
        margin-left: 0;
      }
    }
    .downlog {
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
    .mydialog .el-dialog__body {
      padding: 0 !important;
    }
    .mydialog  {
      .el-dialog.el-dialog--small.mydialog_haiwai {
        width: auto !important;
      }
    }
  }
  .btn-group {
    display: flex;
    align-items: center;
  }
</style>
