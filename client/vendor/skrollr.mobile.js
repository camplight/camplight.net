if(require("./mobileCheck").isMobile()){
  var iScroll = require("./iscroll").iScroll;
  (function(window, document, undefined) {

      window.setTimeout(function() {
        skrollr.iscroll = new iScroll(document.body, {
          bounce: false,
          useTransform: false
        });
        document.documentElement.style.overflow = document.body.style.overflow = 'hidden';

        var skrollrBody = document.getElementById('skrollr-body');

        if(!skrollrBody) {
          throw "For mobile support skrollr needs a #skrollr-body element";
        }

        skrollrBody.style.cssText += 'overflow:hidden;position:absolute;width:100%;';

        window.scroll(0, 0)
        
      }, 200);
  }(window, document));
}