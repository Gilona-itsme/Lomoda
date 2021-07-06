"use strict";

const headerCityBtn = document.querySelector('.header__city-button');
const subHeaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');
const body = document.querySelector('body');


/*Change city */

headerCityBtn.textContent = localStorage.getItem('lomoda-location') || 'Ващ город?';


headerCityBtn.addEventListener('click', () => {
    const city = prompt('Укажите Ваш город');
    if (city.length > 0) {
         headerCityBtn.textContent = city; 
    }
  
    localStorage.setItem('lomoda-location', city);
});

/* Blocked scroll */
const disableScroll = () => {
    const widthScroll = window.innerWidth - document.body.offsetWidth;
    document.body.dbScrollY = window.scrollY;
    document.body.style.cssText = `overFlow: hidden;
    position: fixed;
    top: ${-window.scrollY}px;
    left:0;
    width: 100%;
    height: 100vh;
    padding-right: ${widthScroll}px`;
};

const enableScroll = () => {
    document.body.style.cssText = '';
    window.scroll({
        top: document.body.dbScrollY
    });
};


/* Modal window */
const cartModalOpen = () => {
    cartOverlay.classList.add('cart-overlay-open');
    disableScroll();
};

const cartModalClose = () => {
    cartOverlay.classList.remove('cart-overlay-open');
    enableScroll();
};


subHeaderCart.addEventListener('click', cartModalOpen);

cartOverlay.addEventListener('click', event => {
    const target = event.target;

    if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')) {
        cartModalClose();
    }
});


body.addEventListener('keydown', event => {
   
    if (event.code === 'Escape') {
        cartModalClose();
    }
    
});