// (c) 2013 daiz.
// License: MIT
// 2013-08-12 改変版

JSON.store = {};
waffle = JSON.store;
waffle.api = "waffle ver 3.0.1 for chrome packaged apps.";
waffle.storeType = "chrome_storage_local";
waffle.e404 = "---404---";
waffle.overwrite = true;
waffle.queryType = "";
waffle.queryChange = {"Pl": ["!"], "Mo": [], "Mi": []};
waffle.showTableFlag = true;

// # {x|y} = Array [String TAG_NAME, Array SUBSCRIPT of {y|x}, Boolean VALIDITY]
// # New version of {x|y} will be not exit argument　VALIDITY.
// package for developers.

// コンソールでユーザーが使用。
Xtag = [];
Ytag = [];

waffle.hack = {};
waffle.hack.sample_x = [];
waffle.hack.sample_y = [];

// # new version format.
/*
waffle.hack.sample_x = [["tag_x_0", [0, 1, 2]], ["tag_x_1", [1, 2]], ["tag_x_2", [2]]];
waffle.hack.sample_y = [["tag_y_0", [0]], ["tag_y_1", [0, 1]], ["tag_y_2", [0, 1, 2]]];
*/
/*
waffle.hack.sample_x = [];
waffle.hack.sample_y = [];
*/
waffle.hack.log = function(c, d) {
    console.log("---dev--- " + c + ": " + d);
}
waffle.log = function(c, d) {
    console.log(c + ": " + d);
}
waffle.error = function(b, c, d) {
    console.error(b + " " + c + ": " + d);
}
waffle.hack.show_table = function() {
    // # This method shows a data table to check stored items.
    waffle.showTableFlag = false;
    var x = waffle.hack.sample_x;
    var y = waffle.hack.sample_y;
    var xl = x.length;
    var yl = y.length;
    var line_content = "#";
    // # i --- x
    // # j --- y
    for (i = 0; i < xl; i++) {
        line_content = line_content + " " + i.toString()[i.toString().length - 1];
    }
    if(waffle.showTableFlag) {
      console.log(line_content);
    }
    for (j = 0; j < yl; j++) {
        line_content = "";
        line_content = line_content + j.toString()[j.toString().length - 1] + " ";
        for (i = 0; i < xl; i++) {
            if ((x[i][1]).indexOf(j) != -1) {
                jd = "o";
            } else {
                jd = "-";
            }
            line_content = line_content + jd + " ";
        }
       if(waffle.showTableFlag) {
        console.log(line_content);
       }
    }
    Xtag = [];
    Ytag = [];
    for (ii = 0; ii < xl; ii++) {
        Xtag.push(x[ii][0]);
    }
    for (jj = 0; jj < yl; jj++) {
        Ytag.push(y[jj][0]);
    }
    if(waffle.showTableFlag) {
      console.log("横要素配列はXtag、縦要素配列はYtagで確認できます。 例） Xtag 、 Xtag[2]");
    }

}

