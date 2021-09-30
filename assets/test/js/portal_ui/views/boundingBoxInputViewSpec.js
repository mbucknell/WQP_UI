import BoundingBoxInputView from '../../../../js/views/BoundingBoxInputView.vue';
import { shallowMount } from '@vue/test-utils';

describe('Tests for BoundingBoxInputView', function() {
    let testDiv;
    let testView;
    let north, south, east, west, bbox;

    beforeEach(function() {
        document.body.innerHTML = '<div id="test-div">' +
            '<input type="text" id="north" />' +
            '<input type="text" id="south" />' +
            '<input type="text" id="east" />' +
            '<input type="text" id="west" />' +
            '<input type="hidden" name="bBox" />' +
            '</div>'

        testDiv = document.querySelector('#test-div');
        north = document.querySelector('#north');
        south = document.querySelector('#south');
        east = document.querySelector('#east');
        west = document.querySelector('#west');
        bbox = document.querySelector('input[name="bBox"]');

        testView = shallowMount(BoundingBoxInputView, {
            propsData: {
                container: document.querySelector('#test-div')
            }
        });
    });

    afterEach(function() {
        testDiv.remove();
    });

    it('Expects that all text inputs will flag non numeric inputs', function() {
        testView.vm.initialize();

        north.value = 'abc';
        north.dispatchEvent(new Event('change'));
        expect(testDiv.querySelectorAll('.error-message').length).toBe(1);
        north.value = '12';
        north.dispatchEvent(new Event('change'));
        expect(testDiv.querySelectorAll('.error-message').length).toBe(0);

        south.value = 'abc';
        south.dispatchEvent(new Event('change'));
        expect(testDiv.querySelectorAll('.error-message').length).toBe(1);
        south.value = '12';
        south.dispatchEvent(new Event('change'));
        expect(testDiv.querySelectorAll('.error-message').length).toBe(0);

        west.value = 'abc';
        west.dispatchEvent(new Event('change'));
        expect(testDiv.querySelectorAll('.error-message').length).toBe(1);
        west.value = '12';
        west.dispatchEvent(new Event('change'));
        expect(testDiv.querySelectorAll('.error-message').length).toBe(0);

        east.value = 'abc';
        east.dispatchEvent(new Event('change'));
        expect(testDiv.querySelectorAll('.error-message').length).toBe(1);
        east.value = '12';
        east.dispatchEvent(new Event('change'));
        expect(testDiv.querySelectorAll('.error-message').length).toBe(0);
    });

    it('Expect the inputs to be initialized if the hash contains bbox parameter with 4 comma separated values', () => {
        window.location.hash = '#bBox=-101,42,-100,43';
        testView.vm.initialize();

        expect(bbox.value).toEqual('-101,42,-100,43');
        expect(north.value).toEqual('43');
        expect(south.value).toEqual('42');
        expect(west.value).toEqual('-101');
        expect(east.value).toEqual('-100');

        window.location.hash = '';
    });

    it('Expect the inputs to not be initialized if the hash contains bbox without 4 comma separated values', () => {
        window.location.hash = '#bBox=-101,42,-100';
        testView.vm.initialize();
        
        expect(bbox.value).toEqual('');
        expect(north.value).toEqual('');
        expect(south.value).toEqual('');
        expect(west.value).toEqual('');
        expect(east.value).toEqual('');

        window.location.hash = '';
    });

    it('Expects the hidden input to be set to the null string unless all text inputs are filled in', function() {
        window.location.hash = '';
        testView.vm.initialize();

        north.value = '12';
        north.dispatchEvent(new Event('change'));
        expect(bbox.value).toEqual('');

        south.value = '13';
        south.dispatchEvent(new Event('change'));
        expect(bbox.value).toEqual('');

        west.value = '14';
        west.dispatchEvent(new Event('change'));
        expect(bbox.value).toEqual('');

        east.value = '15';
        east.dispatchEvent(new Event('change'));
        expect(bbox.value).toEqual('14,13,15,12');

        west.value = '20';
        west.dispatchEvent(new Event('change'));
        expect(bbox.value).toEqual('20,13,15,12');

        south.value = '';
        south.dispatchEvent(new Event('change'));
        expect(bbox.value).toEqual('');
        expect(north.value).toEqual('12');
        expect(east.value).toEqual('15');
        expect(west.value).toEqual('20');
    });

    it('Expects the bbox inputs to be cleared if the hidden input is cleared', () => {
        window.location.hash = '';
        testView.vm.initialize();

        north.value = '12';
        north.dispatchEvent(new Event('change'));
        south.value = '13';
        south.dispatchEvent(new Event('change'));
        west.value = '15';
        west.dispatchEvent(new Event('change'));
        east.value = '14';
        east.dispatchEvent(new Event('change'));

        expect(bbox.value).toEqual('15,13,14,12');

        bbox.value = '';
        bbox.dispatchEvent(new Event('change'));
        expect(bbox.value).toEqual('');
    });

    it('Expects that the "Bounding Box" fields will blank after "resetContainer" is run', function() {
        window.location.hash = '#bBox=-101,42,-100,43';
        testView.vm.initialize();
        expect(bbox.value).toEqual('-101,42,-100,43');

        testView.vm.resetContainer();
        expect(north.value).toEqual('');
        expect(south.value).toEqual('');
        expect(west.value).toEqual('');
        expect(east.value).toEqual('');
    });
});
