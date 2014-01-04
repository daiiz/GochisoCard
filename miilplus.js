// (c) 2013 daiz.
// License: MIT

miilplus = {};
miilplus.temp = {web: "", blob: "", uniqueKey: ""};
miilplus.JSON = {api_name: "miilplus", api_version: "3.0.0", web: "", blob: "", page: "", date: ""};
miilplus.main_photo_class = "detailphoto";//"mainPhotoImage";

miilplus.getJSON = function (url, callback) {
     console.log(url);
     if(url.search(/=s[0-9][0-9][0-9]/) != -1) {
        url = url.replace(/=s[0-9][0-9][0-9]/gi, "");
     }
     miilplus.temp.web = url;
     miilplus.JSON.web = miilplus.temp.web;
     miilplus.JSON.date = new Date().toGMTString();
     miilplus.JSON.page = miilplus.temp.pageURL;
     console.log("!packaging--completed--!");
     callback(miilplus.JSON);
     // console.log("!: "+ url);
     //var xhr = new XMLHttpRequest();
     //xhr.open('GET', url, true);
     //xhr.responseType = 'blob';
     /*xhr.onload = function(e) {
          console.log("xhr!");
          console.log(e);
          sid = window.URL.createObjectURL(this.response);
          miilplus.temp.blob = sid;
          miilplus.packaging(callback);
     };*/
     //xhr.send();
}

