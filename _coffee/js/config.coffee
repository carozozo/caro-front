do (cf) ->
  ###
  isLocalTest: 是否為 local 測試模式, 只在 local 有效
  localUrlPath: 用來判定目前所在的網址是否為 local, 最後面加上*代表只要前面符合就成立
  prodUrlPath: 用來判定目前所在的網址是否為 production, 最後面加上*代表只要前面符合就成立
  ###
  cf.config('cf', {
    isLocalTest: true
    localUrlPath: 'localhost*'
    prodUrlPath: 'carozozo.github.io/caro-front/'
  })
  ###
  templateDir: 放置分頁的資料夾路徑, 未設置代表 src 根目錄
  templateExtname: 放置的分頁路徑副檔名, 例如 html, php, jsp
  container: 分頁容器的 DOM id, 未設置時預設容器為 $('body')
  ###
  cf.config('router', {
    templateDir: 'template'
    templateExtname: '.html'
    container: 'container'
  })
  ###
  isTestMode: 是否為 ajax 測試模式, true 的時候會使用 fakeResponse(假的 response)
  responseErrKey: 判斷 response 裡面是回傳 error 的 key
  errMsg: 當執行 ajax 發生錯誤時要 alert 的訊息, 不設置或空值則不顯示
  ###
  cf.config('ajax', {
    isTestMode: false
    responseErrKey: 'error_message'
    errMsg: '伺服器發生錯誤, 請稍候再試'
  })
  ###
  isDownloadSdk: 是否要載入 fb-sdk
  sdkVersion: fb sdk 版本
  redirectAfterLogin: 當登入 fb 後要跳轉的頁面, 沒設時會回首頁
  appId: 網站所使用的 fb-app-id
  shareUrl: 分享網址, 需要可以在網路上找的到的 url, 所以不能用 localhost
  ###
  cf.config('fb', {
    isDownloadSdk: false
    sdkVersion: 'v2.7'
    redirectAfterLogin: 'go_back'
    appId: ''
    shareUrl: 'https://carozozo.github.io/caro-front/'
  })
  ###
  isDownloadGa: 是否下載 ga 函式庫
  gaId: ga 編號
  ###
  cf.config('ga', {
    isDownloadGa: false
    gaId: ''
  })
  ###
  imgPath: 放置圖片的路徑, 預設 'images/'
  ###
  cf.config('unit', {
    imgPath: 'https://carozozo.github.io/caro-front/images/'
  })
  ###
  type: 是否下載 gtm 函式庫
  gtmId: gtm 編號
  ###
  cf.config('gtm', {
    isDownloadGtm: false
    gtmId: ''
  })

  ### 當網址符合時, 載入不同的設定, 最後面加上星號代表只要前面符合就成立 ###
  cf.regDifCfg('www.demo.com/', {
    fb: {
      appId: ''
      shareUrl: 'http://www.demo.com/'
    }
    unit: {
      imgPath: 'http://www.demo.com/images/'
    }
  })
  cf.regDifCfg('www.demo.com/test/*', {
    fb: {
      appId: ''
      shareUrl: 'http://www.demo.com/test/'
    }
    unit: {
      imgPath: 'http://www.demo.com/test/images/'
    }
  })
  return