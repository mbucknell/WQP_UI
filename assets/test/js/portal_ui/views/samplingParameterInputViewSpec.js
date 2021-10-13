import PortalViews from '../../../../js/views/PortalViews.vue';
import SamplingParameterInputView from '../../../../js/views/SamplingParameterInputView.vue';
import Providers from '../../../../js/Providers.vue';
import { shallowMount } from '@vue/test-utils';

describe('Tests for SamplingParameterInputView', function() {
    let testView;
    let $testDiv;
    let $sampleMedia, $characteristicType, $characteristicName, $projectCode, $minresults, $startDate, $endDate;
    let $pCode;
    let sampleMediaModel, characteristicTypeModel;
    let fetchSampleMediaDeferred, fetchCharacteristicTypeDeferred;
    let portalViews;
    let resolveSampleMediaPromise;
    let rejectSampleMediaPromise;
    let resolveCharPromise;
    let rejectCharPromise;
    let providers;

    beforeEach(function() {
        document.body.innerHTML = '<div id="test-div">' +
            '<select multiple id="sampleMedia"></select>' +
            '<select multiple id="sampleMediaBasic"></select>' +
                '<select multiple id="characteristicType"></select>' +
                '<select multiple id="charGroupBasic"></select>' +
                '<select multiple id="characteristicName"></select>' +
                '<select multiple id="project-code"></select>' +
                '<input type="text" id="pCode" name="pCode" \\>' +
                '<input type="number" id="minresults" name="minresults" \\>' +
                '<input type="number" id="min-activities" name="minactivites" \\>' +
                '<input type="text" id="startDateLo" name="startDateLo" \\>' +
                '<input type="text" id="startDateLoBasic" name="startDateLo" \\>' +
                '<input type="text" id="startDateHi" name="startDateHi" \\>' +
                '<input type="text" id="startDateHiBasic" name="startDateHi" \\>' +
                '</div>'
        
        $testDiv = document.querySelector('#test-div');
        $sampleMedia = document.querySelector('#sampleMedia');
        $characteristicType = document.querySelector('#characteristicType');
        $characteristicName = document.querySelector('#characteristicName');
        $pCode = document.querySelector('#pCode');
        $projectCode  = document.querySelector('#project-code');
        $minresults = document.querySelector('#minresults');
        $startDate = document.querySelector('#startDateLo');
        $endDate = document.querySelector('#startDateHi');

        portalViews = shallowMount(PortalViews);
        providers = shallowMount(Providers);

        spyOn(portalViews.vm, 'codeSelect');

        fetchSampleMediaDeferred = new Promise(function(resolve, reject){
            resolveSampleMediaPromise = resolve;
            rejectSampleMediaPromise = reject;
        });
        fetchCharacteristicTypeDeferred = new Promise(function(resolve, reject){
            resolveCharPromise = resolve;
            rejectCharPromise = reject;
        });

        sampleMediaModel = {
            fetch : jasmine.createSpy('sampleMediaModelFetch').and.returnValue(fetchSampleMediaDeferred),
            getAll : jasmine.createSpy('sampleMediaModelGetAll')
        };
        characteristicTypeModel = {
            fetch : jasmine.createSpy('characteristicTypeModelFetch').and.returnValue(fetchCharacteristicTypeDeferred),
            getAll : jasmine.createSpy('characteristicTypeModelGetAll')
        };

        testView = shallowMount(SamplingParameterInputView, {
            propsData: {
                container : $testDiv,
                sampleMediaModel : sampleMediaModel,
                characteristicTypeModel : characteristicTypeModel,
                providers: providers.vm
            }
        });
    });

    afterEach(function() {
        $testDiv.remove();
    });

    it('Expects that the sampleMedia and characteristicType lookups are fetched during initialize', function() {
        testView.vm.initialize();
        expect(sampleMediaModel.fetch).toHaveBeenCalled();
        expect(characteristicTypeModel.fetch).toHaveBeenCalled();
    });

    it('Expects that the sampleMedia and characteristicType menus are not initialized until the fetch is complete', function() {
        testView.vm.initialize();
        expect(portalViews.vm.codeSelect).not.toHaveBeenCalled();
        resolveSampleMediaPromise();
        expect(portalViews.vm.codeSelect).toHaveBeenCalled();
        expect(portalViews.vm.codeSelect.calls.argsFor(0)[0].id).toEqual($sampleMedia.id);

        resolveCharPromise();
        expect(portalViews.vm.codeSelect.calls.count()).toBe(4);
        expect(portalViews.vm.codeSelect.calls.argsFor(2)[0].id).toEqual($characteristicType.id);
    });

    it('Expects that the pCode, min results, and dates are initialized if in the anchor url', () => {
        window.location.hash = '#pCode=00060&minresults=3&startDateLo=01-01-2001&startDateHi=02-01-2010';
        testView.vm.initialize();

        expect($pCode.value).toEqual('00060');
        expect($minresults.value).toEqual('3');
        expect($startDate.value).toEqual('01-01-2001');
        expect($endDate.value).toEqual('02-01-2010');
    });

    describe('Tests for promise returned from initialize', function() {
        let initializeSuccessSpy, initializeFailSpy;

        beforeEach(function () {
            initializeSuccessSpy = jasmine.createSpy('initializeSuccessSpy');
            initializeFailSpy = jasmine.createSpy('initializeFailSpy');

            testView.vm.initialize().then(initializeSuccessSpy).catch(initializeFailSpy);
        });

        it('Expects that initialize returned promise is not resolved until both the sample media and characteristic type have been successfully fetched', function () {
            expect(initializeSuccessSpy).not.toHaveBeenCalled();
            expect(initializeFailSpy).not.toHaveBeenCalled();

            resolveSampleMediaPromise();
            expect(initializeSuccessSpy).not.toHaveBeenCalled();
            expect(initializeFailSpy).not.toHaveBeenCalled();

            resolveCharPromise();
            expect(initializeSuccessSpy).toHaveBeenCalled();
            expect(initializeFailSpy).not.toHaveBeenCalled();
        });

        it('Expects that initialize returned promise is rejected if sample media is fetched but characteristic types are not successfully fetched', function() {
            resolveSampleMediaPromise();
            rejectCharPromise();
            expect(initializeSuccessSpy).not.toHaveBeenCalled();
            expect(initializeFailSpy).toHaveBeenCalled();
        });

        it('Expects that initialize returned promise is rejected if characteristic type is fetched but sample media are not successfully fetched', function() {
            rejectSampleMediaPromise();
            rejectCharPromise();
            expect(initializeSuccessSpy).not.toHaveBeenCalled();
            expect(initializeFailSpy).toHaveBeenCalled();
        });
    });

    it('Expects that the minresults field only allows positive integers', function() {
        testView.vm.initialize();
        $minresults.value = -12;
        $minresults.dispatchEvent(new Event('change'));
        expect($testDiv.querySelectorAll('.error-message').length).toBe(1);
        $minresults.value = 12;
        $minresults.dispatchEvent(new Event('change'));
        expect($testDiv.querySelectorAll('.error-message').length).toBe(0);
    });

    it('Expects that date fields only allow dates as input, otherwise they are tagged with an error message', function() {
        testView.vm.initialize();
        $startDate.value = 'AAA';
        $startDate.dispatchEvent(new Event('change'));
        expect($testDiv.querySelectorAll('.error-message').length).toBe(1);
        $startDate.value = '01-01-2001';
        $startDate.dispatchEvent(new Event('change'));
        expect($testDiv.querySelectorAll('.error-message').length).toBe(0);

        $endDate.value = 'BBB';
        $endDate.dispatchEvent(new Event('change'));
        expect($testDiv.querySelectorAll('.error-message').length).toBe(1);
        $endDate.value = '01-01-2001';
        $endDate.dispatchEvent(new Event('change'));
        expect($testDiv.querySelectorAll('.error-message').length).toBe(0);
    });

    it('Expects that dates are formatted as MM-DD-YYYY', function() {
        testView.vm.initialize();
        $startDate.value = '2001';
        $startDate.dispatchEvent(new Event('change'));
        expect($startDate.value).toEqual('01-01-2001');

        $startDate.value = '12-2001';
        $startDate.dispatchEvent(new Event('change'));
        expect($startDate.value).toEqual('12-01-2001');

        $endDate.value = '2001';
        $endDate.dispatchEvent(new Event('change'));
        expect($endDate.value).toEqual('12-31-2001');
        $endDate.value = '11-2001';
        $endDate.dispatchEvent(new Event('change'));
        expect($endDate.value).toEqual('11-30-2001');
    });

    it('Expects that the "SAMPLING PARAMETERS" fields will blank after "resetContainer" is run', function() {
        window.location.hash = '#pCode=00060&minresults=3&startDateLo=01-01-2001&startDateHi=02-01-2010';
        testView.vm.initialize();
        expect($pCode.value).toEqual('00060');

        testView.vm.resetContainer();
        expect($pCode.value).toEqual('');
        expect($minresults.value).toEqual('');
        expect($startDate.value).toEqual('');
        expect($endDate.value).toEqual('');
    });
});
