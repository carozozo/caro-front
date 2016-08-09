
/* 地址下拉選單 */
cf.regModule('cfAddrDropdown', function($cityDom, $areaDom, opt) {
  var $self, _addrMap, _islandMap, appendAreaDropdown, areaText, areaVal, cityText, cityVal, createDropdown, isIncludeIsland, withCode;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  _addrMap = {
    '基隆市': ['200仁愛區', '201信義區', '202中正區', '203中山區', '204安樂區', '205暖暖區', '206七堵區'],
    '台北市': ['100中正區', '103大同區', '104中山區', '105松山區', '106大安區', '108萬華區', '110信義區', '111士林區', '112北投區', '114內湖區', '115南港區', '116文山區'],
    '新北市': ['207萬里區', '208金山區', '220板橋區', '221汐止區', '222深坑區', '223石碇區', '224瑞芳區', '226平溪區', '227雙溪區', '228貢寮區', '231新店區', '232坪林區', '233烏來區', '234永和區', '235中和區', '236土城區', '237三峽區', '238樹林區', '239鶯歌區', '241三重區', '242新莊區', '243泰山區', '244林口區', '247蘆洲區', '248五股區', '248新莊區', '249八里區', '251淡水區', '252三芝區', '253石門區'],
    '桃園縣': ['320中壢區', '324平鎮區', '325龍潭區', '326楊梅區', '327新屋區', '328觀音區', '330桃園區', '333龜山區', '334八德區', '335大溪區', '336復興區', '337大園區', '338蘆竹區'],
    '新竹市': ['300北區', '300東區', '300香山區'],
    '新竹縣': ['300寶山鄉', '302竹北市', '303湖口鄉', '304新豐鄉', '305新埔鎮', '306關西鎮', '307芎林鄉', '308寶山鄉', '310竹東鎮', '311五峰鄉', '312橫山鄉', '313尖石鄉', '314北埔鄉', '315峨眉鄉'],
    '苗栗縣': ['350竹南鎮', '351頭份鎮', '352三灣鄉', '353南庄鄉', '354獅潭鄉', '356後龍鎮', '357通霄鎮', '358苑裡鎮', '360苗栗市', '361造橋鄉', '362頭屋鄉', '363公館鄉', '364大湖鄉', '365泰安鄉', '366銅鑼鄉', '367三義鄉', '368西湖鄉', '369卓蘭鎮'],
    '台中市': ['400中區', '401東區', '402南區', '403西區', '404北區', '406北屯區', '407西屯區', '408南屯區', '411太平區', '412大里區', '413霧峰區', '414烏日區', '420豐原區', '421后里區', '422石岡區', '423東勢區', '424和平區', '426新社區', '427潭子區', '428大雅區', '429神岡區', '432大肚區', '433沙鹿區', '434龍井區', '435梧棲區', '436清水區', '437大甲區', '438外埔區', '439大安區'],
    '彰化縣': ['500彰化市', '502芬園鄉', '503花壇鄉', '504秀水鄉', '505鹿港鎮', '506福興鄉', '507線西鄉', '508和美鎮', '509伸港鄉', '510員林鎮', '511社頭鄉', '512永靖鄉', '513埔心鄉', '514溪湖鎮', '515大村鄉', '516埔鹽鄉', '520田中鎮', '521北斗鎮', '522田尾鄉', '523埤頭鄉', '524溪州鄉', '525竹塘鄉', '526二林鎮', '527大城鄉', '528芳苑鄉', '530二水鄉'],
    '南投縣': ['540南投市', '541中寮鄉', '542草屯鎮', '544國姓鄉', '545埔里鎮', '546仁愛鄉', '551名間鄉', '552集集鎮', '553水里鄉', '555魚池鄉', '556信義鄉', '557竹山鎮', '558鹿谷鄉'],
    '雲林縣': ['630斗南鎮', '631大埤鄉', '632虎尾鎮', '633土庫鎮', '634褒忠鄉', '635東勢鄉', '636台西鄉', '637崙背鄉', '638麥寮鄉', '640斗六市', '643林內鄉', '646古坑鄉', '647莿桐鄉', '648西螺鎮', '649二崙鄉', '651北港鎮', '652水林鄉', '653口湖鄉', '654四湖鄉', '655元長鄉'],
    '嘉義市': ['600東區', '600西區'],
    '嘉義縣': ['602番路鄉', '603梅山鄉', '604竹崎鄉', '605阿里山鄉', '606中埔鄉', '607大埔鄉', '608水上鄉', '611鹿草鄉', '612太保市', '613朴子市', '614東石鄉', '615六腳鄉', '616新港鄉', '621民雄鄉', '622大林鎮', '623溪口鄉', '624義竹鄉', '625布袋鎮'],
    '台南市': ['700中西區', '701東區', '702南區', '704北區', '708安平區', '709安南區', '710永康區', '711歸仁區', '712新化區', '713左鎮區', '714玉井區', '715楠西區', '716南化區', '717仁德區', '718關廟區', '719龍崎區', '720官田區', '721麻豆區', '722佳里區', '723西港區', '724七股區', '725將軍區', '726學甲區', '727北門區', '730新營區', '731後壁區', '732白河區', '733東山區', '734六甲區', '735下營區', '736柳營區', '737鹽水區', '741善化區', '741新市區', '742大內區', '743山上區', '744新市區', '745安定區'],
    '高雄市': ['800新興區', '801前金區', '802苓雅區', '803鹽埕區', '804鼓山區', '805旗津區', '806前鎮區', '807三民區', '811楠梓區', '812小港區', '813左營區', '814仁武區', '815大社區', '820岡山鎮', '821路竹區', '822阿蓮區', '823田寮區', '824燕巢區', '825橋頭區', '826梓官區', '827彌陀區', '828永安區', '829湖內區', '830鳳山市', '831大寮區', '832林園區', '833鳥松區', '840大樹區', '842旗山鎮', '843美濃鎮', '844六龜區', '845內門區', '846杉林區', '847甲仙區', '848桃源區', '849那瑪夏區', '851茂林區', '852茄萣區'],
    '屏東縣': ['900屏東市', '901三地門鄉', '902霧台鄉', '903瑪家鄉', '904九如鄉', '905里港鄉', '906高樹鄉', '907鹽埔鄉', '908長治鄉', '909麟洛鄉', '911竹田鄉', '912內埔鄉', '913萬丹鄉', '920潮州鎮', '921泰武鄉', '922來義鄉', '923萬巒鄉', '924崁頂鄉', '925新埤鄉', '926南州鄉', '927林邊鄉', '928東港鎮', '929琉球鄉', '931佳冬鄉', '932新園鄉', '940枋寮鄉', '941枋山鄉', '942春日鄉', '943獅子鄉', '944車城鄉', '945牡丹鄉', '946恆春鎮', '947滿州鄉'],
    '台東縣': ['950台東市', '951綠島鄉', '952蘭嶼鄉', '953延平鄉', '954卑南鄉', '955鹿野鄉', '956關山鎮', '957海端鄉', '958池上鄉', '959東河鄉', '961成功鎮', '962長濱鄉', '963太麻里鄉', '964金峰鄉', '965大武鄉', '966達仁鄉'],
    '花蓮縣': ['970花蓮市', '971新城鄉', '972秀林鄉', '973吉安鄉', '974壽豐鄉', '975鳳林鎮', '976光復鄉', '977豐濱鄉', '978瑞穗鄉', '979萬榮鄉', '981玉里鎮', '982卓溪鄉', '983富里鄉'],
    '宜蘭縣': ['260宜蘭市', '261頭城鎮', '262礁溪鄉', '263壯圍鄉', '264員山鄉', '265羅東鎮', '266三星鄉', '267大同鄉', '268五結鄉', '269冬山鄉', '270蘇澳鎮', '272南澳鄉'],
    '澎湖縣': null,
    '金門縣': null,
    '連江縣': null
  };
  _islandMap = {
    '高雄市': ['817東沙群島', '819南沙群島'],
    '宜蘭縣': ['290釣魚台'],
    '澎湖縣': ['880馬公市', '881西嶼鄉', '882望安鄉', '883七美鄉', '884白沙鄉', '885湖西鄉'],
    '金門縣': ['890金沙鎮', '891金湖鎮', '892金寧鄉', '893金城鎮', '894烈嶼鄉', '896烏坵鄉'],
    '連江縣': ['209南竿鄉', '210北竿鄉', '211莒光鄉', '212東引鄉']
  };

  /* 縣市選單初始文字 */
  cityText = opt.defCityText || '請選擇縣市';

  /* 縣市選單初始值 */
  cityVal = opt.defCityVal || '';

  /* 地區選單初始文字 */
  areaText = opt.defAreaText || '請選擇區域';

  /* 地區選單初始值 */
  areaVal = opt.defAreaVal || '';

  /* 是否包含離島 */
  isIncludeIsland = opt.isIncludeIsland;

  /* 地區選單是否要包含區碼 */
  withCode = opt.withCode;
  createDropdown = function(text, val) {
    return $('<option />').html(text).val(val);
  };
  appendAreaDropdown = function(e) {
    var areaArr, selectedIndex, target;
    target = e.target ? e.target : e.srcElement;
    selectedIndex = target.selectedIndex;
    areaArr = _addrMap[$cityDom.val()];
    $areaDom.html('');
    if (selectedIndex === 0) {
      $areaDom.append(createDropdown(areaText, areaVal));
      return;
    }
    return caro.forEach(areaArr, function(area) {
      var areaStr;
      if (!withCode) {
        areaStr = area.substring(3);
      } else {
        areaStr = area;
      }
      return $areaDom.append(createDropdown(areaStr, area));
    });
  };
  if (isIncludeIsland) {
    caro.forEach(_addrMap, function(areaArr, city) {
      var islandAreaArr;
      islandAreaArr = _islandMap[city];
      if (!islandAreaArr) {
        return;
      }
      return _addrMap[city] = (_addrMap[city] || []).concat(islandAreaArr);
    });
  }
  $cityDom.html('').append(createDropdown(cityText, cityVal));
  $areaDom.html('').append(createDropdown(areaText, areaVal));
  caro.forEach(_addrMap, function(area, city) {
    if (!area) {
      return;
    }
    return $cityDom.append(createDropdown(city, city));
  });
  $cityDom.on('change', function(e) {
    return appendAreaDropdown(e);
  });
  return $self;
});
