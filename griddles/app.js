// # セレクトボックスに選択肢を追加する
function addSelectBox(all_query) {
   console.log(all_query);
   for(i = 0; i < all_query.length; i++) {
      if(all_query[i] == "ごちそう") {
         all_query.splice(i,1);
      }
   }
   all_query.unshift("ごちそう");
   var sbx = document.getElementById("select_menu");
     for(i = 0; i < all_query.length; i++) {
         //console.log("sbx: %d", i);
         var option = document.createElement("option");
         option.value = all_query[i];
         tit = document.createTextNode(all_query[i]);
         option.appendChild(tit);
         sbx.appendChild(option);
     }
   document.getElementById("select_menu").addEventListener("change", requestQuery, false);
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
photo_div = document.getElementById("stage");
photo_div.innerHTML = "";
griddles.layout.cards = [];
// # 返されたJSONから取得した画像を表示するコード
 for(C = 0; C < xs.length; C++) {
    var itemJson = {"id": "C" + C, "type": "user-img", "dataset": [], "init": ""};
    //itemJson.dataset.page = item[xs[C]].page;//"card_" + C;
    itemJson.dataset.push(["page" , item[xs[C]].page]);
    itemJson.init = item[xs[C]].web;
    griddles.layout.cards.push(itemJson);
 }
 console.log(griddles.layout.cards);
 griddles.render = true;
 griddles.load();
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
function visitPage(j) {
   if(j.className == "img") {
       var page = j.dataset.page;
       console.log(page);
       chrome.tabs.create({url: page}, null);
   }
}

function loadend() {
   chrome.extension.sendRequest({action: "at_miil_user_page", query: "ごちそう"}, renderer);
   chrome.extension.sendRequest({action: "add_select_box", query: "all"}, addSelectBox);
}

window.addEventListener("load", loadend, false);
document.getElementById("app_icon").addEventListener("click", showAll, false);