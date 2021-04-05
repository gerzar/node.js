const search = Vue.component('search', {
	template: `<div><input class="search" @input="secondSearchHandler"> </div>`,
	methods: {
		secondSearchHandler(e) {
			this.$emit('search', e);
		}
	},
	props: ['searchvalue'],
})

module.exports = {
    search
}; 