waffle.plus = function(json_tag_xy, json, cb) {
    // # Argument　"json*" must be a JSON object.
    // # Argument　"json" must contains key named "x" and "y".
    // # json_tag_xy.x must be unique string.
    // # json_tag_xy.y must be array.
    flag = true;
    if (json_tag_xy.x != undefined && json_tag_xy.y != undefined) {
        json.tag_x = json_tag_xy.x;  // # such as "www.google.com"
        /* json.tag_y = json_tag_xy.y;  # such as ["q1", "q2"]. */
        t_x = json_tag_xy.x;
        t_y = json_tag_xy.y;
        x = waffle.hack.sample_x;
        y = waffle.hack.sample_y;
        xl = x.length;
        yl = y.length;
        new_x_adress = null;
        
        for (i = 0; i < xl; i++) {
            if ((x[i][0]) == t_x) {
                if(waffle.overwrite == false) {
                   flag = false;
                   console.error("701 UnSecureOverwriteError : Unique-Keyが既に存在します。上書きを許可する場合はwaffle.overwriteをtrueに変更して下さい。");
                   return 701;
                }else {
                   new_x_adress = i;
                }
            }
        }
        
        if (flag) {           
            if(new_x_adress == null) {
               // # 新規登録モード
               // # x 追加
               overw = "off";
               new_x_array = [t_x, [], 1];
               waffle.hack.sample_x.push(new_x_array); // # Important!
               new_x_adress = waffle.hack.sample_x.length - 1; // # これ以下でxが増えることはない。
            }else {
               // # 上書きモード
               overw = "on";
            }
            // # 既存のyタグ配列を検索し、t_yと一致するものがあれば、SUBSCRIPT of x に x番地を追加する。
            // # 一致するものが無ければ新たにpushする。
            // # いずれの場合でもy番地をxタグ配列のSUBSCRIPT of y に追加する。
            // # y query １件ごとに for で回す。plusリクエストy配列添字はr. 既存y配列添字はj.
            var newQuery = 0;
            var existingQuery = 0;
            
            for (r = 0; r < t_y.length; r++) {
                t_y_flag = false;
                for (j = 0; j < yl; j++) {
                    if (y[j][0] == t_y[r]) {
                        // # クエリーが既存と一致した。
                	existingQuery++;
                	waffle.queryChange.Mo.push(t_y[r]);
                        t_y_flag = true;
                        if(overw == "off" || x[new_x_adress][1].indexOf(j) == -1) {
                            (y[j][1]).push(new_x_adress); // # Important!
                            (x[new_x_adress][1]).push(j); // # Important!
                        }
                    }
                }
                if (t_y_flag == false) {
                    // # 最終的にこのクエリーは一致しなかった。
                    newQuery++;
                    waffle.queryChange.Pl.push(t_y[r]);
                    new_y_array = [t_y[r], [new_x_adress], 1]; // # Important!
                    waffle.hack.sample_y.push(new_y_array); // # Important!
                    new_y_adress = waffle.hack.sample_y.length - 1;
                    (x[new_x_adress][1]).push(new_y_adress); // # Important!
                }
            // # 次のクエリーのスキャンへ
            }
            // # storage作業
            //console.log(json);
            waffle.queryType = "+"+ newQuery + " ~"+ existingQuery + " " + waffle.queryType;
            // # waffle.queryType
            // + : 過去に一度も登録されたことが無いクエリーの個数
            // - : .setによって一旦削除されたクエリーの個数
            // ~ : 過去に登録されたことがあるクエリーの個数
            console.log(waffle.queryType);
          
          var rootAddFlag = false;
          // # .plus を直接コールした場合は以下の第一条件は成り立たないようにしてある。
          // # waffle.queryChange.Pl.length == 1 にしてある。
          // # よって、必ず rootAddFlag = true となる。
          if(waffle.queryChange.Pl.length == 0 && waffle.queryChange.Mo.length > 0) {
            if(waffle.queryChange.Mo.length == waffle.queryChange.Mi.length) {
               var queryChangeMiStr = (waffle.queryChange.Mi).toString();
               queryChangeMiStr = "," + queryChangeMiStr + ",";
               console.log(queryChangeMiStr);
               for(var t = 0; t < waffle.queryChange.Mo.length; t++) {
                  var q = "," + waffle.queryChange.Mo[t] + ",";
                  var rge = new RegExp(q, "gi");
                  var poq = queryChangeMiStr.search(rge);
                  if(poq == -1) {
                      // # ~の内容と、-の内容が異なる
                      // rootAddFlag を呼ぶ必要がある
                      rootAddFlag = true;
                  }
               }
               //console.log(rootAddFlag);
            }else {
        	rootAddFlag = true;
            }
          }else {
              rootAddFlag = true;
          }
            
          waffle.queryChange = {"Pl": ["!"], "Mo": [], "Mi": []};
          if(rootAddFlag){
            waffle.rootAdd(json, cb);
          }else {
            waffle.hack.sample_x = JSON.parse(waffle.str_sample_x);
            waffle.hack.sample_y = JSON.parse(waffle.str_sample_y);
            waffle.str_sample_x = "";
            waffle.str_sample_y = "";
            console.log("変更箇所はありません。")
          }
        }
    
    } else {
        waffle.error("103", "SyntaxError", ".plus")
    }
}

