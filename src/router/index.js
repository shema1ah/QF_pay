import Vue from 'vue'
import Router from 'vue-router'

import login from 'components/login/login'
import register from 'components/register/register'
import main from 'components/main/main'
import index from 'components/index/index'
import settlement from 'components/settlement/settlement'
import chainmanage from 'components/chainmanage/chainmanage'
import singlemanage from 'components/singlemanage/singlemanage'
import transctl from 'components/transctl/transctl'
import checking from 'components/checking/checking'
import transdetail from 'components/transdetail/transdetail'
import member from 'components/member/member'
import emailSetting from 'components/emailSetting/emailSetting'
import passSetting from 'components/passSetting/passSetting'
import cashiermanage from 'components/cashiermanage/cashiermanage'
import addcashier from 'components/addcashier/addcashier'
import cashierdetail from 'components/cashierdetail/cashierdetail'
import overseaForget from 'components/overseaforget/overseaforget'
import firstLogin from 'components/firstlogin/firstlogin'
import contact from 'components/contact/contact'
import device from 'components/deviceManage/deviceManage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: login
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/firstLogin',
      component: firstLogin
    },
    {
      path: '/register',
      component: register,
      name: 'register'
    },
    {
      path: '/forget',
      component: register,
      name: 'forget'
    },
    {
      path: '/overseaForget',
      component: overseaForget,
      name: 'overseaForget'
    },
    {
      path: '/main',
      component: main,
      redirect: '/main/index',
      children: [
        {
          path: 'index',
          component: index
        },
        {
          path: 'settlement',
          component: settlement
        },
        {
          path: 'transctl',
          component: member,
          children: [
            {
              path: '',
              component: transctl
            },
            {
              path: 'transdetail',
              name: 'transdetail',
              component: transdetail
            }
          ]
        },
        {
          path: 'transCheck',
          component: checking
        },
        {
          path: 'chainmanage',
          component: chainmanage,
        },
        {
          path: 'singlemanage',
          component: singlemanage
        },
        {
          path: 'emailSetting',
          component: emailSetting
        },
        {
          path: 'passSetting',
          component: passSetting
        },
        {
          path: 'deviceSetting',
          name: 'device',
          component: device
        },
        {
          path: 'cashiermanage',
          component: member,
          children: [
            {
              path: '',
              component: cashiermanage
            },
            {
              path: 'addcashier',
              name: 'addcashier',
              component: addcashier
            },
            {
              path: 'cashierdetail',
              name: 'cashierdetail',
              component: cashierdetail
            }
          ]
        },
        {
          path: 'contact',
          name: 'contact',
          component: contact
        }
      ]
    }
  ],
  linkActiveClass: 'active'
})
