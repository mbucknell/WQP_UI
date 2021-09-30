import DataDetailsView from '../../../../js/views/DataDetailsView.vue';
import { shallowMount } from '@vue/test-utils';

describe('Tests for DataDetailsView', function() {
    let testView;
    let testDiv;
    let sites, samples, biosamples, sorted, hiddenSorted, narrowsamples, activity, activitymetrics, resultdet;
    let projects, projMonWeight, organizations, biologicalMetric;
    let updateResultTypeAction;

    beforeEach(function() {
        document.body.innerHTML = '<div id="test-div">' +
            '<form>' +
            '<input checked class="result-type" type="radio" id="sites" value="Station" />' +
            '<label class="usa-radio__label" for="sites">Site Data Only</label>' +
            '<input checked class="result-type" type="radio" id="basic-sites" value="Station" />' +
            '<label class="usa-radio__label" for="basic-sites">Site Data Only</label>' +
            '<input class="result-type" type="radio" id="projects" value="Project" />' +
            '<label class="usa-radio__label" for="projects">Project Data</label>' +
            '<input class="result-type" type="radio" id="proj-mon-weight" value="ProjectMonitoringLocationWeighting" />' +
            '<label class="usa-radio__label" for="proj-mon-weight">Project Monitoring Location Weighting Data</label>' +
            '<input class="result-type" type="radio" id="samples" value="Result" />' +
            '<label class="usa-radio__label" for="samples">Sample Results (physical/chemical metadata)</label>' +
            '<input class="result-type" type="radio" id="biosamples" value="Result" />' +
            '<label class="usa-radio__label" for="biosamples">Sample Results (biological metadata)</label>' +
            '<input class="result-type" type="radio" id="narrowsamples" value="Result" />' +
            '<label class="usa-radio__label" for="narrowsamples">Sample Results (narrow)</label>' +
            '<input class="result-type" type="radio" id="activity-input" value="Activity" />' +
            '<label class="usa-radio__label" for="activity-input">Sampling Activity</label>' +
            '<input class="result-type" type="radio" id="activitymetric-input" value="ActivityMetric" />' +
            '<label class="usa-radio__label" for="activitymetric-input">Sampling Activity Metrics</label>' +
            '<input class="result-type" type="radio" id="resultdetection" value="ResultDetectionQuantitationLimit" />' +
            '<label class="usa-radio__label" for="biologicalHabitatMetric">Biological Habitat Metrics</label>' +
            '<input class="result-type" type="radio" id="organization" value="Organization" />' +
            '<label class="usa-radio__label" for="organization-data">Organization Data</label>' +
            '<input class="result-type" type="radio" id="biologicalHabitatMetric" value="BiologicalHabitatMetric" />' +
            '<label class="usa-radio__label" for="biologicalHabitatMetric">Biological Habitat Metrics</label>' +
            '<input type="radio" checked name="mimeType" id="csv" value="csv" />' +
            '<label class="usa-radio__label" for="csv">Comma-Separated</label>' +
            '<input type="radio" checked name="mimeType" id="tsv" value="tsv" />' +
            '<label class="usa-radio__label" for="tsv">Tab-Separated</label>' +
            '<input type="radio" checked name="mimeType" id="xlsx" value="xlsx" />' +
            '<label class="usa-radio__label" for="xlsx">MS Excel 2007+</label>' +
            '<input type="checkbox" id="sorted" />' +
            '<input type="hidden" name="sorted" id="hidden-sorted" value="no" />' +
            '<input type="hidden" name="zip" id="zip" value="yes" />' +
            '<input type="hidden" name="dataProfile" value="biological">' +
            '</form></div>'
        
        testDiv = document.querySelector('#test-div');
        sites = document.querySelector('#sites');
        projects = document.querySelector('#projects');
        projMonWeight = document.querySelector('#proj-mon-weight');
        samples = document.querySelector('#samples');
        biosamples = document.querySelector('#biosamples');
        narrowsamples = document.querySelector('#narrowsamples');
        activity = document.querySelector('#activity-input');
        activitymetrics = document.querySelector('#activitymetric-input');
        resultdet = document.querySelector('#resultdetection');
        organizations = document.querySelector('#organization');
        biologicalMetric = document.querySelector('#biologicalHabitatMetric');

        sorted = document.querySelector('#sorted');
        hiddenSorted = document.querySelector('#hidden-sorted');

        updateResultTypeAction = jasmine.createSpy('updateResultTypeAction');

        testView = shallowMount(DataDetailsView, {
            propsData: {
                container: testDiv,
                updateResultTypeAction: updateResultTypeAction
            }
        });
    });

    afterEach(function() {
        testDiv.remove();
    });

    it('Expects that if the result-type radio button is changed, updateResultTypeAction is executed', function() {
        testView.vm.initialize();
        samples.setAttribute('checked', true);
        samples.dispatchEvent(new Event('change'));
        expect(updateResultTypeAction).toHaveBeenCalledWith('Result');

        projects.setAttribute('checked', true);
        projects.dispatchEvent(new Event('change'));
        expect(updateResultTypeAction.calls.count()).toBe(2);
        expect(updateResultTypeAction.calls.argsFor(1)[0]).toEqual('Project');

        projMonWeight.setAttribute('checked', true);
        projMonWeight.dispatchEvent(new Event('change'));
        expect(updateResultTypeAction.calls.count()).toBe(3);
        expect(updateResultTypeAction.calls.argsFor(2)[0]).toEqual('ProjectMonitoringLocationWeighting');

        biosamples.setAttribute('checked', true);
        biosamples.dispatchEvent(new Event('change'));
        expect(updateResultTypeAction.calls.count()).toBe(4);
        expect(updateResultTypeAction.calls.argsFor(3)[0]).toEqual('Result');

        narrowsamples.setAttribute('checked', true);
        narrowsamples.dispatchEvent(new Event('change'));
        expect(updateResultTypeAction.calls.count()).toBe(5);
        expect(updateResultTypeAction.calls.argsFor(4)[0]).toEqual('Result');

        sites.setAttribute('checked', true);
        sites.dispatchEvent(new Event('change'));
        expect(updateResultTypeAction.calls.count()).toBe(6);
        expect(updateResultTypeAction.calls.argsFor(5)[0]).toEqual('Station');

        activitymetrics.setAttribute('checked', true);
        activitymetrics.dispatchEvent(new Event('change'));
        expect(updateResultTypeAction.calls.count()).toBe(7);
        expect(updateResultTypeAction.calls.argsFor(6)[0]).toEqual('ActivityMetric');

        activity.setAttribute('checked', true);
        activity.dispatchEvent(new Event('change'));
        expect(updateResultTypeAction.calls.count()).toBe(8);
        expect(updateResultTypeAction.calls.argsFor(7)[0]).toEqual('Activity');

        resultdet.setAttribute('checked', true);
        resultdet.dispatchEvent(new Event('change'));
        expect(updateResultTypeAction.calls.count()).toBe(9);
        expect(updateResultTypeAction.calls.argsFor(8)[0]).toEqual('ResultDetectionQuantitationLimit');

        organizations.setAttribute('checked', true);
        organizations.dispatchEvent(new Event('change'));
        expect(updateResultTypeAction.calls.count()).toBe(10);
        expect(updateResultTypeAction.calls.argsFor(9)[0]).toEqual('Organization');

        biologicalMetric.setAttribute('checked', true);
        biologicalMetric.dispatchEvent(new Event('change'));
        expect(updateResultTypeAction.calls.count()).toBe(11);
        expect(updateResultTypeAction.calls.argsFor(10)[0]).toEqual('BiologicalHabitatMetric');
    });

    it('Expects that if the biosamples radio button is checked, a hidden input is added with name dataProfile', function() {
        testView.vm.initialize();
        biosamples.setAttribute('checked', true);
        biosamples.dispatchEvent(new Event('change'));
        expect(testDiv.querySelectorAll('input[type="hidden"][name="dataProfile"]').length).toBe(1);

        sites.setAttribute('checked', true);
        sites.dispatchEvent(new Event('change'));
        expect(testDiv.querySelectorAll('input[type="hidden"][name="dataProfile"]').length).toBe(0);
    });

    it('Expects that if the narrowsamples radio button is checked, a hidden input is added with name dataProfile', function() {
        testView.vm.initialize();
        narrowsamples.setAttribute('checked', true);
        narrowsamples.dispatchEvent(new Event('change'));
        expect(testDiv.querySelectorAll('input[type="hidden"][name="dataProfile"]').length).toBe(1);

        sites.setAttribute('checked', true)
        sites.dispatchEvent(new Event('change'));
        expect(testDiv.querySelectorAll('input[type="hidden"][name="dataProfile"]').length).toBe(0);
    });

    it('Expects that if the activity radio button is checked, a hidden input is added with name dataProfile', function() {
        testView.vm.initialize();
        activity.setAttribute('checked', true);
        activity.dispatchEvent(new Event('change'));
        expect(testDiv.querySelectorAll('input[type="hidden"][name="dataProfile"]').length).toBe(1);

        sites.setAttribute('checked', true);
        sites.dispatchEvent(new Event('change'));
        expect(testDiv.querySelectorAll('input[type="hidden"][name="dataProfile"]').length).toBe(0);
    });

    it('Expects that changing the sort checkbox updates the hidden sorted input', function() {
        testView.vm.initialize();
        sorted.checked = true;
        sorted.dispatchEvent(new Event('change'));
        expect(hiddenSorted.value).toEqual('yes');

        sorted.checked = false;
        sorted.dispatchEvent(new Event('change'));
        expect(hiddenSorted.value).toEqual('no');
    });

    it('If sorted=yes is in the anchor part of the url that the sorted inputs are set correctly', () => {
        window.location.hash = '#sorted=yes';
        testView.vm.initialize();

        expect(sorted.checked).toBe(true);
        expect(hiddenSorted.value).toEqual('yes');

        window.location.hash = '';
    });

    it('If sorted-yes and the hidden input is cleared, the checkbox is unchecked', () => {
        testView.vm.initialize();
        sorted.checked = true;
        hiddenSorted.value = 'yes';
        hiddenSorted.value = '';
        hiddenSorted.dispatchEvent(new Event('change'));

        expect(sorted.checked).toBe(false);
    });

    it('Expects that getResultType returns the currently selected result type', function() {
        testView.vm.initialize();
        samples.checked = true;
        samples.dispatchEvent(new Event('change'));
        expect(testView.vm.getResultType()).toEqual('Result');

        sites.checked = true;
        sites.dispatchEvent(new Event('change'));
        expect(testView.vm.getResultType()).toEqual('Station');
    });

    it('Expects that getMimeType returns the currently selected mime type', function() {
        testView.vm.initialize();
        document.querySelector('#xlsx').checked = true;
        document.querySelector('#xlsx').dispatchEvent(new Event('click'));
        expect(testView.vm.getMimeType()).toEqual('xlsx');

        document.querySelector('#tsv').checked = true;
        document.querySelector('#tsv').dispatchEvent(new Event('click'));
        expect(testView.vm.getMimeType()).toEqual('tsv');
    });

    it('If the anchor part of the url has mimeType that the mimeType is set correctly', () => {
        window.location.hash = '#mimeType=tsv';
        testView.vm.initialize();

        expect(document.querySelector('#tsv').checked)
            .toBe(true);
    });

    it('Expects the resetForm function will return "data details" section of form to on-page-load-state', () => {
        testView.vm.initialize();
        testView.vm.resetContainer();

        expect(document.querySelector('.result-type').disabled).toBe(false);
        expect(document.querySelector('input[type="radio"]').disabled).toBe(false);
        expect(sites.checked).toBe(true);
        expect(document.querySelector('#csv').checked).toBe(true);
        expect(sorted.checked).toBe(false);
        expect(hiddenSorted.value).toEqual('');
        expect(document.querySelectorAll('input[name="dataProfile"]').length).toBe(0);
    });
});