waffle.minus = function(json_tag_xy) {
    var x = waffle.hack.sample_x;
    var y = waffle.hack.sample_y;
    var xl = x.length;
    var yl = y.length;
    // # json_tag_xy : such as {x: "www.google.com", y: "ANY"}
    // # json_tag_xy : such as {x: "www.google.com", y: "q1"}
    // # まずはx配列から該当x配列を取得し、対応するyの位置を ---404--- に変更する。
    // # y配列の対応するxの位置を ---404--- に変更する。
        request_x_value = json_tag_xy.x;
        request_y_values = json_tag_xy.y;
        //request_y_values = request_y_values.split(",");          /* もとから配列で渡す仕様にした */
    for(q = 0; q < request_y_values.length; q++) {
        request_y_value = request_y_values[q];
        pos_y = -1;
        pos_x = -1;
        
        for (n = 0; n < yl; n++) {
            // # 既存のy配列の中からrequestと一致するものを特定する。
            // # 特定した添字をpos_yに保存する。
            if (y[n][0] == request_y_value) {
                pos_y = n;
            }
        }
        
        for (n = 0; n < xl; n++) {
            // # 既存のx配列の中からrequestと一致するものを特定する。
            // # 特定した添字をpos_xに保存する。
            if (x[n][0] == request_x_value) {
                pos_x = n;
            }
        }
        if(pos_x != -1 && pos_y != -1) {
        // # x : pos_x番目の要素: ["TAG_X", [X, X, X, X, pos_y, X]]
        // # y : pos_y番目の要素: ["TAG_Y", [X, pos_x, X, X, X, X, X]]
        // # TAG_X と TAG_Y はリクエストのものと同じはずである。
        
        arr_index_x = x[pos_x][1]; // [X, X, X, X, pos_y, X]
        g = arr_index_x.indexOf(pos_y); // 4
        if(g != -1) {
            x[pos_x][1].splice(g,1);  
        }
        
        arr_index_y = y[pos_y][1];
        g = arr_index_y.indexOf(pos_x);
        if(g != -1) {
            y[pos_y][1].splice(g,1);
        }
        
        //console.log(".minus -x:" + json_tag_xy.x + " -y:" + json_tag_xy.y + " : completed.");
        }
    }
    waffle.rootMinus(request_x_value, request_y_values);
}

waffle.set = function(json_tag_xy, json, cb) {
    waffle.queryChange = {"Pl": [], "Mo": [], "Mi": []};
   // # xキーに対して、yキーの追加と解除の両方を行いたい場合に使用。
   // # waffle.overwrite == true のときのみ動作。
   if(waffle.overwrite) {
       reqestX = json_tag_xy.x;
       x = waffle.hack.sample_x;
       y = waffle.hack.sample_y;
       waffle.str_sample_x = JSON.stringify(x);
       waffle.str_sample_y = JSON.stringify(y);
       var placeX = -1;
       
       for(ga = 0; ga < x.length; ga++) {
           if(x[ga][0] == reqestX) {
               placeX = ga;
               break;
           }else {
               placeX = -1;
           }
       }
       
       var ref_x_spliced = 0;
       if(placeX != -1) {
           // # 既存
           console.log("既存のxタグ（URL）");
           
           /*
           for(ga = 0; ga < (x[placeX][1]).length; ga++) {
               x[placeX][1].splice(ga,1);
           }
           */
           
           x[placeX][1] = [];
           
           for(ga = 0; ga < y.length; ga++) {
               rel_x = (y[ga][1]).indexOf(placeX);
               //console.log(ga + " : " + rel_x);
               if(rel_x != -1) {
               // # requestXとの関連があった場合
                   y[ga][1].splice(rel_x,1);
                   ref_x_spliced++;
                   //console.log(y[ga]);
                   waffle.queryChange.Mi.push(y[ga][0]);
               }else {
               }
           }
           // # ref_x_spliced == 0 ならば 過去に保存されたことがないアイテムの可能性大
           // # なぜなら、共通クエリーでの既存反応が無かったため。
           waffle.queryType = "-" + ref_x_spliced;
        // # この時点では、xはいかなるyとも関連はない。
       }else {
           // # 新規
	   waffle.queryType = "-" + ref_x_spliced;
       }
    waffle.plus(json_tag_xy, json, cb);
   }
}

