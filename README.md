# Caro-Front 介紹(簡稱 cf)

前端專用的開發 FrameWork   
針對目前開發項目遇到的問題做客製優化   
減少開發時間及累積開發成果

## 開發用工具
- npm
- gulp
- bower

## 使用 library 
- moment
- jQuery
- lodash
- caro.js 
- mobile
- detect.js 
- gsap

## 支援 .coffee 
在 gulp 時會自動 watch 並編譯成 js 

## 支援 inject file 
在 gulp 時會掃描 js / css 檔, 並寫入 script, link tag 到 src/index.html

## 基本安裝 
- 安裝 npm 
- npm install -g bower 安裝 bower 
- npm i 安裝開發檔案 
- 執行 bower 安裝 framework 基本函式庫

## gulp 執行指令
- gulp 自動部署並啟動 localhost server
- gulp deploy 自動部署 
- gulp prod  壓縮 js/css 檔到 /dist 底下, 並啟動 localhost server
- gulp buildProd 壓縮 js/css 檔到 /dist 底下
- gulp buildProdWithMap 壓縮 js/css 檔到 /dist 底下, 並產生 sourceMap
- gulp img : 掃描 src/images/ 裡面的圖檔並輸出陣列到 /src/js/img.js
- gulp buildBower : 將 bower 下載的外掛載到 src 底下

## 主要檔案介紹 
- main.html : 頁面 layout 
- src/_app : 主函式
- src/config : 設定檔, 視使用情形修改  

## src 資料夾基本介紹 
- _bower : 放置 bower 下載的檔案 
- _compatibility : 瀏覽器相容性 
- _plugin : 外掛
- api : 後端 api
 - coffee : coffee script 檔 
- css : .css
 - image : 圖檔 
- js : .js
- template : 分頁內容 html  

## coffee 注意事項
在自動部署時, /coffee 裡的 .coffee 會編譯成 .js 並放到 /js 底下   
所以如果不使用 coffee script 請直接移除

## src coffee / js 分類 
- ctrl : controller 模組, 類似 plugin, 用於網站客製化的功能 (e.g. 每個分頁都會有的選單) 
- lib : framework 函式庫
- module : framework 專用外掛
- page : 分頁程式 
- serv : 一般函式庫

## cf 介紹 
### 屬性 
- $$config : 從 config 讀取到的設定 
- $$data : 儲存資料, 類似 cookie, 但頁面刷新後會清空 
- $window : 同 $(window) 
- $document : 同 $(document) 
- $body: 同 $(‘body’)
- $ctrl: 儲存 controller DOM 物件
- $module: 儲存 module DOM 物件 
- _docReady : 儲存 document ready 後要觸發的 fns
- _ctrl : 儲存 controller fns
- _module : 儲存 module fns
- isLocal : 是否為 localhost
- isLocalTest : 是否為 local test 模式(由 config 設定)
- isHttps : 當前網址是否為 htttps 
- isPhone : 當前載具是否為手機 
- isTablet : 當前載具是否為平板 
- isMobile : 當前載具是否為手機 or 平板 
- ieVersion : IE 版本, 瀏覽器不是 IE 時會是 null
- isBefIe8 : 瀏覽器是否為 IE8 之前的版本 
- isBefIe9 : 瀏覽器是否為 IE9 之前的版本  

### 函式 
- require(str) : 載入 global 變數, 避免直接呼叫 global 變數以增加效能 
- data(key, [val]) : 讀取 or 設置資料, 用於跨檔案存取 
- regDocReady(註冊名稱, fn, [執行順序=50]) : 當頁面載入完畢時要執行的 fn 
- genTraceFn(訊息標題) : 產生 trace 用的 fn, 會在 console 顯示訊息(IE8 之前不支援 console)
- regLib(註冊名稱, fn) : 註冊 framework 專用函式 
- regServ(註冊名稱, fn) : 註冊一般函式 
- regCtrl(註冊名稱, fn, [要載入的 .html頁面]) : 註冊 controller
- regModule(註冊名稱, fn, [要載入的 .html頁面]) : 註冊 module 
- config(註冊名稱, config-obj) : 註冊 / 讀取 config
- regDifCfg(url, 設定) : 依據不同的 url 載入 config

## cf.router 介紹
### 屬性 
- $page : 當前的頁面 DOM 
- _prePage : 紀錄換頁前會執行的 fn 
- _page : 當前頁前會執行的 fn 
- _aftPage : 紀錄換頁後會執行的 fn 
- pageName : 當前頁面名稱 
- indexUrl : 當前網站的首頁 url
- transitionFn : 紀錄當前換頁效果 fn 

### 函式 
- getPageByHash([hash]) : 依照 url 的 hash 判斷目前的 page
- getSearchByHash([hash]) : 依照 url 的 hash 判斷目前的 search
- parseUrlSearch() : 依照 url 的 hash 裡面的 search 轉為 obj
- regPrePage(註冊名稱, fn) : 註冊每次次換頁前要執行的 fn
- regAftPage(註冊名稱, fn) : 註冊每次換頁後要執行的 fn
- regPage(註冊頁面, fn) : 註冊頁面要執行的 fn
- goPage([頁面名稱]) : 換頁, 沒參數時會依據 url 自動判斷
- blockGoPage() : 呼叫後, 執行 router.goPage 不會換頁
- approveGoPage() : 呼叫後, 所有的 router.goPage 可以換頁  

## module / ctrl 模組介紹
### 說明
 用法類似 jQuery plugin   
 module and ctrl 差別只在於作用域不同   
 module 適用所有專案, ctrl 為專案客製化功能 

### module 介紹
- caroAddrDropdown : 地址下拉選單
- caroScale : DOM 隨目標大小自動縮放, 預設為 $(window)
- caroCircleShow : DOM circle 輪播效果
- caroCompatibility : form 欄位相容性處理
- caroDateDropdown : 日期下拉選單
- caroImgSwitch : img 切換圖片
- caroJumpNum : 亂數效果, 數字會亂跳, 最後顯示結果
- caroListDom : 將 array 資料放到 DOM, 以 list 方式呈現, 例如得獎名單
- caroModal : modal 視窗
- caroPicNum : 用圖片顯示數字, 需搭配圖檔
- caroPreLoad : 預載檔案, 一般用在 loading 頁面
- caroRandomDrop : 隨機產生滑落物件, 例如氣泡, 水滴效果, 需搭配圖檔
- caroScrollbar : 自訂捲軸樣式, 客製化外掛 mCustomScrollbar 使用方式
- caroScroll : 捲軸自動滑動到 DOM 定點 的功能
- caroSwitchShow : 輪流顯示 DOM, 預設顯示第一個
- caroSyncMove : 計算滑鼠和基準點的距離，同步移動 DOM
- caroUpload : 檔案上傳
- caroValidator : 表單驗證
- caroWheel : 綁定滑鼠滾輪 event, 客製化外掛 jquery.mousewheel 使用方式