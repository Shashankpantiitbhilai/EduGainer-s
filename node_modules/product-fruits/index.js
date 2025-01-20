let initialized = false;

function initInternal() {
    if (typeof window == 'undefined') {
        throw new Error('product-fruits package can run only in the browser environment. If you use server-side-generation, please update your code to import this package only in the browser.')
    }

    (function (w, d, u) {
        w.$productFruits = w.$productFruits || [];
        w.productFruits = w.productFruits || {}; w.productFruits.scrV = '2';
        let a = d.getElementsByTagName('head')[0]; let r = d.createElement('script'); r.async = 1; r.src = u; a.appendChild(r);
    })(window, document, 'https://app.productfruits.com/static/script.js'); // todo make it env agnostic
}

function apiInit(projectCode, language, userInfo, options) {// todo make it env agnostic
    // if (initialized) {
    //     throw new Error('Do not call init() multiple times');
    // }

    initInternal();

    window.$productFruits.push(['init', projectCode, language, userInfo, options]);

    initialized = true;
}

function apiSafeExec(callback) {
    if (typeof callback !== 'function') throw new Error('You have to pass a callback to safeExec');

    if (window.productFruitsIsReady) {
        callback(window.$productFruits);
    } else {
        const handler = () => {
            callback(window.$productFruits);
        }

        window.addEventListener('productfruits_ready', handler, { once: true });
    }
}

export const productFruits = {
    init: apiInit,
    //updateUserData: apiUpdateUserData,
    safeExec: apiSafeExec
}