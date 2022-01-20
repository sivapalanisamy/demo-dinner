if (!customElements.get('product-form')) {
    customElements.define('product-form', class ProductForm extends HTMLElement {
        constructor() {
            super();

            this.form = this.querySelector('form');
            this.form.querySelector('[name=id]').disabled = false;
            this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
            this.cartNotification = document.querySelector('cart-notification');
        }

        onSubmitHandler(evt) {
            evt.preventDefault();
            const submitButton = this.querySelector('[type="submit"]');
            if (submitButton.classList.contains('loading')) return;

            this.handleErrorMessage();
            this.cartNotification.setActiveElement(document.activeElement);

            submitButton.setAttribute('aria-disabled', true);
            submitButton.classList.add('loading');
            this.querySelector('.loading-overlay__spinner').classList.remove('hidden');

            const config = fetchConfig('javascript');
            config.headers['X-Requested-With'] = 'XMLHttpRequest';
            delete config.headers['Content-Type'];

            const formData = new FormData(this.form);
            formData.append('sections', this.cartNotification.getSectionsToRender().map((section) => section.id));
            formData.append('sections_url', window.location.pathname);
            config.body = formData;

            fetch(`${routes.cart_add_url}`, config)
                .then((response) => response.json())
                .then(async (response) => {
                    if (response.status) {
                        this.handleErrorMessage(response.description);
                        return;
                    }

                    this.cartNotification.renderContents(response);

                    console.log('Add to cart in product details page finish...');
                    console.log(response);

                    //Handling the shipping address information
                    await handlingShippingAddressData();

                    //Handling product gift card with message
                    if (response.product_type === "Gift Cards") {
                        await handlingProductGiftCardWithMessage(response);
                    }


                })
                .catch((e) => {
                    console.error(e);
                })
                .finally(() => {
                    submitButton.classList.remove('loading');
                    submitButton.removeAttribute('aria-disabled');
                    this.querySelector('.loading-overlay__spinner').classList.add('hidden');
                });
        }

        handleErrorMessage(errorMessage = false) {
            this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
            this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

            this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

            if (errorMessage) {
                this.errorMessage.textContent = errorMessage;
            }
        }
    });
}

function mappingProductGiftCardMessageToFieldInPDP(productId, variantId) {
    fetch('/cart.js')
        .then((response) => response.json())
        .then((cartData) => {
            if ('gift_card_messages' in cartData['attributes']) {
                const fetchedGiftCardMsgDataObj = JSON.parse(cartData['attributes']['gift_card_messages'].replace(/=>/g, ':'));
                console.log('Fetching current gift card data in cart...');
                console.log(fetchedGiftCardMsgDataObj);
                const giftCardMsgDataCollection = fetchedGiftCardMsgDataObj.data;

                if (giftCardMsgDataCollection.length > 0) {
                    var isExisted = false;
                    $.each(giftCardMsgDataCollection, function (idx, record) {
                        if (record['productId'] === productId && record['variantId'] === variantId) {
                            $('#your-gift-card-message').val(record['message']);
                            return false;
                        }
                    });
                }
            }
        });
}

function handlingProductGiftCardWithMessage(addToCartReponse) {

    if (!addToCartReponse)
        return;
    const productId = addToCartReponse.id;
    const variantId = addToCartReponse.variant_id;
    const giftCardMsgContent = $('#your-gift-card-message').val().trim();

    if (giftCardMsgContent !== 0) {

        const giftCardMsgDataEntry = {
            'productId': productId,
            'variantId': variantId,
            'message': giftCardMsgContent
        };

        var giftCardMsgDataCollection = [];

        fetch('/cart.js')
            .then((response) => response.json())
            .then((cartData) => {
                if ('gift_card_messages' in cartData['attributes']) {
                    const fetchedGiftCardMsgDataObj = JSON.parse(cartData['attributes']['gift_card_messages'].replace(/=>/g, ':'));
                    console.log('Fetching current gift card data in cart...');
                    console.log(fetchedGiftCardMsgDataObj);
                    giftCardMsgDataCollection = fetchedGiftCardMsgDataObj.data;

                    if (giftCardMsgDataCollection.length > 0) {
                        var isExisted = false;
                        $.each(giftCardMsgDataCollection, function (idx, record) {
                            if (record['productId'] === productId && record['variantId'] === variantId) {
                                giftCardMsgDataCollection[idx] = giftCardMsgDataEntry;
                                isExisted = true;
                                return false;
                            }
                        });
                        if (!isExisted) {
                            giftCardMsgDataCollection.push(giftCardMsgDataEntry);
                        }
                    } else {
                        giftCardMsgDataCollection.push(giftCardMsgDataEntry);
                    }
                } else {
                    giftCardMsgDataCollection.push(giftCardMsgDataEntry);
                }

                const giftCardMsgAttrObj = {
                    'attributes': {
                        'gift_card_messages': {
                            'data': giftCardMsgDataCollection
                        }
                    }
                };

                fetch('/cart/update.js', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(giftCardMsgAttrObj),
                }).then(response => {
                    console.info('Successfully add the gift card message address to the cart\'s attributes !')
                }).catch((error) => {
                    console.error('Error:', error);
                });

            });

    }


}
