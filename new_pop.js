window.addEventListener("click", function(e) {
   switch(e.target.id) {
      case "btn_open_cards": window.open('griddles/template.html');break;
      case "btn_open_option": window.open('options.html');break;
      case "btn_icon_cards": window.open('griddles/template.html');break;
   }
}, false);