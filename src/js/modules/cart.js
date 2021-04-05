const cart = Vue.component('cart', { // создание компонента корзины
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

module.exports = {
    cart
}; 