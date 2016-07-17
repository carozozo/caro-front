# Caro-Front 介紹(簡稱 cf)

前端專用的開發 FrameWork   
針對目前開發項目遇到的問題做客製優化   
減少開發時間及累積開發成果

## 優化項目
### 開發 
- 運用 gulp 自動掃描檔案並部署網站
- 運用 bower 控管外掛

### 程式 
- 可根據不同的 url 載入相對應的 config
- 以 jQuery 搭配 gsap 實現 DOM 的動態控制

### 工作分配
- Lib / Serv 負責提供函式庫, 處理程式邏輯
- Module / Ctrl 負責單位元件
- Page 負責頁面功能

## 開發用工具
- npm
- gulp
- bower

## 使用 library 
- caro.js 
- jQuery
- lodash
- mobile-detect
- moment
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
- gulp : 自動部署並啟動 localhost server
- gulp deploy : 自動部署 
- gulp prod : 壓縮 js/css 檔到 /dist 底下, 並啟動 localhost server
- gulp buildProd : 壓縮 js/css 檔到 /dist 底下
- gulp buildProdWithMap : 壓縮 js/css 檔到 /dist 底下, 並產生 sourceMap
- gulp img : 掃描 src/images/ 裡面的圖檔並輸出陣列到 /src/js/img.js
- gulp buildBower : 將 bower 下載的外掛載到 src 底下

## 主要檔案介紹 
- main.html : 頁面 layout 
- src/_app : 主函式
- src/config : 設定檔, 視使用情形修改  

## src 資料夾基本介紹 
- _bower : bower 下載的檔案 
- _compatibility : 瀏覽器相容性 程式
- _plugin : 外掛程式
- api : 後端 api   檔
- coffee : coffee script 檔
- css : css 檔
- image : 圖檔
- js : js 檔
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
- $ctrl: 儲存呼叫 controller 後產生的 DOM 物件
- $module: 儲存 module DOM 物件 
- _docReady : 儲存 document ready 後要觸發的 functions
- _ctrl : 儲存 controller functions
- _module : 儲存 module functions
- isLocal : 是否為 localhost
- isLocalTest : 是否為 local test 模式(由 config 設定)
- isHttps : 當前網址是否為 https 
- isPhone : 當前載具是否為手機 
- isTablet : 當前載具是否為平板 
- isMobile : 當前載具是否為手機 or 平板 
- ieVersion : IE 版本, 瀏覽器不是 IE 時會是 null
- isBefIe8 : 瀏覽器是否為 IE8 之前的版本 
- isBefIe9 : 瀏覽器是否為 IE9 之前的版本  
- indexUrl : 當前網站的首頁 url

### 函式 
- require(str) : 載入 global 變數, 避免直接呼叫 global 變數以增加效能 
```
// 同等於直接使用 $ 
var $ = cf.require('jQuery');
```
- data(key, [val]) : 讀取 or 設置資料, 用於跨檔案存取 
```
/*
相當於
cf.$$data = {
  theKey: 123
}
*/
cf.data('theKey', 123);
var theKey = cf.data('theKey'); // -> 123 
```
- regDocReady(註冊名稱, fn, [執行順序=50]) : 當頁面載入完畢時要執行的 function
```
// 頁面載入完畢時會先印出 2 然後是 1
cf.regDocReady('index', function(cf){
  console.log(1);
});
cf.regDocReady('first', function(cf){
  console.log(2);
}, 1);
```
- genTraceFn(訊息標題) : 產生 trace 用的 fn, 會在 console 顯示訊息(IE8 之前不支援 console)
```
// 產生 trace function
var trace = cf.genTraceFn('CARO');

// 宣告 trace 可以開始印出 console.log, 沒這行指令或是 IE8 以下時則不會印出
trace.startTrace();

// 同等於 console.log('CARO:' ,'This is test')
trace('This is test');

var err = 'error'
// 同等於 console.error('CARO:', 'This is test', err)
trace.err('This is test', err);
```
- regLib(註冊名稱, fn) : 註冊函式 庫
- regServ(註冊名稱, fn) : 註冊 service 函式 庫
```
// 會產生 cf.test.get cf.test.set 函式 
cf.regLib('test', function(cf) {
  var self = {}
  self.get = function(){...}
  self.set = function(){...}
  return self;
});
```
- regCtrl(註冊名稱, fn, [要載入的 .html頁面]) : 註冊 controller
- regModule(註冊名稱, fn, [要載入的 .html頁面]) : 註冊 module 
```
// ctrl/menu.ctrl.js
cf.regCtrl('menu', function(opt) {
  var $self = this
  var cf = $self.cf
  ...
  $self.get = function(){...}
  $self.set = function(){...}
  return $self;
}, 'menu');

```
```
/*
page/index.page.js
會載入 template/menu.html 裡的 html 碼到 $('.example') 裡面
並且產生 $menu.get / $menu.set 函式
此時 $menu 就相當於 ctrl/menu.ctrl.js 裡的 $self 
*/
var $menu = $('.example').menu({a:1});

```
- config(註冊名稱, [config-obj]) : 註冊 / 讀取 config
```
cf.config('theKey', 123); // 會儲存 {theKey: 123} 在 cf.$$config
var theKey = cf.config('theKey'); // -> 123 
```
- regDifCfg(url, 設定) : 依據不同的 url 載入 config
```
cf.config('theKey', 123);
cf.regDifCfg('example.com.tw', {
'theKey': 456
});
// 當網域為 example.com.tw 時, 會取得 456, 其他網域則是 123
var theKey = cf.config('theKey'); 
```

## lib / serv 函式庫差別
差別只在於作用域不同   
lib 應用於特定功能, serv 應用於 page 間的邏輯處理
 
### lib 介紹
- cf.ajax : $.ajax 延伸, 可設定測試模式, 用來模擬 api response
- cf.alert : 用 popup 模擬 alert 的功能, 避免 browser 禁用 alert
- cf.cookie : 設置和讀取 cookie
- cf.dom : 提供 jQuery 基本功能外掛
- cf.fb : FB API 延伸函式庫, 解決部分 API 問題, 簡化呼叫方式和防呆
- cf.routeAnimate : cf.router 擴充換頁效果
- cf.router : 換頁函式庫
- cf.tracking : 客製化 GA / GTM 函式庫, 簡化呼叫方式和防呆
- cf.unit : 單元函式庫, 提供一些未分類函式
- cf.website : 網頁函式庫

## cf.router 介紹
### 屬性 
- $page : 當前的頁面 DOM 
- _prePage : 紀錄換頁前會執行的 fn 
- _page : 當前頁前會執行的 fn 
- _aftPage : 紀錄換頁後會執行的 fn 
- pageName : 當前頁面名稱 
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

## module / ctrl 模組差別
 用法類似 jQuery plugin, 差別只在於作用域不同   
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