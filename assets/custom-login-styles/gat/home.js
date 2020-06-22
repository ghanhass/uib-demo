function isMatch(el, match){//cross plateform Element.matches() workaround
    return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, match);
  }
  
  function getDOMClosest(elem, selector){//DOM closest ancestor speified by a CSS selector
    for ( ; elem && elem !== document; elem = elem.parentNode ) {
      if ( isMatch(elem, selector) ) return elem;
    }
    return null;
  }
  
  
  document.addEventListener('click', function(event){
      let markedEl = document.querySelector(".show-mobile");
      if (markedEl){
          markedEl.classList.remove("show-mobile");
      }
      else{
          let el = event.target;
          if(el.tagName === 'P' && el.classList.contains("social-infos")){
              el.classList.toggle("show-mobile");
          }
          else{
              let element = getDOMClosest(event.target, ".social-infos");
              if(element){
                  el.classList.toggle("show-mobile");
              }
          }
      }
      
  });
  
$(document).keydown(function (event) {
    if (event.keyCode == 123) { // Prevent F12
        return false;
    } else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) { // Prevent Ctrl+Shift+I        
        return false;
    }
});


$(document).on("contextmenu", function (e) {        
    e.preventDefault();
});
  
  function clickListener(ev){
    if(isMatch(ev.target, ".register-position-btn a, .register-position-btn span, .register-position-btn i")){
        console.log('HEY');
        document.querySelector('app-login .wrap-login100').style.cssText += 'display:none !important;'
        ev.preventDefault();
        ev.stopPropagation();
        location.pathname = '/menu/edit/25/item/PROCESS/145';
    }else if((ev.target.innerText=="DEMANDE COMPTE CLIENT")){
			console.log('ok2');
			location.pathname = '/menu/edit/25/item/PROCESS/145';
		
	}
}


document.addEventListener("click", clickListener);
