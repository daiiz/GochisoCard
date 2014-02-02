// (c) 2013 daiz.
// License: MIT

document.getElementById("open_miilme_btn").addEventListener("click", openMiilme, false);
document.getElementById("card_btn").addEventListener("click", openCard, false);
document.getElementById("open_gochiphoto_btn").addEventListener("click", openGochiphoto, false);
window.addEventListener("load", loadend, false);
popupdata = {};
popupdata.pageURL = "";
popupdata.tagsBox = document.getElementById("add_tag");

popupdata.g_drive_filename = "";
popupdata.g_drive_src = "";


function openGochiphoto() {
   chrome.tabs.create({url: "http://www.gochisophoto.com/"}, null);//http://www.gochisophoto.com/
}

function openCard() {
   chrome.tabs.create({url: "griddles/index.html"}, function() {
       window.close();
   });
}

function test() {
   console.log("OK!");
}

function clear_boxs() {
  if(document.getElementById("add_url").value == "") {
   document.getElementById("res").innerHTML = "";
  }
}

function addPhoto() {
  nurl = document.getElementById("add_url").value;
  old_tagstr = document.getElementById("pic").title;
  if(old_tagstr != "") {
     tag_array = (document.getElementById("pic").title).split(",");
  }else {
     tag_array = [];
  }
  
  if(nurl != "") {
     chrome.extension.sendRequest({action: "add_photo", url: nurl, tag: tag_array, page_url: popupdata.pageURL}, addend);
  }
}
function addend() {
   console.log("addend");
   document.getElementById("mssg_icon_0").src = "images/ok_e.png";
   document.getElementById("mgg0").innerHTML = "ごちそう写真を拡張機能に保存しました。";
   renderSaveToDrive({"filename": popupdata.g_drive_filename, "src": popupdata.g_drive_src});
}

function openMiilme() {
   username = localStorage["username"];
   if(username != undefined) {
      chrome.tabs.create({url: "http://miil.me/u/" + username}, null)
   }else {
      chrome.tabs.create({url: "options.html"}, null)
   }
}

function loadend() {
    document.getElementById("add_url").readOnly = true;
    chrome.tabs.getSelected(window.id, function (tab) {
    //tab.urlに開いているタブのURLが入っている
    var tab_url = tab.url;
    console.log("----- TAB -----");
    console.log(tab_url);
    console.log("----- STORAGE -----");
    console.log(localStorage["v2_pg_url"]);
    var jdg = (tab_url == localStorage["v2_pg_url"])
    console.log(jdg);
    var check_miil = tab_url.search(/http:\/\/miil.me\/g/gi);
    var check_gochiphoto = tab_url.search(/http:\/\/www.gochisophoto.com\/photo/gi);
    
    if((check_miil != -1 || check_gochiphoto != -1) && jdg) {
    // miilページでのポップアップアクション
        popupdata.pageURL = tab_url;
        // v2
        photourl = localStorage["v2_main_photo"];
        document.getElementById("add_url").value = photourl;
        document.getElementById("pic").src = photourl;  //#
        popupdata.g_drive_filename = tab_url;
        popupdata.g_drive_src = photourl;
        showYtags(photourl);
    }else {
        popupdata.pageURL = "NOT_MIIL_PAGE";
        document.getElementById("add_url").placeholder = "写真のURL";
        document.getElementById("mssg_icon_0").src = "images/ng_e.png";
        document.getElementById("mgg0").innerHTML = "このページでは写真を登録できません。";
        document.getElementById("g-d-btn-load").src = "16x16.png";
        //window.close();
        //chrome.tabs.create({url: "ham/index.html"}, null)
    }
  });

}

function showYtags(fullurl) {
  console.log(fullurl);
  uniqueKey = ((fullurl.replace(/\//gi, "_1_")).replace(/\./gi, "_2_")).replace(/\:/gi,"_0_");
  
  if(uniqueKey.search(/=s[0-9][0-9][0-9]/) != -1) {
       uniqueKey = uniqueKey.replace(/=s[0-9][0-9][0-9]/gi, "");
  } 
  chrome.extension.sendRequest({action: "get_y_tags", unique_key: uniqueKey}, setYtag);
}

function setYtag(jn) {
   ys = jn.ys;
   x = jn.x;

   url = ((x.replace(/\_1\_/gi, "/")).replace(/\_2\_/gi, ".")).replace(/\_0\_/gi,":");

   for(i = 0; i < ys.length; i++) {
      if(ys[i] == "ごちそう") {
         ys.splice(i,1);
      }
   }
   // ys.unshift("ごちそう");
   
   if(ys.toString() == "") {
     //popupdata.tagsBox.placeholder = "ごちそうタグ";
   }else {
     document.getElementById("pic").title = ys.toString();
     //popupdata.tagsBox.placeholder = "ごちそうタグ";
   }
   
     addPhoto();
}

function renderSaveToDrive(j) {
gapi.savetodrive.render("savetodrive-div", {
   src: j.src.replace(/=s[0-9][0-9][0-9]/gi, ""),
   filename: j.filename + ".jpeg",
   sitename: 'ミイルごちそうカード'
});
}


