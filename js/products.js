//classes

class ApiMock {
    constructor() {

    }

    fetch() {
        return [
            {id: 1, title: 'Jacket', price: 52, description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.", img: 'img/prod1.jpg', link: '#' },
            {id: 2, title: 'Shoes', price: 250, description: "Tempora sed aperiam id quo atque rem ducimus alias odit tenetur. Alias?", img: 'img/prod2.jpg', link: '#' },
            {id: 3, title: 'Shorts', price: 70, description: "Tempora sed aperiam id quo atque rem ducimus alias odit tenetur. Alias?", img: 'img/prod3.jpg', link: '#' },
            {id: 4, title: 'Pants', price: 150, description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.", img: 'img/prod4.jpg', link: '#' },
            {id: 5, title: 'Blouse', price: 90, description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.", img: 'img/prod5.jpg', link: '#' },
            {id: 6, title: 'T-short', price: 120, description: "Tempora sed aperiam id quo atque rem ducimus alias odit tenetur. Alias?", img: 'img/prod6.jpg', link: '#' },
        ];
    }
}

class Api {
    constructor() {
      this.url = `js/products.json`;
    }

    fetch(error, success) {
      let xhr;
    
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else if (window.ActiveXObject) { 
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
      }
    
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if(xhr.status === 200) {
            success(JSON.parse(xhr.responseText));
          } else if(xhr.status > 400) {
            error('все пропало');
          }
        }
      }
    
      xhr.open('GET', this.url, true);
      xhr.send();
    }

    fetchPromise() {
      return new Promise((resolve, reject) => {
        this.fetch(reject, resolve)
      }) 
    }
}




// class testNewApi {
//     constructor() {
//         this.api = new Api();

//         this.$goodsList = document.querySelector('#featured-homepage__products-list');
//         this.goods = [];

//         const fetch = this.api.fetchPromise();

//         fetch.then((data) => { 
//         this.fetchGoods(data) 
//         })
//         .catch((err) => { 
//         this.onFetchError(err) 
//         });

//         // console.log(fetch);
//     }
//     onFetchError(err) {
//       this.$goodsList.insertAdjacentHTML('beforeend', `<h3>${err}</h3>`);
//     }

//     fetchGoods(data = []) {
//         this.goods = data.map( ({id, title, price, description, img, link}) => new GoodsItem(id, title, price, description, img, link) );
//     }

// }

// const testnewapi = new testNewApi();

// testnewapi.fetchGoods();


class GoodsItem {
    constructor(id, title, price, description, img, link) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.img = img;
        this.link = link;
        this.description = description;
    }

    getHtml() {
        return `
        <li class="featured-homepage__product-card">
            <a class="link" href="${this.link}">
                <img src="${this.img}" alt="product">
                <div class="text-block">
                    <h5>${this.title}</h5>
                    <p class="description">${this.description}</p>
                    <span class="price pink">$${this.price}</span>
                </div>
            </a>
            <button onclick="cartList.insertToCart(${this.id})" class="button pink">Add to cart</button>
        </li>`;
    }
}

class GoodsList {

    // constructor() {
    //     this.api = new ApiMock();
    //     this.$goodsList = document.querySelector('#featured-homepage__products-list');
    //     this.goods = [];
    // }

    // fetchGoods() {
    //     this.goods = this.api.fetch().map( ({id, title, price, description, img, link}) => new GoodsItem(id, title, price, description, img, link) );
    // }


    constructor() {
        this.api = new Api();

        this.$goodsList = document.querySelector('#featured-homepage__products-list');
        this.goods = [];

        const fetch = this.api.fetchPromise();

        fetch.then((data) => { 
        this.fetchGoods(data) 
        })
        .catch((err) => { 
        this.onFetchError(err) 
        });

        // console.log(fetch);
    }
    onFetchError(err) {
        this.$goodsList.insertAdjacentHTML('beforeend', `<h3>${err}</h3>`);
    }

    fetchGoods(data = []) {
        this.goods = data.map( ({id, title, price, description, img, link}) => new GoodsItem(id, title, price, description, img, link) );
        this.render();
        return this.goods;
    }



    render() {
        this.$goodsList.textContent = '';
        this.goods.forEach((good) => {
            this.$goodsList.insertAdjacentHTML('beforeend', good.getHtml());
        });
    }

    totalSumm() { //задание номер 2
        let totalSummValue = 0;
        this.goods.forEach((good) => {
            totalSummValue += good.price;
        });
        return totalSummValue;
    }

}

//задание 1 начало
class CartList {

    constructor() {
        // this.cartList = [];
        this.cartList = this.cartList || [];
        this.api = new GoodsList();
    }

    insertToCart(itemSelected) {
        this.closeCartList();
       
        this.cartList = JSON.parse(localStorage.getItem('cart'));
        if (this.cartList == null) {
           this.cartList = [];
        }
        this.cartList.push(this.api.goods[itemSelected - 1]);
        console.log( this.cartList);
        
        
        localStorage.setItem('cart', JSON.stringify(this.cartList) );
        
        return this.getCartList();
    }

    getCartList() {
        let $cartList = '';
        let $header = document.querySelector('.header');
        JSON.parse(localStorage.getItem('cart')).forEach((cart) => {
            $cartList += cartItem.render(cart.id, cart.title, cart.price, cart.description, cart.img, cart.link);
        });
        $header.insertAdjacentHTML('beforeend', `<div class="cart-list-master"> 
            <button onclick="cartList.closeCartList()">Close</button>
            <h2>CartList</h2>
            ${$cartList}
            </div>`);
    }
    closeCartList(){
        let $cartListHtmlRemove = document.querySelector('.cart-list-master');
        if ($cartListHtmlRemove) {
            $cartListHtmlRemove.remove();
        }
    }
    removeFromCart(cartItem) {
        let idCartItem = cartItem.getAttribute('itemId');
        let cartListToRemove = JSON.parse(localStorage.getItem('cart'));
        let obj = cartListToRemove.findIndex(o => o.id === idCartItem);

        cartListToRemove.splice(obj, 1); 
        localStorage.setItem('cart', JSON.stringify(cartListToRemove) );
        cartItem.remove();
    }
}

class CartItem {

    constructor() {
    }

    render(id, title, price, description, img, link) {
        let $cartItem = `<div class="cartItem" onclick="cartList.removeFromCart(this)" itemId="${id}"> <h3>${title}</h3> <p>${price}</p> <p>${description}</p></div>`
        return $cartItem;
    }

}
//задание 2 начало

const cartList = new CartList();
const goodsList = new GoodsList();
const cartItem = new CartItem();


goodsList.fetchGoods();
// goodsList.render();
console.log(goodsList.totalSumm());
let $cart = document.querySelector('.header-navigation .cart');
$cart.addEventListener("click", cartList.getCartList);
