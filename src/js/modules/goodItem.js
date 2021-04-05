const goodsItem = Vue.component('goods-item', { // Создание нового компонента
	template: '<div :data-id="id" class="goods-item"><h3>{{ title }}</h3><p>{{ price }}</p></div>',
	props: ['title', 'price', 'id'] // задаем параметры компонента
})

module.exports = {
    goodsItem: goodsItem
}; 