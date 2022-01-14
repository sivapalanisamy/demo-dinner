document.addEventListener('DOMContentLoaded', function () {
    const targetElement = document.getElementsByClassName('section--shipping-address');
    if (targetElement.length) {
        console.log('In shipping address page...');
    }
});
/*
(function ($) {
    //Checking if current page is shipping address information section
    if ($('.section--shipping-address').length) {
        console.log('In shipping address page...');
    }
})(jQuery);
*/
