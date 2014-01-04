// # セレクトボックスに選択肢を追加する
function addSelectBox(all_query) {
   console.log(all_query);
   for(i = 0; i < all_query.length; i++) {
      if(all_query[i] == "ごちそう") {
         all_query.splice(i,1);
      }
   }
   all_query.unshift("ごちそう");
   var sbx = document.getElementById("griddles_select");
     for(i = 0; i < all_query.length; i++) {
         //console.log("sbx: %d", i);
         var option = document.createElement("option");
         option.value = all_query[i];
         tit = document.createTextNode(all_query[i]);
         option.appendChild(tit);
         sbx.appendChild(option);
     }
   document.getElementById("griddles_select").addEventListener("change", requestQuery, false);
}

// # 画像一覧を表示する（初回）
function renderer(jsn) {
item = jsn.items;
console.log(jsn);
xs = jsn.x_keys;
// # 起動時実行関数のコールバック
// # item : array(String)
// # src: item[xs[C]].web
renderer_photo(item, xs);
}

function renderer_photo(item, xs) {
console.log(item);
if(xs != undefined) {
photo_div = document.getElementById("photo_stream");
photo_div.innerHTML = "";
// # 返されたJSONから取得した画像を表示するコード
 for(C = 0; C < xs.length; C++) {
    // # div#photo_streamに
    // <div class="card photo" id="order"><img src="any.png" class="this_is_a_photo" data-page="url" id="order"></div>
    // を追加する
    var div = document.createElement("div");
    div.className = "card photo";
    div.id = "card_" + C;
    photo_div.appendChild(div);
    
    div = document.getElementById("card_" + C);
    var img = document.createElement("img");
    img.className = "this_is_a_photo";
    img.src = item[xs[C]].web;
    img.id = "photo_" + C;
    img.dataset.page = item[xs[C]].page;
    div.appendChild(img);
 }
}
}

// # "すべて"専用
function showAll() {
    /*
    query = "ごちそう";
    console.log("req_q: %s", query);
    chrome.extension.sendRequest({action: "at_miil_user_page", query: query}, renderer);
    */
    window.location.reload();
}
// # セレクトボックスの変更に応答する
function requestQuery(e) {
    query = document.getElementById(e.target.id).value;
    console.log("req_q: %s", query);
    chrome.extension.sendRequest({action: "at_miil_user_page", query: query}, renderer);
}

// # 写真をクリックされたときに実行する
function visitPage(e) {
   if(e.target.className == "this_is_a_photo" || e.target.className == "photo") {
      var page = e.target.dataset.page;
      chrome.tabs.create({url: page}, null);
   }
}

function loadend() {
   chrome.extension.sendRequest({action: "at_miil_user_page", query: "ごちそう"}, renderer);
   chrome.extension.sendRequest({action: "add_select_box", query: "all"}, addSelectBox);
}

window.addEventListener("load", loadend, false);
document.getElementById("photo_stream").addEventListener("click", visitPage, false);
document.getElementById("app_icon").addEventListener("click", showAll, false);