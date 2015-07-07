// (c) 2013 daiz.
// License: MIT
var miil2 = {};
miil2.stage = "detailphoto";
var gochiphot = {};
gochiphot.stage = "detailPhoto";
count = 0;
function get_main_img_obj() {
   // # miilページから写真を抽出
   var a = document.getElementsByClassName(miil2.stage)[0];
   var aa = document.getElementsByClassName(gochiphot.stage)[0];
   if(a != undefined) {
       getter(a);
   }else if(a != aa && aa != undefined){
   // # ごちそうフォトから写真を抽出
       getter(aa);
   }else {
      console.log("-- try: " + count + " --");
      count++;
      //get_main_img_obj();
   }
}
function v2_callback(e) {
}

function getter(a) {
      console.log("-- OK --");
      var b = a.getElementsByTagName("img")[0].src;
      var c = b.replace(/=s[0-9][0-9][0-9]/gi, "");
      var d = location.href;
      console.log("----- page  URL -----");
      console.log(d);
      console.log("----- image URL -----");
      console.log(b);
      chrome.extension.sendRequest({action: "at_miil_photo_page", 'main_photo_url' : c, 'pg_url': d}, v2_callback);
}
window.setTimeout(get_main_img_obj, 2000);
//get_main_img_obj();