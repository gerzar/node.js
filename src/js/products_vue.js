const API_URL = 'src/js/products.json';

import './modules/goodItem.js';
import './modules/cart.js';
import './modules/search.js';

const vue = new Vue ({
	el: '#main',
	data: {
		search: [],
		goods: [],
		filteredGoods: [],
		cart: [],
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
				console.log(totalSumm);
			}else{
				return 0;
			}	
		}
	}
})

