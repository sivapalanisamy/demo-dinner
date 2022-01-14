document.addEventListener('DOMContentLoaded', function () {
    const targetElement = document.getElementsByClassName('section--shipping-address');
    if (targetElement.length) {
        console.log('In shipping address page - fetching the shipping address from cart data');
        fetch('/cart.js')
            .then((response) => response.json())
            .then((cartData) => {
                if ('shipping_address' in cartData['attributes']) {
                    const shippingAddress = JSON.parse(cartData['attributes']['shipping_address'].replace(/=>/g, ':'));
                    console.log(shippingAddress);
                }
            });
    }
});