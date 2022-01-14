document.addEventListener('DOMContentLoaded', function () {
    const targetElement = document.getElementsByClassName('section--shipping-address');
    if (targetElement.length) {
        console.log('In shipping address page - fetching the shipping address from cart data');
        fetch('/cart.js')
            .then((response) => response.json())
            .then((cartData) => {
                if ('shipping_address' in cartData['attributes']) {
                    const shippingAddress = JSON.parse(cartData['attributes']['shipping_address'].replace(/=>/g, ':'));
                    console.log('Stored shipping address information:');
                    console.log(shippingAddress);

                    document.getElementById('checkout_shipping_address_country').setAttribute("disabled", "disabled");

                    document.getElementById('checkout_shipping_address_first_name').value = 'LadyDinner';
                    document.getElementById('checkout_shipping_address_last_name').value = 'SAI-Digital';
                    document.getElementById('checkout_shipping_address_address1').value = 'Level 14, 275 Alfred Street N, North Sydney NSW 2060';
                    document.getElementById('checkout_shipping_address_city').value = 'Matraville';
                    document.getElementById('checkout_shipping_address_province').value = 'NSW';

                    const postalCodeElement = document.getElementById('checkout_shipping_address_zip');
                    postalCodeElement.setAttribute("disabled", "disabled");
                    postalCodeElement.value = shippingAddress.postalCode;


                }
            });
    }
});
