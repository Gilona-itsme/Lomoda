'use strict';

const headerCityBtn = document.querySelector('.header__city-button');
const subHeaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');
const body = document.querySelector('body');
const cardGood = document.querySelector('.card_good');

const cardGoodImage = document.querySelector('.card-good__image');
const cardGoodBrand = document.querySelector('.card-good__brand');
const cardGoodTitle = document.querySelector('.card-good__title');
const cardGoodPrice = document.querySelector('.card-good__price');
const cardGoodColor = document.querySelector('.card-good__color');
const cardGoodSelectWrapper = document.querySelectorAll(
  '.card-good__select__wrapper',
);
const cardGoodColorList = document.querySelector('.card-good__color-list');
const cardGoodSizes = document.querySelector('.card-good__sizes');
const cardGoodSizesList = document.querySelector('.card-good__sizes-list');
const cardGoodBuy = document.querySelector('.card-good__buy');

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
  if (document.disableScroll) return;
  const widthScroll = window.innerWidth - document.body.offsetWidth;

  document.disableScroll = true;
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
  document.disableScroll = false;
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

const getGoods = (cb, prop, value) => {
  getData()
    .then(data => {
      if (value) {
        cb(data.filter(item => item[prop] === value));
      } else {
        cb(data);
      }
    })
    .catch(err => {
      console.error(err);
    });
};

// const changeTitle = () => {
//   let navigationLink = document.querySelectorAll('.navigation__link');
//   const goodsTitle = document.querySelector('.goods__title');

//   navigationLink.forEach(link => {
//     if (link.hash.substring(1) === hash) {
//       goodsTitle.textContent = link.innerHTML;
//     }
//   });
// };

/**Page category */
try {
  const goodsList = document.querySelector('.goods__list');
  if (!goodsList) {
    throw 'This is not a goods page';
  }

  const goodsTitle = document.querySelector('.goods__title');

  const changeTitle = () => {
    goodsTitle.textContent = document.querySelector(
      `[href*="#${hash}"]`,
    ).textContent;
  };

  const craeteCard = ({ id, preview, cost, brand, name, sizes }) => {
    const li = document.createElement('li');

    li.classList.add('goods__item');
    li.innerHTML = `<article class="good">
                            <a class="good__link-img" href="card-good.html#${id}">
                                <img class="good__img" src=goods-image/${preview} alt="">
                            </a>
                            <div class="good__description">
                                <p class="good__price">${cost} ₴</p>
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

    data.map(item => {
      const card = craeteCard(item);

      goodsList.append(card);
    });
  };

  window.addEventListener('hashchange', () => {
    hash = location.hash.substring(1);
    getGoods(renderGoodsList, 'category', hash);
    changeTitle();
  });
  changeTitle();
  getGoods(renderGoodsList, 'category', hash);
} catch (error) {
  console.warn(error);
}

/**Page product */

try {
  if (cardGood) {
    throw 'This`s not a card good';
  }

  const generateList = data =>
    data.reduce(
      (acc, item, i) =>
        acc + `<li class="card-good__select-item" data-id="${i}">${item}</li>`,
      '',
    );

  const renderCardGood = ([{ brand, name, cost, color, sizes, photo }]) => {
    cardGoodImage.src = `goods-image/${photo}`;
    cardGoodImage.alt = ` ${brand} ${photo}`;
    cardGoodBrand.textContent = brand;
    cardGoodTitle.textContent = name;
    cardGoodPrice.textContent = `${cost} ₴`;
    color
      ? (cardGoodColor.textContent = color[0])
      : (cardGoodColor.style.display = 'none');
    cardGoodColorList.innerHTML = generateList(color);
    cardGoodColor.dataset.id = 0;

    sizes
      ? (cardGoodSizes.textContent = sizes[0])
      : (cardGoodSizes.style.display = 'none');
    cardGoodSizesList.innerHTML = generateList(sizes);
    cardGoodSizes.dataset.id = 0;
  };

  cardGoodSelectWrapper.forEach(item => {
    item.addEventListener('click', e => {
      const target = e.target;
      if (target.closest('.card-good__select')) {
        target.classList.toggle('card-good__select__open');
      }
      if (target.closest('.card-good__select-item')) {
        const cardGoodSelect = item.querySelector('.card-good__select');
        cardGoodSelect.textContent = target.textContent;
        cardGoodSelect.dataset.id = target.dataset.id;
        cardGoodSelect.classList.remove('card-good__select__open');
      }
    });
  });

  getGoods(renderCardGood, 'id', hash);
} catch (error) {
  console.warn(error);
}
