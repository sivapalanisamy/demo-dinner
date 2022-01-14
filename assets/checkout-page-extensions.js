/*
(function ($) {
    $(function () {//document.ready
        if ($('.section--shipping-address').length) {
            console.log('In shipping address page...');
        }

    });
    //Functions, Plugins, Etc.. Here
    //(does not wait for DOM READY STATE)

})(jQuery);
*/


jQuery(window).load(function () { // < remove the $ here
    console.log('Everything loaded');
    if (jQuery('.section--shipping-address').length) {
        
    }
});
