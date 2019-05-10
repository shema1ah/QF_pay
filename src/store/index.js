import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import config from 'config'
import { Message } from 'qfpay-element-ui'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    shopData: [],
    pageShopData: []
  },
  mutations: {
    getPageShopData (state, payload) {
      state.pageShopData = payload.pageShopData;
    },
    getShopList (state, payload) {
      payload.shopData.list.unshift({shop_name: localStorage.getItem('lang') && JSON.parse(localStorage.getItem('lang')).value === 'en' ? 'All' : '全部', uid: ''})
      state.shopData = payload.shopData
    }
  },
  actions: {
    getPageShopData ({ commit }, payload) {
      axios.get(`${config.host}/merchant/sub/list`, {
        params: Object.assign({}, {start: 0, len: 10, format: 'cors'}, payload)
      })
      .then((res) => {
        let data = res.data
        if (data.respcd === config.code.OK) {
          commit({
            type: 'getPageShopData',
            pageShopData: data.data
          })
        } else {
          Message.error(data.respmsg)
        }
      })
      .catch(() => {
        Message.error(this.$t('common.netError'))
      })
    },
    getShopList ({ commit }, payload) {
      axios.get(`${config.host}/merchant/sub/list`, {
        params: {
          format: 'cors'
        }
      })
      .then((res) => {
        let data = res.data
        if (data.respcd === config.code.OK) {
          commit({
            type: 'getShopList',
            shopData: data.data
          })
        } else {
          Message.error(data.respmsg)
        }
      })
      .catch(() => {
        Message.error(this.$t('common.netError'))
      })
    }
  }
})

export default store
