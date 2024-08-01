class CustomProductCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.product = this.product || JSON.parse(this.getAttribute('product'));
    this.render();
    this.initFavoriteIcon();
  }

  initFavoriteIcon() {
    if (window.app?.status === 'ready') {
      this.updateFavoriteIcon();
    } else {
      document.addEventListener('theme::ready', () => this.updateFavoriteIcon());
    }
  }

  updateFavoriteIcon() {
    if (!salla.config.isGuest()) {
      salla.storage.get('salla::wishlist', []).forEach(id => {
        if (id === this.product.id) {
          this.toggleFavoriteIcon(true);
        }
      });
    }
  }

  toggleFavoriteIcon(isAdded) {
    const btn = this.shadowRoot.querySelector('.s-product-card-wishlist-btn');
    if (btn) {
      btn.classList.toggle('s-product-card-wishlist-added', isAdded);
      btn.classList.toggle('not-added', !isAdded);
      btn.classList.toggle('pulse-anime', isAdded);
    }
  }

  render() {
    const promotionTitleDisplay = this.product.promotion_title ? 'block' : 'none';

    this.shadowRoot.innerHTML = `
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

    <style>
    .custom-product-card {
      background-color: #ffffff;
      padding: 1vw;
      color: #27314b;
      box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
      text-align: center;
      position: relative;
      transition: background-color 0.5s ease, transform 0.5s ease;
      height: auto;
      min-height:55vh;
      margin: 1vh 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }

    .custom-product-card:hover {
      background-color: #f0f0f0;
      transform: translateY(-0.5vh);
    }

    .custom-product-card-title {
      font-size: 1.6em;
      font-weight: 100;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: justify-content 0.5s ease;
      margin: 1vh 0;
    }

    .custom-product-card-title a {
      text-decoration: none;
      color: #27314b;
    }

    .product-name {
      display: inline-block;
      text-decoration: none;
      color: #27314b;
      transition: margin-right 0.5s ease;
      padding: 0 0.5vw;
    }

    .product-price {
      display: none;
      color: #a5804a;
      transition: display 0.5s ease;
      margin: 0 0.4vw;
      font-size: 0.9em;
    }

    .separator {
      width: 0;
      height: 1px;
      background-color: #a5804a;
      transition: width 0.5s ease;
    }

    .custom-product-card:hover .custom-product-card-title {
      justify-content: flex-start;
    }

    .custom-product-card:hover .product-price {
      display: inline-block;
    }

    .custom-product-card:hover .separator {
      width: auto;
      flex-grow: 1;
      margin: 0 5px; /* Adjust the margin to create space between name and price */
    }

    .custom-product-card-image {
      height: auto;
      max-height: 30vh;
      min-height: 30vh;

      overflow: hidden;
      border-bottom: 1px solid #eee;
    }

    .custom-product-card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .custom-product-card:hover .custom-product-card-image img {
      transform: scale(1.05);
    }

    .custom-product-card-content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1vh 0;
    }

    .custom-product-card-description {
      font-size: 0.9em;
      text-align: right;
      font-weight: 100;
      min-height:10vh;
      margin: 1vh 0;
    }  .custom-product-card-add-to-cart-btn {
    background-color: #a5804a;
    color: #fff;
    border: none;
    cursor: pointer;
    font-size: 1em;
    padding: 0.8vh 1vw;
    transition: background-color 0.5s ease, color 0.5s ease;
    align-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1vh;
        font-family: 'etab' !important;
    border-radius: 0; 
  }

  .custom-product-card-add-to-cart-btn:hover {
    background-color: #f0f0f0;
    color: #a5804a;
  }

    .custom-product-promotion-title {
      position: absolute;
      top: 16px;
      left: 16px;
      color: #a5804a;
      font-size: 2em;
      display: ${promotionTitleDisplay};
      transition: display 0.5s ease;
      writing-mode: vertical-lr; 

    }

    .s-product-card-wishlist-btn {
      position: absolute;
      top: 1vh;
      right: 1vw;
      cursor: pointer;
      border: none;
      background: transparent;
    }

    .s-product-card-wishlist-btn .sicon-heart {
      color: #a5804a;
      font-size: 1.5em;
    }

    .s-product-card-wishlist-btn.s-product-card-wishlist-added .sicon-heart {
      color: red;
    }
    </style>
      <link rel="stylesheet" href="assets/css/custom-product-card.css">
      <div class="custom-product-card">
        <div class="custom-product-promotion-title">${this.product.promotion_title || ''}</div>
        <button class="s-product-card-wishlist-btn">
          <i class="sicon-heart"></i>
        </button>
        <div class="custom-product-card-image">
          <a href="${this.product.url}">
            <img src="${this.product.image?.url || ''}" alt="${this.product.image?.alt || ''}" />
          </a>
        </div>
        <div class="custom-product-card-content">
          <h3 class="custom-product-card-title">
            <span class="product-name"><a href="${this.product.url}">${this.product.name}</a></span>
            <div class="separator"></div>
            <span class="product-price">${this.product.price || ''} ر.س</span>
          </h3>
          <p class="custom-product-card-description">${this.product.description || ''}</p>
          <button class="custom-product-card-add-to-cart-btn" aria-label="Add to wishlist" onclick="salla.wishlist.toggle(${this.product.id})">
            أضف الى السلة
             <i class="fas fa-shopping-cart" style="margin-right: 8px;"></i>
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('custom-salla-product-card', CustomProductCard);
