'use strict';

const headerCityBtn = document.querySelector('.header__city-button');
const subHeaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');
const body = document.querySelector('body');

let hash = location.hash.substring(1);

/*Change city */

headerCityBtn.textContent =
  localStorage.getItem('lomoda-location') || 'Ващ город?';

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
    top: document.body.dbScrollY,
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

/* Fetch */

const getData = async () => {
  const data = await fetch('db.json');
  if (data.ok) {
    return data.json();
  } else {
    throw new Error(`Error ${data.status} ${data.statusText}`);
  }
};

const getGoods = (cb, value) => {
  getData()
    .then(data => {
      if (value) {
        cb(data.filter(item => item.category === value));
      } else {
        cb(data);
      }
    })
    .catch(err => {
      console.error(err);
    });
};

const changeTitle = () => {
  let navigationLink = document.querySelectorAll('.navigation__link');
  const goodsTitle = document.querySelector('.goods__title');

  navigationLink.forEach(link => {
    console.log(link);
    if (link.hash.substring(1) === hash) {
      goodsTitle.textContent = link.innerHTML;
    }
  });

  console.log(hash);
};

try {
  const goodsList = document.querySelector('.goods__list');
  if (!goodsList) {
    throw 'This is not a goods page';
  }
  const craeteCard = ({ id, preview, cost, brand, name, sizes }) => {
    const li = document.createElement('li');

    li.classList.add('goods__item');
    li.innerHTML = `<article class="good">
                            <a class="good__link-img" href="card-good.html#${id}">
                                <img class="good__img" src=goods-image/${preview} alt="">
                            </a>
                            <div class="good__description">
                                <p class="good__price">${cost} &#8381;</p>
                                <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
                              ${
                                sizes
                                  ? `<p class="good__sizes">
                                    Размеры (RUS):
                                    <span class="good__sizes-list">
                                      ${sizes.join(' ')}
                                    </span>
                                  </p>`
                                  : ''
                              }
                                <a class="good__link" href="card-good.html#${id}">Подробнее</a>
                            </div>
                        </article>`;

    return li;
  };

  const renderGoodsList = data => {
    goodsList.textContent = '';
    changeTitle();
    data.map(item => {
      const card = craeteCard(item);

      goodsList.append(card);
    });
  };

  window.addEventListener('hashchange', () => {
    hash = location.hash.substring(1);
    getGoods(renderGoodsList, hash);
  });
  getGoods(renderGoodsList, hash);
} catch (error) {
  console.warn(error);
}

// try {
//   const titleList = document.querySelector('.container');

//   const createTitle = ({ category }) => {
//     const title = document.createElement('h2');

//     title.classList.add('goods__title');
//     title.innerHTML = `<h2 class="goods__title">${category}</h2>`;
//     return title;
//   };

//   const renderTitle = data => {
//     titleList.textContent = '';
//     data.forEach(item => {
//       const title = createTitle(item);
//       titleList.append(title);
//     });
//   };
//   window.addEventListener('hashchange', () => {
//     hash = location.hash.substring(1);
//     getGoods(renderTitle, hash);
//   });
//   getGoods(renderTitle, hash);
// } catch (error) {
//   console.warn(error);
// }
