<template>
  <div class="index" v-loading="loading" :element-loading-text="$t('common.loading')">
    <div class="banner_wrapper">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>{{$t('home.crumbs.L1')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="panel">
      <div class="panel-header panel-header__fix">
        <div class="panel-select-group">
          <h2 class="panel-header__desc">{{$t('home.title.t1')}}</h2>
        </div>
      </div>

      <div class="panel-body panel-today">
        <div class="fee">
          <h3>{{$t('home.panel.t2')}}</h3>
          <strong><em>{{info.today_total_amt | formatCurrency}}</em> {{ role.currency }}</strong>
          <ul>
            <li>
              <strong><i></i>{{$t('home.panel.tta')}}</strong>
              <span><em>{{info.nums || 0}}</em>{{role.haiwai ? '' : ' 笔'}}</span>
            </li>
            <li>
              <strong><i></i>{{$t('home.panel.tincome')}}</strong>
              <span><em>{{info.today_txamt | formatCurrency}}</em> {{ role.currency }}</span>
            </li>
            <li>
              <strong><i></i>{{$t('home.panel.cmincome')}}</strong>
              <span><em>{{info.month_txamt | formatCurrency}}</em> {{ role.currency }}</span>
            </li>
          </ul>
        </div>
        <div>
          <div id="main" style="width: 100%; height: 100%"></div>
        </div>
      </div>
    </div>

    <div class="panel down">
      <div class="panel-header panel-header__fix">
        <div class="panel-select-group">
          <h2 class="panel-header__desc">{{ $t('home.title.t2') }}</h2>
        </div>
      </div>
      <div class="panel-header__auto">
        <el-form :model="form" ref="form">
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
                  :clearable="false"
                  @change="timeChange">
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
            <div class="panel-header-btn-group">
              <div class="panel-header-btn panel-header-btn__fill" @click="search">
                <span class="el-icon-loading" v-if="loading1"></span>
                <span v-else>{{$t('tradeMng.panel.btn.query')}}</span>
              </div>
            </div>
          </div>
        </el-form>
      </div>

      <div class="panel-body panel-today">
        <div>
          <div id="line" style="width: 100%; height: 400px"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import config from 'config'
  import { formatDate } from '../../common/js/util';
  import echarts from 'echarts/lib/echarts'
  require("echarts/lib/chart/pie");
  require("echarts/lib/chart/line");
  require("echarts/lib/component/tooltip");
  require("echarts/lib/component/legendScroll");

  import Store from '../../common/js/store'
  export default {
    data() {
      return {
        status: false,
        loading: false,
        loading1: false,
        role: Store.get("role") || {},
        info: {},
        choosetimes: [
          {'name': this.$t('tradeMng.panel.today'), 'value': '1'},
          {'name': this.$t('tradeMng.panel.yestoday'), 'value': '2'},
          {'name': this.$t('tradeMng.panel.near7'), 'value': '7'},
          {'name': this.$t('tradeMng.panel.near30'), 'value': '30'}
        ],
        form: {
          selectShopUid: '',
          dateRangeValue: '',
          operaValue: '',
          choosetime: '1'
        },
        operaList: {},
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
          format: 'cors'
        };
      }
    },

    watch: {
      'form.dateRangeValue': function (val) {
        if (!this.status) {
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

      // 收银员角色跳转实时收款
      if(this.role.isCashier) {
        this.$router.push('/main/transctl');
      }else {
        this.loading = true;
        Promise.all([this.fetchDashboardData(), this.getData()]).then((data) => {
          this.loading = false;
          this.info = data[0];
          
          this.chartPie(this.info.trade_stats);
          this.chartLine(data[1]);
        }).catch(() => {
          this.loading = false;
        })
      }
    },

    methods: {
      timeChange() {
        let [start, end] = this.form.dateRangeValue;
        if(end.valueOf() - start.valueOf() > 30 * 24 * 3600 * 1000) {
          this.$message.error(this.$t('home.chart.tp1'));
          this.changeTime('1');
        }
      },
      // 饼图
      chartPie(data) {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('main'));
        let option = {};
        // 指定图表的配置项和数据
        if(data.values.length > 0) {
          option = {
            // color: ['#7ED321', '#00AAEE', '#F9291D', '#00C73C', '#255CBE', '#FF8100'],
            color: data.colors,
            tooltip: {
              trigger: 'item',
              formatter: (params) => {
                let str = `${params.name} (${params.percent}%)<br/>${this.$t('home.chart.bill')}: ${params.data.num}<br/>${this.$t('home.chart.account')}: ${params.value} ${this.role.currency}`;
                return str;
              },
              backgroundColor: '#fff',
              padding: [10],
              extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);text-align: left;min-width: 150px;',
              textStyle: {
                color: '#262424',
                fontSize: 15,
              }
            },
            legend: {
              top: 'middle',
              orient: 'vertical',
              right: '15%',
              itemWidth: 14,
              data: data.names,
              selectedMode: false
            },
            series: [{
              type: 'pie',
              center: ['30%', '50%'],
              radius: ['60%', '80%'],
              label: {
                normal: {
                  formatter: "{d}%",
                  fontStyle: 'bold',
                  color: '#2d2c2c',
                  fontSize: '14'
                }
              },
              labelLine: {
                length: 10,
                length2: 5
              },
              data: data.values
            }]
          };
        }else {
          let [name, list] = [data.names, []];
          for(let item of name) {
            list.push({
              name: item,
              value: 0
            })
          }

          option = {
            // color: ['#7ED321', '#00AAEE', '#F9291D', '#00C73C', '#255CBE', '#FF8100'],
            color: data.colors,
            legend: {
              top: 'middle',
              orient: 'vertical',
              right: '15%',
              itemWidth: 14,
              data: name,
              selectedMode: false
            },
            series: [{
              type: 'pie',
              center: ['30%', '50%'],
              radius: ['60%', '80%'],
              label: {
                normal: {
                  position: 'center',
                  fontStyle: 'bold',
                  color: '#2d2c2c',
                  fontSize: '14'
                }
              },
              itemStyle: {
                color: '#ccc'
              },
              data: [{name: this.$t('home.chart.noTrans'), value: 1}]
            }, {
              type: 'pie',
              radius: [0, 0],
              label: {
                normal: {
                  show: false
                }
              },
              data: list
            }]
          };
        }

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      },

      // 交易折线图
      chartLine(data) {
        let myChart1 = echarts.init(document.getElementById('line'));
        let option1 = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'none'
            },
            formatter: (param) => {
              let params = param[0];
              let str = `${params.name}<br/>${this.$t('home.chart.bill')}: ${params.data.num}<br/>${this.$t('home.chart.account')}: ${params.value} ${this.role.currency}`;
              return str;
            },
            backgroundColor: '#fff',
            padding: [10],
            extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);text-align: left;min-width: 150px;',
            textStyle: {
              color: '#262424',
              fontSize: 15,
            }
          },
          xAxis: {
            type: 'category',
            name: this.$t('home.chart.time'),
            data: data.dates,
            axisTick: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            name: `${this.$t('home.chart.sum')}(${this.role.currency})`,
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          },
          series: [{
            data: data.values,
            type: 'line',
            areaStyle: {
              color: {
                type: 'linear',
                opacity: 0.2,
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#fedf71' // 0% 处的颜色
                }, {
                  offset: 1, color: '#FFF' // 100% 处的颜色
                }]
              }
            },
            lineStyle: {
              color: '#FE9B20'
            },
            itemStyle: {
              color: '#FE9B20',
            },
            emphasis: {
              itemStyle: {
                color: '#FE9B20'
              }
            },
            symbolSize: 10
          }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart1.setOption(option1);
      },

      // 交易统计
      fetchDashboardData() {
        return new Promise((resolve, reject) => {
          axios.get(`${config.host}/merchant/dashboard/abroad/stats`, {
          params: {
            format: 'cors'
          }
        }).then((res) => {
            let data = res.data;
            if(data.respcd === config.code.OK) {
              resolve(data.data || {});
            } else {
              reject(new Error());
              this.$message.error(data.resperr);
            }
          }).catch(() => {
            reject(new Error());
            this.$message.error(this.$t('common.netError'));
          });
        })
      },

      // 交易走势
      getData() {
        return new Promise((resolve, reject) => {
          axios.get(`${config.host}/merchant/dashboard/abroad/trade/stats`, {
            params: this.basicParams
          }).then((res) => {
            let data = res.data;
            if(data.respcd === config.code.OK) {
              resolve(data.data || {});
            } else {
              reject(new Error());
              this.$message.error(data.resperr);
            }
          }).catch(() => {
            reject(new Error());
            this.$message.error(this.$t('common.netError'));
          });
        })
      },

      // 点击查询
      search() {
        this.loading1 = true;
        this.getData().then((data) => {
          this.loading1 = false;
          this.chartLine(data);
        }).catch(() => {
          this.loading1 = false;
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

      // 选择收银员
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
    }
  };
</script>

<style lang="scss" scoped>
  .index {
    .panel-body.panel-today{
      padding: 28px 0;
    }
    .panel-today {
      display: flex;
      > div {
        flex: 1;
        text-align: center;
        &:first-child:not(:only-child) {
          border-right: 1px solid #E8E7E6;
        }
        > strong {
          color: #FE9B20;
          em {
            font-size: 34px;
          }
        }
      }
      h3 {
        font-weight: bold;
        margin-bottom: 12px;
      }
      ul {
        width: 80%;
        max-width: 480px;
        padding-top: 10px;
        padding-bottom: 15px;
        margin: 0 auto;
      }
      li {
        text-align: right;
        line-height: 32px;
        strong {
          float: left;
          i {
            width: 7px;
            height: 7px;
            vertical-align: middle;
            margin-right: 10px;
            border-radius: 7px;
            display: inline-block;
            background-color: #8883F4;
          }
          color: #8A8C92;
        }
      }
      .fee i{
        background-color: #F5A623;
      }
    }
    .data-show {
      padding: 0 25px;
      h2 {
        font-size: 18px;
        padding-bottom: 12px;
      }
    }
    .content {
      margin-right: -12px;
      .item {
        width: 300px;
        cursor: pointer;
        margin-bottom: 18px;
        display: inline-block;
        margin-right: 12px;
        background-color: #fff;
        box-shadow: 0 3px 3px #E8E7E6;
        &:hover {
          box-shadow: 5px 5px 5px #E8E7E6;
        }
        h3 {
          i {
            width: 5px;
            height: 22px;
            vertical-align: middle;
            margin-right: 10px;
            display: inline-block;
            background: #FF3D1F url('./img/title-bg.png') no-repeat 0 -1px;
            &.collect {
              background-color: #8883F4;
            }
            &.store {
              background-color: #FF8100;
            }
          }
          line-height: 40px;
          font-size: 15px;
          border-bottom: 1px solid #E8E7E6;
        }
        ul {
          padding: 20px 5%;
        }
        .title {
          padding:25px 0 10px 15px;
          i {
            width: 28px;
            height: 28px;
            margin-right: 5px;
            display: inline-block;
            background: url('./img/icons.png') no-repeat;
            &.collect {
              background-position: -28px 0;
            }
            &.store {
              background-position: -56px 0;
            }
          }
          i, span {
            vertical-align: middle;
          }
          strong {
            font-size: 14px;
            display: block;
            color: #262424;
            padding-bottom: 8px;
          }
          span {
            display: inline-block;
            font-size: 12px;
            color: #C2C2C2;
          }
        }
        li {
          width: 30%;
          display: inline-block;
          border-right: 1px solid #E8E7E6;
          text-align: center;
          &:last-child {
            border-right: none;
          }
          strong {
            color: #8A8C92;
            font-size: 12px;
            display: block;
            margin-bottom: 4px;
          }
          span {
            font-size: 12px;
            em {
              font-size: 16px;
            }
          }
        }
      }
    }
  }
</style>