waffle.get_unique_keys = function(request_y) {
   // # request_y: String 
   var y = waffle.hack.sample_y;
   var ry = request_y;
   var rtn_xs = [];
   var ri = 0;
   for(ga = 0; ga < y.length; ga++) {
       if(y[ga][0] == ry) {
          x_index = y[ga][1];
          
          for(gb = 0; gb < x_index.length; gb++) {
            if(x_index[gb] != waffle.e404) {
              rtn_xs[ri] = waffle.hack.sample_x[x_index[gb]][0];
              ri = ri + 1;
            }
          }
          return rtn_xs;
       }
   }
   
}

waffle.get_JSON = function(reqest_xs, callback) {
  // # request_xs: Array
  waffle.rootGet(reqest_xs, callback);
}
// # Ready...
waffle.log(waffle.api, "loaded.");

// waffle.plus({x:"url1", y:["query0", "query1"]}, jsn);
// waffle.minus({x:"tag_x_0", y:"ANY"});
// waffle.minus({x:"tag_x_0", y:"tag_y_0"})


waffle.URL_to_Index = function(url) {
    // url may be such as "http://www.google.com/images/img.jpeg"
    // ":" === {c}
    // "/" === {s}
    // "." === {d}
    // "http" === {h}
    // "www" === {w}
}

waffle.get_relation_ys = function(uniqueID) {
    x = waffle.hack.sample_x;
    yys = [];
    rtn_ys = [];
    for(ux = 0; ux < x.length; ux++) {
        if(uniqueID == x[ux][0]) {
            yys = x[ux][1]
            //console.log(yys);
            break;
        }
    }
    for(uy = 0; uy < yys.length; uy++) {
       rtn_ys[uy] = waffle.hack.sample_y[yys[uy]][0];
    }
    
    return {ys: rtn_ys, x: uniqueID};     // 改変（元はrtn_ys）
}

waffle.clear = function(clearFlag) {
   if(clearFlag == true) {
       chrome.storage.local.clear();
   }
}


// # root code.
// # ローカルデータ保存API
waffle.rootGet = function(xs, cb) {
   if(xs != undefined) {
      if(waffle.storeType == "chrome_storage_local") {
           chrome.storage.local.get(xs, function(items) {
              //console.log(xs);
              cb({items: items, x_keys: xs}); //独自改変
              // cb(items, xs);
           });
      }
   }else {
      cb({});
   }
}
waffle.rootAdd = function(jn, cb) {
    if(waffle.storeType == "chrome_storage_local") {
        // # chrome.storage.local : QUOTA_BYTES ( 5,242,880 )
        // # unlimitedStorage permission が有効である可能性あり。
        // # まずはアイテムを保存する。
        savejson = {};
        caption = jn.tag_x;
        savejson[caption] = jn;
        chrome.storage.local.set(savejson, function() {
            // # 次にテーブル情報を上書き保存する。
            chrome.storage.local.set({"hack_table_x": waffle.hack.sample_x}, function() {
                chrome.storage.local.set({"hack_table_y": waffle.hack.sample_y}, function() {
                    console.log("(chrome_storage_local)writeEnded: " + JSON.stringify(savejson[caption]));
                    //cb();
                });
            });
        })
    }else if(waffle.storeType == "html5ls") {
        // # HTML5 localStorage : QUOTA_BYTES ( 5,242,880 )
        // # まずはアイテムを保存する。
        localStorage[jn.tag_x] = JSON.stringify(jn);
        // # 次にテーブル情報を上書き保存する。
        localStorage["hack_table_x"] = JSON.stringify(waffle.hack.sample_x);
        localStorage["hack_table_y"] = JSON.stringify(waffle.hack.sample_y);
        console.log("(html5ls)writeEnded: " + localStorage[jn.tag_x]);
        //cb();
    }
}

