/**
 * Griddles v0.0.2
 * (c) 2013-2014 daiz. https://github.com/daiz713/griddles
 * License: MIT
 */

var griddles = griddles || {};
griddles.msgLoading = "...ごちそうカード";

 /* User settings */
griddles.layout = {
    "page_title": "ごちそうカード",
    "app_name": "gochiso card",
    "app_icon": "GochisoCard_v2.png",
    "card_width_px": 260,
    "card_height_px": "auto",//260, 
    "card_margin_bottom": 14,
    "stream_margin_left_px": 7,
    "stream_margin_right_px": 7,
    "available_width_percent": 85,
    "tooltip": "no",
    "cards": [
    ]
};

griddles.layout.cardOnClick = function(j) {
    console.log(j);
    visitPage(j);
}