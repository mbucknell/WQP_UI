import DownloadFormController from '../../../js/DownloadFormController.vue';
import { shallowMount } from '@vue/test-utils';


describe('Tests for validatePointLocation', function () {
    var fields;
    let wrapper;

    beforeEach(function () {
        wrapper = shallowMount(DownloadFormController);

        var pointLocationHtml = '<div id="test-div">' +
            '<input id="within-input" value="" />' +
            '<input id="lat-input" value="" />' +
            '<input id="lon-input" value="" />' +
            '</div>';
        document.body.innerHTML = pointLocationHtml;

        fields = {
            withinEl: document.querySelector('#within-input'),
            latEl: document.querySelector('#lat-input'),
            lonEl: document.querySelector('#lon-input')
        };
    });

    afterEach(function () {
        document.querySelector('#test-div').remove();
    });

    it('Expects all blank inputs to be valid', function () {
        expect(wrapper.vm.validatePointLocation(fields)).toEqual({isValid: true});
    });

    it('Expects all filled in inputs to be valid', function () {
        fields.withinEl.value = '2';
        fields.latEl.value = '12.0';
        fields.lonEl.value = '16.0';
        expect(wrapper.vm.validatePointLocation(fields)).toEqual({isValid: true});
    });

    it('Expects if one or two fields are blank that it is invalid', function () {
        var result;

        fields.withinEl.value = '2';
        fields.latEl.value = '12.0';
        result = wrapper.vm.validatePointLocation(fields);
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toBeDefined();

        fields.latEl.value = '';
        result = wrapper.vm.validatePointLocation(fields);
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toBeDefined();

        fields.withinEl.value = '';
        fields.latEl.value = '12.0';
        result = wrapper.vm.validatePointLocation(fields);
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toBeDefined();

        fields.lonEl.value = '16.0';
        result = wrapper.vm.validatePointLocation(fields);
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toBeDefined();

        fields.withinEl.value = '2.0';
        fields.latEl.value = '';
        result = wrapper.vm.validatePointLocation(fields);
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toBeDefined();
    });
});

describe('Tests for validateBoundingBox', function () {
    var fields;
    let wrapper;

    beforeEach(function () {
        wrapper = shallowMount(DownloadFormController);
        var inputHtml = '<div id="test-div">' +
            '<input id="north-input" value=""/>' +
            '<input id="south-input" value=""/>' +
            '<input id="east-input" value=""/>' +
            '<input id="west-input" value=""/>' +
            '</div>';
        document.body.innerHTML = inputHtml;

        fields = {
            northEl: $('#north-input'),
            southEl: $('#south-input'),
            eastEl: $('#east-input'),
            westEl: $('#west-input')
        };
    });

    afterEach(function () {
        document.querySelector('#test-div').remove();
    });

    it('Expects all blank fields to be valid', function () {
        expect(wrapper.vm.validateBoundingBox(fields).isValid).toBe(true);
    });

    it('Expects all filled in fields to be valid if north is greater than south and east is greater than west', function () {
        fields.northEl.value = '15.0';
        fields.southEl.value = '14.0';
        fields.eastEl.value = '-13.0';
        fields.westEl.value = '-14.0';
        expect(wrapper.vm.validateBoundingBox(fields).isValid).toBe(true);
    });

    it('Expects the result to be invalid if north is less than south', function () {
        var result;
        fields.northEl.value = '13.0';
        fields.southEl.value = '14.0';
        fields.eastEl.value = '-13.0';
        fields.westEl.value = '-14.0';
        result = wrapper.vm.validateBoundingBox(fields);
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toBeDefined();
    });

    it('Expects the result to be invalid if east is less than west', function () {
        var result;
        fields.northEl.value = '15.0';
        fields.southEl.value = '14.0';
        fields.eastEl.value = '-13.0';
        fields.westEl.value = '-12.0';
        result = wrapper.vm.validateBoundingBox(fields);
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toBeDefined();
    });

    it('Expects the results to be invalid if some fields are blank and others have values', function () {
        var result;
        fields.northEl.value = '15.0';
        fields.southEl.value = '14.0';
        fields.eastEl.value = '-13.0';
        result = wrapper.vm.validateBoundingBox(fields);
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toBeDefined();

        fields.eastEl.value = '';
        fields.westEl.value = '-14.0';
        result = wrapper.vm.validateBoundingBox(fields);
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toBeDefined();

        fields.southEl.value = '';
        fields.eastEl.value = '-13.0';
        result = wrapper.vm.validateBoundingBox(fields);
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toBeDefined();

        fields.northEl.value = '';
        fields.southEl.value = '14.0';
        result = wrapper.vm.validateBoundingBox(fields);
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toBeDefined();
    });

});

describe('Tests for validateDateRange', function () {
    var fields;
    let wrapper;

    beforeEach(function () {
        wrapper = shallowMount(DownloadFormController);
        var inputHtml = '<div id="test-div">' +
            '<input id="from-input" value="" />' +
            '<input id="to-input" value="" />' +
            '</div>';
        document.body.innerHTML = inputHtml;

        fields = {
            fromDateEl: document.querySelector('#from-input'),
            toDateEl: document.querySelector('#to-input')
        };
    });

    afterEach(function () {
        document.querySelector('#test-div').remove();
    });

    it('Expects a valid result if both fields are blank', function () {
        expect(wrapper.vm.validateDateRange(fields).isValid).toBe(true);
    });

    it('Expects a valid result if only one field is blank', function () {
        fields.toDateEl.value = '01-01-2000';
        expect(wrapper.vm.validateDateRange(fields).isValid).toBe(true);

        fields.toDateEl.value = '';
        fields.fromDateEl.value = '01-01-2000';
        expect(wrapper.vm.validateDateRange(fields).isValid).toBe(true);
    });

    it('Expects a from date less than a to date to be valid', function () {
        fields.fromDateEl.value = '01-01-2000';
        fields.toDateEl.value = '01-01-2001';
        expect(wrapper.vm.validateDateRange(fields).isValid).toBe(true);
    });

    it('Expects a from date greater than a to date to be invalid', function () {
        fields.fromDateEl.value = '01-01-2000';
        fields.toDateEl.value = '12-31-1999';
        var result = wrapper.vm.validateDateRange(fields);
        expect(result.isValid).toBe(false);
        expect(result.errorMessage).toBeDefined();
    });

});
