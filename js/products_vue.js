const API_URL = 'js/products.json';

Vue.component('goods-item', { // Создание нового компонента
	template: '<div :data-id="id" class="goods-item"><h3>{{ title }}</h3><p>{{ price }}</p></div>',
	props: ['title', 'price', 'id'] // задаем параметры компонента
})
  
Vue.component('cart', { // создание компонента корзины
	template: `<div>
	<button class="cart-button" @click="openCartHandler" type="button">Корзина</button>
		<p class="close-button" @click="openCartHandler">x</p>
	  	<div v-if="isVisibleCart" v-on:click="removeHandler">
		<slot></slot>
		<p><b>Итого: </b> {{commonvalue}}</p>
	  </div>
	</div>`,
	data() { // данные компонента (Обязательно в виде метода!)
	  return {
		isVisibleCart: false
	  }
	},
	props: ['commonvalue'],
	methods: {
	  openCartHandler() {
		this.isVisibleCart = !this.isVisibleCart;
	  },
	  removeHandler(e) {
		this.$emit('remove', e) // Генерируем пользовательское событие
	  },

	}
})

Vue.component('search', {
	template: `<div><input class="search" @input="secondSearchHandler"> </div>`,
	methods: {
		secondSearchHandler(e) {
			this.$emit('search', e);
		}
	},
	props: ['searchvalue'],
})

const vue = new Vue ({
	el: '#main',
	data: {
		search: [],
		goods: [],
		filteredGoods: [],
		cart: []
	},
	methods: {
		searchHandler(e) {
			if(e.data == null){
				this.search.splice(-1);
			}else{
				this.search.push(e.data);
			}
			if(this.search.length == 0){
				this.filteredGoods = this.goods;
			}
			let searchStr = this.search.join('');
			console.log(searchStr);
			console.log(this.cart);

			const regexp = new RegExp(searchStr, 'gi');
			this.filteredGoods = this.goods.filter((good) => regexp.test(good.title));
		},
        fetch(error, success) {
            let xhr;
            if(window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            }else if(window.ActiveXObject) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4){
                    success(JSON.parse(xhr.responseText));
                }else if(xhr.status > 400) {
                    error('Something went wrong');
                }
            }

            xhr.open('GET', API_URL, true);
            xhr.send();
        },
        fetchPromise() {
            return new Promise((resolve, reject) => {
                this.fetch(reject, resolve)
            })
        },
		addToCart(element){
			const itemIndex = element.target.dataset.index;
			const cartItem = this.filteredGoods[itemIndex];
			if (this.cart) {
				let maxIdNum = this.cart.reduce((maxId, item) => Math.max(maxId, item.id), 0);
				cartItem.id = maxIdNum + 1;
			}else{
				cartItem.id = 0;
				this.cart = [];
			} 
			fetch('/cart', {
				method: 'POST',
				headers: {
				  'Content-Type': 'application/json'
				}, 
				body: JSON.stringify(cartItem)
			})
			this.cart.push(cartItem);
		},
		removeFromCartHandler(e) {
			console.log(e)
			const id = e.target.closest('.goods-item').dataset.id;
			const goodIndex = this.cart.findIndex((item) => item.id == id);
			fetch('/cart', {
				method: 'DELETE',
				headers: {
				  'Content-Type': 'application/json'
				}, 
				body: JSON.stringify({id: id})
			})
			this.cart.splice(goodIndex, 1);
		},
		makePOSTRequest(url, data, callback) {
			let xhr;
		
			if (window.XMLHttpRequest) {
			  xhr = new XMLHttpRequest();
			} else if (window.ActiveXObject) { 
			  xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
		
			xhr.onreadystatechange = function () {
			  if (xhr.readyState === 4) {
				callback(xhr.responseText);
			  }
			}
		
			xhr.open('POST', url, true);
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		
			xhr.send(data);
		}
	},
    mounted: function() {
        this.fetchPromise('/catalogData')
        .then(data => {
            this.goods = data;
            this.filteredGoods = data;
        })
        .catch(err =>{
            console.log(err);
        })

		fetch('/cart')
		.then(response => response.json())
		.then(data => {
		this.cart = data;
		})
		.catch(err => {
		console.log(err);
		}) 
    },
	computed: {
		getSummInCart: function(){
			if (this.cart) {
				const totalSumm = this.cart.reduce((partial_sum, {price}) => partial_sum + price, 0); //для подсчета суммы в массиве объектов
				return totalSumm;
			}else{
				return 0;
			}	
		}
	}
})

