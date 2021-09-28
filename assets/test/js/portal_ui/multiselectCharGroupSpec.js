import MultiselectCharGroup from '../../../js/MultiselectCharGroup.vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { Multiselect } from 'vue-multiselect';
import Vuex from 'vuex';

const localVue = createLocalVue()

localVue.use(Vuex)

describe('MultiselectCharGroup', () => {
    let store;

    beforeEach(() => {
        store = new Vuex.Store()
    })

    it('expects chargroupValue to change on input event', function() {
        const wrapper = shallowMount(MultiselectCharGroup, {store});
        const multiselect = wrapper.findComponent(Multiselect);
        wrapper.vm.chargroupValue = ["test"]
        expect(wrapper.vm.chargroupValue.length).toEqual(1);
        multiselect.trigger('input');
        expect(wrapper.vm.chargroupValue.length).toEqual(0);
    });
});