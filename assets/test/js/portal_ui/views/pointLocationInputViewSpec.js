import PointLocationInputView from '../../../../js/views/PointLocationInputView.vue';
import { shallowMount } from '@vue/test-utils';

describe('Tests for pointLocationInputView', function() {
    var testView;
    var testDiv, within, lat, lon, withinBasic, latBasic, lonBasic;

    beforeEach(function() {
        document.body.innerHTML = '<div id="test-div">' +
            '<div id="pointLocation">' +
            '<input type="text" id="within" name="within" />' +
            '<input type="text" id="lat" name="lat" />' +
            '<input type="text" id="long" name="long" />' +
            '<input type="text" id="withinBasic" name="within" />' +
            '<input type="text" id="latBasic" name="lat" />' +
            '<input type="text" id="longBasic" name="long" />' +
            '<div id="useMyLocation"></div>' +
            '<div id="useMyLocationBasic"></div>' +
            '</div>' +
            '</div>';
        testDiv = document.querySelector('#test-div');
        within = document.querySelector('#within');
        lat = document.querySelector('#lat');
        lon = document.querySelector('#long');
        withinBasic = document.querySelector('#within');
        latBasic = document.querySelector('#lat');
        lonBasic = document.querySelector('#long');

        testView = shallowMount(PointLocationInputView, {
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

        within.value = 'abc';
        within.dispatchEvent(new Event('change'))
        expect(testDiv.querySelectorAll('.error-message').length).toBe(1);

        within.value = '123';
        within.dispatchEvent(new Event('change'))
        expect(testDiv.querySelectorAll('.error-message').length).toBe(0);

        lat.value = 'abc';
        lat.dispatchEvent(new Event('change'))
        expect(testDiv.querySelectorAll('.error-message').length).toBe(1);

        lat.value = '123';
        lat.dispatchEvent(new Event('change'))
        expect(testDiv.querySelectorAll('.error-message').length).toBe(0);

        lon.value = 'abc';
        lon.dispatchEvent(new Event('change'))
        expect(testDiv.querySelectorAll('.error-message').length).toBe(1);

        lon.value = '123';
        lon.dispatchEvent(new Event('change'))
        expect(testDiv.querySelectorAll('.error-message').length).toBe(0);

        withinBasic.value = 'abc';
        withinBasic.dispatchEvent(new Event('change'))
        expect(testDiv.querySelectorAll('.error-message').length).toBe(1);

        withinBasic.value = '123';
        withinBasic.dispatchEvent(new Event('change'))
        expect(testDiv.querySelectorAll('.error-message').length).toBe(0);

        latBasic.value = 'abc';
        latBasic.dispatchEvent(new Event('change'))
        expect(testDiv.querySelectorAll('.error-message').length).toBe(1);

        latBasic.value = '123';
        latBasic.dispatchEvent(new Event('change'))
        expect(testDiv.querySelectorAll('.error-message').length).toBe(0);

        lonBasic.value = 'abc';
        lonBasic.dispatchEvent(new Event('change'))
        expect(testDiv.querySelectorAll('.error-message').length).toBe(1);

        lonBasic.value = '123';
        lonBasic.dispatchEvent(new Event('change'))
        expect(testDiv.querySelectorAll('.error-message').length).toBe(0);
    });

    it('Expect the text inputs to be initialized', function() {
        window.location.hash = '#within=20&lat=43:04:05&long=-100:10:20';
        testView.vm.initialize();

        expect(within.value).toEqual('20');
        expect(lat.value).toEqual('43:04:05');
        expect(lon.value).toEqual('-100:10:20');
        window.location.hash = '';
    });

    it('Expects that the "Point Location" fields will blank after "resetContainer" is run', function() {
        window.location.hash = '#within=20&lat=43:04:05&long=-100:10:20';
        testView.vm.initialize();
        expect(within.value).toEqual('20');

        testView.vm.resetContainer();
        expect(within.value).toEqual('');
        expect(lat.value).toEqual('');
        expect(lon.value).toEqual('');
        expect(withinBasic.value).toEqual('');
        expect(latBasic.value).toEqual('');
        expect(lonBasic.value).toEqual('');
    });

    // Can't seem to mock the navigator object so can't test the geolocation code.
});