waffle.rootMinus = function(req_x, req_y, cb) {
// # テーブル情報を更新するだけ
    if(waffle.storeType == "chrome_storage_local") {
            chrome.storage.local.set({"hack_table_x": waffle.hack.sample_x}, function() {
                chrome.storage.local.set({"hack_table_y": waffle.hack.sample_y}, function() {
                    console.log("(chrome_storage_local)minusEnded: x = " + req_x + "から、指定されたy = "+ req_y.toString() +"を解除しました。");
                    //cb();
                });
            });        
    }else if(waffle.storeType == "html5ls") {
            localStorage["hack_table_x"] = JSON.stringify(waffle.hack.sample_x);
            localStorage["hack_table_y"] = JSON.stringify(waffle.hack.sample_y);
            console.log("(html5ls)minusEnded: x = " + req_x + "から、指定されたy = "+ req_y.toString() +"を解除しました。");
            //cb();
    }
}





waffle.getStore = function(cb) {
if(waffle.storeType == "chrome_storage_local") {
  chrome.storage.local.get(["hack_table_x"], function(items_x) {
      if(items_x.hack_table_x == undefined) {
          console.log("空でした。");
          chrome.storage.local.set({"hack_table_x": []}, function() {
               chrome.storage.local.set({"hack_table_y": []}, function(){
                   waffle.hack.show_table();
               });
          });
      }else {
              console.log("ありました。");
              waffle.hack.sample_x = items_x.hack_table_x;
          chrome.storage.local.get(["hack_table_y"], function(items_y) {
              waffle.hack.sample_y = items_y.hack_table_y;
              waffle.hack.show_table();
          });
      }
  });
  
}else if(waffle.storeType == "html5ls") {
  if(localStorage["hack_table_x"] == undefined && localStorage["hack_table_y"] == undefined) {
      console.log("空でした。");
      localStorage["hack_table_x"] = JSON.stringify([]);
      localStorage["hack_table_y"] = JSON.stringify([]);
      waffle.hack.show_table();
  }else {
      console.log("ありました。");
      waffle.hack.sample_x = JSON.parse(localStorage["hack_table_x"]);
      waffle.hack.sample_y = JSON.parse(localStorage["hack_table_y"]);
      waffle.hack.show_table();
  }
}
}


//waffle.getStore(testest);

function testest(x, y) {
    console.log("テスト完了");
    console.log(x);
    console.log(y);
}

waffle.hack.quota = function() {
   maxq = chrome.storage.local.QUOTA_BYTES;
   xkeys = ["hack_table_x", "hack_table_y"];
   for(qk = 0; qk < waffle.hack.sample_x.length; qk++) {
       xkeys.push(waffle.hack.sample_x[qk][0]);
   }
   chrome.storage.local.getBytesInUse(xkeys, qcb)
   return null;
}

function qcb(bytes) {
   console.log("    Max   : %d bytes.", maxq)
   console.log("- ) Used  : %d bytes.", bytes);
   console.log("------------------------");
   console.log("Usable: %d bytes.", maxq - bytes);
}