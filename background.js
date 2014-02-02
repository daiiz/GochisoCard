// (c) 2013 daiz.
// License: MIT

waffle = JSON.store;
waffle.getStore(cb);
griddles = {};
griddles.v3 = {};
griddles.v3.common_key = "ごちそう";
griddles.v3.tag_array = [];
griddles.v3.main_photo = "";

//griddles.v3.keep_callback = "";

function cb() {
}

function getMessages(request, sender, callback) {
griddles.v3.msgCallback = callback;
griddles.v3.tag_array = [];
miilplus.temp.pageURL = "";

   if (request.action == "at_miil_user_page") {
      var query = request.query;
      var x_keys = waffle.get_unique_keys(query);
      waffle.get_JSON(x_keys, callback);
      
   }else if(request.action == "add_photo") {
      var url = request.url;
      griddles.v3.tag_array = request.tag;
      uniqueKey = encode_unique_key(url);
      miilplus.temp.uniqueKey = uniqueKey;
      if(request.page_url == "NOT_MIIL_PAGE") {
         miilplus.temp.pageURL = url;
      }else {
         miilplus.temp.pageURL = request.page_url;
      }
      miilplus.getJSON(url, save);
      
   }else if(request.action == "add_select_box") {
      var rtn_ys = [];
      waffle.hack.show_table();
      //console.log(Ytag);
      var all_y_keys = Ytag;
      for(n = 0; n < all_y_keys.length; n++) {
         xs = waffle.get_unique_keys(all_y_keys[n]);
         if(xs.length == 0) {
             console.log("ゼロバリュークエリー: " + all_y_keys[n]);
         }else {
             rtn_ys.push(all_y_keys[n]);
         }
      }
      callback(rtn_ys);  //all_y_keys
      
   }else if(request.action == "get_user_name") {
      usr = localStorage["username"];
      callback(usr);
      
   }else if(request.action == "at_miil_photo_page") {
      // v2
      console.log("read: " + request.main_photo_url);
      //griddles.v3.main_photo = request.main_photo_url;
      localStorage["v2_pg_url"] = request.pg_url;
      localStorage["v2_main_photo"] = request.main_photo_url;
      
   }else if(request.action == "get_main_photo") {
       //miilplus.get_main_photo(request.taburl, callback);
      //console.log("send: " + griddles.v3.main_photo);
      //callback(griddles.v3.main_photo);
      
   }else if(request.action == "at_option_get_all_photo") {
      // リクエストは"at_miil_user_page"に飛ばしている。
      var query = request.query;
      var x_keys = waffle.get_unique_keys(query);
      waffle.get_JSON(x_keys, callback);
      
   }else if(request.action == "get_y_tags") {
      callback(waffle.get_relation_ys(request.unique_key));
      
   }else if(request.action == "remove_photo") {
      ys = waffle.get_relation_ys(request.unique_key);   // 仕様変更によりys === {x: "", ys: []}
      if((ys.ys).length == 0) {
         ys.ys.push("ごちそう");
      }
      waffle.minus({x: request.unique_key, y: ys.ys});
      callback();
      
   }else if(request.action == "export") {
      var query = request.query;
      x_keys = waffle.get_unique_keys(query);
      waffle.get_JSON(x_keys, me_on_the_app);
      
   }else if(request.action == "clear_store") {
      chrome.storage.local.clear(callback);
   }
   
}

function me_on_the_app(jsn) {
   item = jsn.items;
   xs = jsn.x_keys;
   ex_jsons = [{"app_name": "GochisoCard", "app_version": "3.0.0"}];
   for(i = 0; i < xs.length; i++) {
       var exJSON = {};
       var pic = item[xs[i]];
       var exWEB = pic.web;
       var exPAGE = pic.page;
       var exYS = waffle.get_relation_ys(xs[i]);
       exJSON.web = exWEB;
       exJSON.page = exPAGE;
       exJSON.tags = exYS;
       ex_jsons.push(exJSON);
   }
griddles.v3.msgCallback(ex_jsons);
}

function save(j) {
    console.log("func:save");
    griddles.v3.tag_array.push(griddles.v3.common_key);
    if(miilplus.temp.uniqueKey.search(/=s[0-9][0-9][0-9]/) != -1) {
       miilplus.temp.uniqueKey = miilplus.temp.uniqueKey.replace(/=s[0-9][0-9][0-9]/gi, "");
    }    
    var _x_ = miilplus.temp.uniqueKey;
    var _y_ = griddles.v3.tag_array;
    //waffle.set({x: _x_, y: _y_}, j);
    waffle.set({x: _x_, y: _y_}, j);
    griddles.v3.msgCallback();
}

function encode_unique_key(fullurl) {
   return ((fullurl.replace(/\//gi, "_1_")).replace(/\./gi, "_2_")).replace(/\:/gi,"_0_");
}
function decode_unique_key(fullukey) {
   return null
}

/* contextMenus 対応 */

var ctxmenu = {
   icon: "griddles/ic_launcher.png",
   thumbnail: "",
   add_photo: function(j, cb) {
      griddles.v3.msgCallback = cb;
      var url = j.url;
      griddles.v3.tag_array = j.tag;
      uniqueKey = encode_unique_key(url);
      miilplus.temp.uniqueKey = uniqueKey;
      if(j.page_url == "NOT_MIIL_PAGE") {
         miilplus.temp.pageURL = url;
      }else {
         miilplus.temp.pageURL = j.page_url;
      }
      miilplus.getJSON(url, ctxmenu.save);
   },
   genericOnClick: function(ocd) {
       var pageUrl = ocd.pageUrl;
       var srcUrl = ocd.srcUrl;
      if(pageUrl.search(/^http/) != -1) {
       var is_data = srcUrl.search(/^data/);
       var is_http = srcUrl.search(/^http/);
       if(is_data != -1 || is_http != -1) {
          ctxmenu.thumbnail = srcUrl;
          ctxmenu.add_photo({action: "add_photo", url: srcUrl, tag: [], page_url: pageUrl}, ctxmenu.addEnd);
          console.log("OCD: ['" + pageUrl + "', '" + srcUrl + "']");
       }
      }else {
          console.log(pageUrl);
      }
   },
   addEnd: function() {
       chrome.notifications.clear("saved", function() {
           var notificationId = "saved";
           var options = {type: "basic", title: "ごちそうカード に写真を登録しました", message: "既に同一の写真が登録されている場合、タグはリセットされます。", iconUrl: ctxmenu.thumbnail};
           chrome.notifications.create(notificationId, options, function(){})
       });
   },
   save :function(j) {
       console.log("func:save");
       griddles.v3.tag_array.push(griddles.v3.common_key);
       if(miilplus.temp.uniqueKey.search(/=s[0-9][0-9][0-9]/) != -1) {
          miilplus.temp.uniqueKey = miilplus.temp.uniqueKey.replace(/=s[0-9][0-9][0-9]/gi, "");
       }  
       var _x_ = miilplus.temp.uniqueKey;
       var _y_ = griddles.v3.tag_array;
       console.log(_x_);
       console.log(_y_);
       waffle.set({x: _x_, y: _y_}, j);
       griddles.v3.msgCallback();
   }
};
var contextMenus_parent = chrome.contextMenus.create({"id": "gochisocard", "title": "ごちそうカード に写真を登録", "contexts": ["image"], "onclick": ctxmenu.genericOnClick});


// content_scripts での sendRequest を受信
chrome.extension.onRequest.addListener(getMessages);

