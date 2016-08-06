# Caro-Front
   
[介紹網站, 建構中](https://carozozo.github.io/caro-front/)   
   
### lib 介紹
- cf.ajax : $.ajax 延伸並簡化 success function; 可設定測試模式, 用來模擬 api response
- cf.alert : 用 popup 模擬 alert 的功能, 避免 browser 禁用 alert
- cf.cookie : 設置和讀取 cookie
- cf.dom : 提供 jQuery 基本功能外掛
- cf.fb : FB API 延伸函式庫, 解決部分 API 問題, 簡化呼叫方式和防呆
- cf.routeAnimate : cf.router 擴充換頁效果
- cf.router : 換頁函式庫, 使用 $.ajax 切換頁面, 並利用 url hash 記錄
- cf.tracking : 客製化 GA / GTM 函式庫, 簡化呼叫方式和防呆
- cf.unit : 單元函式庫, 提供一些未分類函式
- cf.website : 網頁函式庫

### module 介紹
- caroAddrDropdown : 地址下拉選單
- caroAnimated : 簡化外掛 Animate.css 使用方式
- caroCircleShow : DOM circle 輪播效果
- caroCompatibility : form 欄位相容性處理
- caroDateDropdown : 日期下拉選單
- caroImgSwitch : img 切換圖片
- caroJumpNum : 亂數效果, 數字會亂跳, 最後顯示結果
- caroListDom : 將 array 資料放到 DOM, 以 list 方式呈現, 例如得獎名單
- caroModal : modal 視窗
- caroMouseStyle : 客製化滑鼠樣式
- caroPicNum : 用圖片顯示數字, 需搭配圖檔
- caroPreLoad : 預載檔案, 一般用在 loading 頁面
- caroRandomDrop : 隨機產生滑落物件, 例如氣泡, 水滴效果, 需搭配圖檔
- caroScale : DOM 隨目標大小自動縮放, 預設為 $(window)
- caroScroll : 捲軸自動滑動到 DOM 定點 的功能
- caroScrollbar : 自訂捲軸樣式, 客製化外掛 mCustomScrollbar 使用方式
- caroSwitchShow : 輪流顯示 DOM, 預設顯示第一個
- caroSyncMove : 計算滑鼠和基準點的距離，同步移動 DOM
- caroUpload : 檔案上傳
- caroValidator : 表單驗證
- caroWheel : 綁定滑鼠滾輪 event, 客製化外掛 jquery.mousewheel 使用方式