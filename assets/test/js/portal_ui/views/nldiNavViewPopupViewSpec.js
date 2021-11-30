import NldiNavPopupView from '../../../../js/views/NldiNavPopupView.vue';
import NldiModel from '../../../../js/NldiModel.vue';
import { shallowMount } from '@vue/test-utils';

describe('nldiNavViewPopupView', function() {
    var testDiv;
    var testMap;
    var navHandlerSpy;
    let nldiModel;
    let nldiNavPopup;

    beforeEach(function() {
        document.body.innerHTML = '<div id=test-div style="height: 30px; width: 30px;"></div>';
        testDiv = document.querySelector('#test-div');
        testMap = L.map('test-div', {
            center: [43.0, -100.0],
            zoom: 4
        });

        navHandlerSpy = jasmine.createSpy('navHandlerSpy');

        nldiModel = shallowMount(NldiModel);
        nldiNavPopup = shallowMount(NldiNavPopupView, {
            propsData: {
                onMap: testMap, 
                feature: {},
                atLatLng: L.latLng(43.0, -100.0), 
                navHandler: navHandlerSpy,
            }
        });
        nldiNavPopup.vm.initialize();
    });

    afterEach(function() {
        testDiv.remove();
    });

    it('Expects that when updating the navigation type, the nldiModel is updated and the Navigate button is enabled', function() {
        var select = document.querySelector('.navigation-selection-div select');
        var button = document.querySelector('.navigation-selection-div button');

        expect(select.value).toEqual('');
        expect(button.disabled).toBe(true);

        let e = new Event('change');
        select.selectedOptions[0].value = 'UM';
        select.dispatchEvent(e);

        expect(nldiModel.vm.getData().navigation.id).toEqual('UM');
        expect(button.disabled).toBe(false);
    });

    it('Expects that when updating the distance, the nldModel is updated', function() {
        var distance = document.querySelector('.navigation-selection-div input[type="text"]');
        let e = new Event('change');
        distance.value = '100';
        distance.dispatchEvent(e);

        expect(nldiModel.vm.getData().distance).toEqual('100');
    });

    it('Expects that clicking the button causes the navHandler to be executed', function() {
        expect(navHandlerSpy).not.toHaveBeenCalled();

        let e = new Event('click');
        document.querySelector('.navigation-selection-div button').dispatchEvent(e);
        expect(navHandlerSpy).toHaveBeenCalled();
    });
});