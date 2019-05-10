'use strict';

exports.__esModule = true;
exports.default = {
  nav: {
    mmp: '商戶管理後台',
    index: '首頁概覽',
    settlement: '清算管理',
    tradeMng: '交易管理',
    tradeAssign: '交易流水',
    refundCheck: '退款審核',
    shopMng: '賬戶信息',
    cashMng: '收銀員管理',
    setup: '設置',
    passSet: '管理密碼設置',
    emailSet: '電子郵件設置',
    contact: '聯繫我們',
    device: '設備綁定'
  },
  common: {
    ok: '確 定',
    cancel: '取 消',
    close: '關 閉',
    confirm: '確 認',
    tip: '提示',
    all: '全部',
    none: '無',
    netError: '網絡錯誤',
    loading: '拼命加載中',
    modSucc: '修改成功',
    modFailed: '修改失敗',
    logout: '退出',
    del: '刪除',
    msg: {
      sel: '請選擇'
    }
  },
  main: {
    bigMerchant: '企業',
    merchant: '單店',
    subMerchant: '分店',
    cashier: '收銀員'
  },
  shopmng: { // 门店管理模块
    crumbs: {
      L1: '賬戶信息'
    },
    title: {
      baseInfo: '基本信息',
      subInfo: '分店信息'
    },
    panel: {
      shopName: '商戶名稱',
      loginAccount: '登錄賬號',
      btn: {
        editPwd: '修改密碼',
        editSub: '編輯分店',
        editSubTag: '編輯分店編號',
        down: '下載店鋪收款碼',
        listDown: '下載分店二維碼'
      },
      table: {
        subName: '分店名稱',
        loginAccount: '登錄賬號',
        regTime: '註冊時間',
        subTag: '分店編號',
        op: '操作',
        detail: '查看詳情',
        more: '更多',
        editPwd: '修改密碼',
        delSub: '刪除分店'
      }
    },
    dialog: {
      editPwd: '修改密碼',
      loginAccount: '登錄賬號',
      inputNewPwd: '輸入新密碼',
      confirmNewPwd: '確認新密碼',
      msg: {
        m1: '請輸入新密碼',
        m2: '請輸入確認新密碼',
        m3: '新密碼與確認密碼不一致',
        m4: '請輸入6~20位數字或字母',
        m5: '請輸入總賬戶密碼',
        m6: '請輸入分店賬號',
        m7: '請輸入分店登錄密碼',
        m8: '請輸入分店收款人姓名!',
        m9: '請輸入分店收款銀行卡號!',
        m10: '請輸入二十以內的文字或字母',
        m11: '不能含有特殊字符',
        m12: '密碼不正確',
        m13: '删除分店成功!'
      },
      cancel: '取消',
      ok: '確定',
      confirm: '確認',
      shopDetail: '門店詳情',
      shopName: '店鋪名稱',
      address: '地址',
      mobile: '手機號碼',
      cardHolder: '持卡人',
      bankAccount: '銀行賬戶',
      bankName: '銀行名稱',
      editSubTag: '编辑分店编号',
      diaTip: '分店編號設置成功後將會顯示在下載的交易明細和交易匯總中',
      validateText: '請輸入二十以內的文字或字母',
      validateText2: '請輸入總賬戶登錄密碼',
      notice: '提示',
      noticeTip: '刪除分店前建議先終止該分店正在進行的會員營銷活動。',
      downTip: '選擇需要下載收款碼的分店名稱：',
      nullTip: '請至少選擇一家分店',
      all: '全選'
    }
  },
  tradeMng: { // 交易流水
    crumbs: {
      L1: '交易管理',
      L2: '交易詳情',
      L3: '退款詳情',
      L4: '交易流水'
    },
    panel: {
      time: '時間',
      range: '選擇日期範圍',
      today: '今天 ',
      yestoday: '昨天',
      near7: '近7天',
      near30: '近30天',
      near365: '近壹年',
      shopName: '店鋪名稱',
      operator: '收銀員',
      moreFilter: '更多篩選',
      noLimit: '不限',
      dd: '撤銷詳情', // 撤销明细
      sNum: '商戶單號', // 流水号
      tip: '請輸入序列號',
      btn: {
        query: '查詢',
        reset: '重置'
      }
    },
    table: {
      totalAmount: '交易總金額',
      totalNum: '交易總次數',
      succAmount: '成功交易金額',
      succ: '成功交易次數',
      refundMount: '退款金額',
      refundNum: '退款次數',
      bi: '次',
      undo: '撤銷詳情',
      shopName: '店鋪名稱',
      operator: '收銀員',
      all: '全部',
      main: '門店帳戶',
      colWay: '收款方式',
      wechatCollect: '微信收款',
      alipay: '支付寶收款',
      tradeType: '交易類型',
      tradeTime: '交易時間',
      tradeAmount: '交易金額',
      originAmount: '應收',
      tradeState: '交易狀態',
      redpacket: '紅包優惠',
      sNum: '序列號',
      chnlsn: '外部訂單號',
      src: '用戶來源',
      cardCd: '銀行卡號',
      remark: '備註',
      op: '操作',
      cancel: '退款',
      more: '更多',
      detail: '查看詳情',
      download: '下載電子小票',
      ac: '實收', // 实收
      red: '商家紅包', // 商家红包
      plat: '平台補貼', // 平台补贴
      btn: {
        downDetail: '下載交易明細',
        downTrade: '下載交易匯總'
      }
    },
    detail: {
      amount1: '訂單金額',
      amount2: '退款金額',
      origin: '消費者來源',
      time: '退款時間',
      syssn1: '訂單流水號',
      syssn2: '原訂單流水號',
      syssn3: '退款流水號',
      store: '交易店舖',
      account: '操作帳戶',
      history: '退款歷史',
      amount3: '實收金額',
      count1: '實收幣數',
      count2: '訂單幣數',
      syssn4: '區塊鏈訂單號'
    },
    dialog: {
      d1: '操作後不可撤回，是否確認？',
      d2: '確認退款',
      d3: '成功',
      d4: '失敗',
      d5: '密碼',
      d6: '退款',
      d7: '退款中'
    },
    msg: {
      m1: '商戶單號必須為數字',
      m2: '商戶單號需要最少14位!！',
      m3: '首次獲取交易列表失敗',
      m4: '獲取交易數據失敗',
      m5: '獲取收銀員信息失敗',
      m6: '撤銷成功',
      m7: '撤銷失敗',
      m8: '請輸入序列號',
      m9: '請輸入賬戶密碼',
      m10: '密碼不正確',
      m11: '您暫無權限執行此操作',
      m12: '超過可退款金額',
      m13: '退款失敗，請聯繫我們查詢原因',
      m14: '最大可退款金額',
      m15: '請輸入退款金額',
      m16: '請輸入有效退款金額'
    }
  },
  refundCheck: { // 退款审核
    crumbs: {
      L1: '交易管理',
      L2: '退款審核'
    },
    panel: {
      time: '申請時間',
      shopName: '交易店舖',
      operator: '收銀員',
      oNUm: '原訂單流水號',
      tip: '請輸入原訂單流水號',
      btn: {
        query: '查詢',
        reset: '重置'
      }
    },
    table: {
      applyAmount: '申請賬戶',
      tradeType: '交易類型',
      tradeTime: '交易時間',
      refundMount: '退款金額',
      tradeAmount: '交易金額',
      sNum: '商戶單號',
      checkState: '審核狀態',
      waiting: '等待審核',
      approved: '已批准',
      rejected: '已拒絕',
      op: '操作',
      approve: '批准',
      reject: '拒絕'
    },
    dialog: {
      d1: '操作後不可撤回，是否確認批准？',
      d2: '操作後不可撤回，是否確認拒絕？',
      d3: '確認批准',
      d4: '確認拒絕'
    },
    msg: {
      m1: '管理密碼',
      m2: '請輸入管理密碼',
      m3: '操作成功',
      m4: '退款操作成功，等待支付通道處理中。'
    }
  },
  home: { // 首页概览
    crumbs: {
      L1: '首頁概覽'
    },
    title: {
      t1: '交易數據統計',
      t2: '交易走勢圖'
    },
    panel: {
      t1: '今日會員新增',
      t2: '今日交易金額',
      tc: '今日回頭客',
      cmnew: '本月會員新增',
      cumulativeMembership: '累計會員數',
      tta: '今日交易筆數',
      tincome: '今日實收',
      cmincome: '本月實收',
      noActivity: '暫無活動'
    },
    chart: {
      bill: '筆數',
      noTrans: '暫無交易',
      account: '實收',
      time: '時間',
      sum: '金額',
      tp1: '暫僅支持查詢 30 天內的走勢'
    }
  },
  settlement: { // 清算管理
    crumbs: {
      L1: '清算管理'
    },
    panel: {
      time: '時間',
      today: '今天 ',
      yestoday: '昨天',
      near7: '近7天',
      near30: '近30天',
      type: '類型',
      btn: {
        query: '查詢',
        reset: '重置',
        downAll: '下載全部'
      }
    },
    table: {
      settleTime: '清算時間',
      settleType: '清算類型',
      name: '帳號',
      amount: '開戶名',
      currency: '幣種',
      total: '交易總額',
      charge: '手續費',
      settleAmount: '清算金額',
      op: '操作',
      download: '下載'
    },
    msg: {
      m1: '獲取清算數據失敗',
      m2: '目前僅支持查詢30天內的數據',
      m3: '暫無數據可以下載'
    },
    tip: {
      m1: '手續費總額是按照每筆訂單乘以費率再進行四捨五入相加後得出'
    }
  },
  login: { // 登录页
    head: '商戶管理後台',
    reg: '註冊賬號',
    user: '主賬號',
    cash: '收銀員編號',
    ltsix: '6位以上',
    login: '登錄',
    forgetPwd: '忘記密碼?',
    tab1: '商戶',
    tab2: '收銀員',
    msg: {
      m1: '請輸入賬號',
      m2: '請輸入密碼',
      m3: '登錄失敗',
      m4: '請輸入主賬號',
      m5: '請輸入收銀員編號',
      m6: '未發現此帳號'
    }
  },
  setting: { // 邮箱设置页
    crumbs: {
      L1: '設置',
      L2: '電子郵件設置',
      L3: '設備綁定'
    },
    panel: {
      mailSetup: '電子郵件設置',
      mail: '電子郵件',
      explain: '我們會在次日上午7點，把前一天的交易記錄發送給您。',
      dailySend: '每日發送交易報表',
      modi: '修改',
      confirm: '確認',
      amount: '門店帳號',
      device: '設備編號'
    },
    btn: {
      query: '查詢',
      reset: '重置'
    },
    table: {
      merchant: '大商戶名稱',
      shopName: '店鋪名稱',
      time: '綁定時間',
      close: '解綁'
    },
    dialog: {
      d1: '添加設備',
      d2: '解綁設備'
    },
    msg: {
      m1: '請輸入郵箱地址',
      m2: '請輸入正確的電郵地址',
      m3: '獲取電郵設置失敗!',
      m5: '已經添加過這個郵箱了!',
      m6: '最多只能添加10個郵箱',
      m7: '是否確認解綁',
      m8: '解綁成功',
      m9: '請輸入門店帳號',
      m10: '請輸入裝置編號',
      m11: '添加成功',
    },
    tip: {
      m1: '刪除最後一個郵箱會關掉郵件報表的功能，確認刪除嗎？'
    }
  },
  passSet: { // 管理密码设置
    crumbs: {
      L1: '設置',
      L2: '管理密碼設置'
    },
    panel: {
      passMsg: '管理密碼：',
      explain: '用途：設置後，隔日退款審批 將通過輸入管理密碼完成確認驗證。',
      states1: '未設置',
      states2: '已設置',
      bt1: '設置',
      bt2: '重置',
      bt3: '保存',
      title1: '設置管理密碼',
      title2: '重置管理密碼',
      safe: '安全驗證',
      pass: '管理密碼',
      reEnter: '再次輸入',
      originPass: '原管理密碼',
      newPass: '新管理密碼'
    },
    msg: {
      m1: '請輸入登錄密碼',
      m2: '請輸入管理密碼',
      m3: '請再次輸入管理密碼',
      m4: '請輸入6~20位數字或字母',
      m6: '請輸入原管理密碼',
      m7: '請輸入新管理密碼',
      m8: '請再次輸入新管理密碼',
      m9: '與管理密碼輸入不一致',
      m10: '設置成功'
    },
    tip: {
      m1: '* 忘記原密碼？ 請聯繫客服處理'
    }
  },
  cashMng: { // 收银员管理
    crumbs: {
      L1: '收銀員管理',
      L2: '查看詳情',
      L3: '添加收銀員',
      L4: '批量添加'
    },
    common: {
      status: '帳戶狀態',
      number: '收銀員編號',
      name: '姓名',
      mobile: '電話',
      shop: '門店',
      user: '主賬號',
      password: '收銀員密碼',
      m1: '帳戶已禁用',
      m2: '帳戶已啟用',
      m5: '請輸入收銀員姓名',
      m6: '請輸入收銀員電話',
      m7: '請輸入收銀員密碼！',
      m8: '姓名長度為2–20位！',
      m9: '請輸入合法的手機號！',
      m10: '密碼長度為6–15位！',
      tip1: '* 收銀員登錄方式為主賬戶+收銀員編號+收銀員密碼'
    },
    dialog: {
      title: '批量添加收銀員',
      d1: '請選擇收銀員的表單文件',
      d2: '選擇文件',
      d3: '上傳',
      d4: '下載模板',
      d5: '上傳成功'
    },
    mng: {
      status1: '已啟用',
      status2: '已禁用',
      status3: '啟用帳戶',
      status4: '禁用帳戶',
      name: '收銀員名稱',
      mobile: '收銀員電話',
      op: '操作',
      detail: '查看詳情',
      m5: '獲取收銀員數據失敗'
    },
    detail: {
      title: '收銀員資料',
      btn: '編輯收銀員資料'
    },
    add: {
      title: '添加收銀員',
      tip1: '添加收銀員成功',
      tip2: '獲取收銀員編號失敗',
      btn1: '取消',
      btn2: '確認'
    }
  },
  contact: { // 客服
    phone: '電話',
    email: '郵箱'
  },
  overseaForget: {
    enterEmail: '請輸入您的郵箱', //
    emailAddr: '郵箱地址', //
    // tryAnother: '試試其他方法',
    next: '下一步',
    confirm: '確 認',
    notExist: '該帳號未註冊，請確認您的郵箱是否正確',
    sendCode: '我們會給您的郵箱發送驗證碼，請輸入驗證碼',
    resend: '重新發送',
    code: '驗證碼',
    newPwd: '新密碼',
    enterCode: '請輸入驗證碼',
    char: '密碼長度為6–20位！',
    rePwd: '重置密碼',
    invalidEmail: '無效的郵箱格式',
    text1: '我們會給',
    text2: '發送驗證碼，請輸入驗證碼',
    secend1: "( ",
    secend2: 's )後可以重發',
    codeResent: '驗證碼發送成功',
    wrongCode: '驗證碼錯誤',
    filledCode: '驗證碼不能為空',
    frequently: '驗證碼獲取頻繁，請稍候再試'
  },
  firstlogin: {
    congratulation: '恭喜您登陸成功',
    changePwd: '請修改您的初始密碼',
    newPwd: '新密碼',
    rePwd: '確認密碼',
    confirm: '確  認'
  }
}
