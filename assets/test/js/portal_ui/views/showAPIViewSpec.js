import ShowAPIView from '../../../../js/views/ShowAPIView.vue';
import { shallowMount } from '@vue/test-utils';

describe('Tests for ShowAPIViewSpec', function() {
    let testDiv;
    let testForm;

    beforeEach(function() {
        document.body.innerHTML = '<form><div id="test-div">' +
                '<div id="api-queries-div">' +
                '<div id="query-div"><b></b><textarea></textarea></div>' +
                '<div id="curl-query-div"><textarea></textarea></div>' +
                '<div id="getfeature-query-div"><textarea></textarea></div>' +
                '</div>' +
                '<input id="advanced-tab"></input>' +
                '<input class="advancedLink"></input>' +
                '</div></form>'

        testDiv = document.querySelector('#test-div');
        testForm = document.querySelector('form');
    });

    afterEach(function() {
        testDiv.remove();
    });

    it('expect that changing the form fills in the text areas appropriately.', function() {
        let testView;
        let mockGetQueryParamArray;
        let mockGetResultType;

        mockGetQueryParamArray = jasmine.createSpy('mockGetQueryParamArray').and.returnValue([
            {name : 'Testparam1', value : 'value1'},
            {name : 'Testparam2', value : 'value2'},
            {name : 'zip', value : 'fakeZipValue'},
            {name : 'mimeType', value : 'fakeMimeType'}
        ]);

        mockGetResultType = jasmine.createSpy('mockGetResultType').and.returnValue('Station');

        testView = shallowMount(ShowAPIView, {
            propsData: {
                container : testDiv,
                getQueryParamArray : mockGetQueryParamArray,
                getResultType: mockGetResultType
            }
        });

        testView.vm.initialize();
        testForm.dispatchEvent(new Event('change'));
        expect(document.querySelector('#query-div textarea').innerHTML).toContain('Station?Testparam1=value1&amp;Testparam2=value2');
        expect(document.querySelector('#curl-query-div textarea').innerHTML).toContain('{"Testparam1":"value1","Testparam2":"value2"}');
        expect(document.querySelector('#getfeature-query-div textarea').innerHTML).toContain('SEARCHPARAMS=' + encodeURIComponent('Testparam1:value1;Testparam2:value2'));
    });

    it('expect that changing the form will show dataProfile parameter when appropriate.', function() {
        let testView;
        let mockGetQueryParamArray;
        let mockGetResultType;

        mockGetQueryParamArray = jasmine.createSpy('mockGetQueryParamArray').and.returnValue([
            {name: 'dataProfile', value: 'narrow'},
            {name : 'Testparam1', value : 'value1'},
            {name : 'Testparam2', value : 'value2'},
            {name : 'zip', value : 'fakeZipValue'},
            {name : 'mimeType', value : 'fakeMimeType'}
        ]);

        mockGetResultType = jasmine.createSpy('mockGetResultType').and.returnValue('Result');

        testView = shallowMount(ShowAPIView, {
            propsData: {
                container : testDiv,
                getQueryParamArray : mockGetQueryParamArray,
                getResultType: mockGetResultType
            }
        });

        testView.vm.initialize();
        testForm.dispatchEvent(new Event('change'));

        expect(document.querySelector('#query-div textarea').innerHTML).toContain('Result?dataProfile=narrow&amp;Testparam1=value1&amp;Testparam2=value2');
        expect(document.querySelector('#curl-query-div textarea').innerHTML).toContain('Result?mimeType=fakeMimeType&amp;zip=fakeZipValue');
        expect(document.querySelector('#curl-query-div textarea').innerHTML).toContain('{"dataProfile":"narrow","Testparam1":"value1","Testparam2":"value2"}');
        expect(document.querySelector('#getfeature-query-div textarea').innerHTML).toContain('SEARCHPARAMS=' + encodeURIComponent('Testparam1:value1;Testparam2:value2'));
    });

    it('expect that changing the form will not show the csrf_token parameter in any service call.', function() {
        let testView;
        let mockGetQueryParamArray;
        let mockGetResultType;

        mockGetQueryParamArray = jasmine.createSpy('mockGetQueryParamArray').and.returnValue([
            {name: 'dataProfile', value: 'narrow'},
            {name : 'Testparam1', value : 'value1'},
            {name : 'Testparam2', value : 'value2'},
            {name : 'zip', value : 'fakeZipValue'},
            {name : 'mimeType', value : 'fakeMimeType'},
            {name : 'csrf_token', value : 'fakeCSRFToken'}
        ]);

        mockGetResultType = jasmine.createSpy('mockGetResultType').and.returnValue('Result');

        testView = shallowMount(ShowAPIView, {
            propsData: {
                container : testDiv,
                getQueryParamArray : mockGetQueryParamArray,
                getResultType: mockGetResultType
            }
        });

        testView.vm.initialize();
        testForm.dispatchEvent(new Event('change'));

        expect(document.querySelector('#query-div textarea').innerHTML).not.toContain('csrf_token=fakeCSRFToken');
        expect(document.querySelector('#curl-query-div textarea').innerHTML).not.toContain('csrf_token=fakeCSRFToken');
        expect(document.querySelector('#getfeature-query-div textarea').innerHTML).not.toContain('csrf_token=fakeCSRFToken');
    });
});

