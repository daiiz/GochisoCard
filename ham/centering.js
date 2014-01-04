function centering() {
    var card_width = 280;
    var stage_id = "photo_stream";
    var ww = window.innerWidth;
    var wh = window.innerHeight
    var w85pc = Math.floor(ww * 0.85 - 13);
    var max_boxs = Math.floor(w85pc/ card_width);
    var left = w85pc - (max_boxs * card_width);
    var margin_left = left / 2;
    console.log(margin_left);
    document.getElementById(stage_id).style.marginLeft = margin_left + "px";
    console.log(document.getElementById(stage_id));
    
}

centering();
window.addEventListener("resize", centering, false);