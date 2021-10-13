import DownloadProgressDialog from '../../../js/DownloadProgressDialog.vue';
import { shallowMount } from '@vue/test-utils';
import Providers from '../../../js/Providers.vue';


describe('Tests for DownloadProgressDialog', function () {
    var continueSpy;
    let wrapper;
    let providers;

    beforeEach(function () {
        let modalDiv = document.createElement('div');
        modalDiv.id = 'download-status-modal';
        document.body.appendChild(modalDiv);
        document.getElementById('download-status-modal').innerHTML = 
            '<div class="usa-modal__content">'+
                '<p class="usa-modal__heading" id="download-modal-heading"></p>'+
                '<p id="download-modal-description"></p>'+         
                '<ul class="usa-button-group" id="downloadButtons"></ul>'+
            '</div>'

        providers = shallowMount(Providers);
        wrapper = shallowMount(DownloadProgressDialog, {
            propsData: {
              el: document.getElementById('download-status-modal'),
              formType: "advanced",
              providers: providers.vm
            }
        });
        continueSpy = jasmine.createSpy('continueSpy');
    });
    afterEach(function () {
        document.getElementById('download-status-modal').remove();
    });

    it('Expects the dialog to be visible with appropriate content and header when show is called', function () {
        wrapper.vm.show('map');
        expect(document.getElementById('download-status-modal').hidden).toBe(false);
        expect(document.getElementById('download-modal-heading').innerHTML).toContain('Map Sites');
        expect(document.getElementById('download-modal-description').innerHTML).toContain('Please wait');
        expect(document.getElementById('downloadButtons').innerHTML).toEqual('');

        wrapper.vm.show('download');
        expect(document.getElementById('download-status-modal').hidden).toBe(false);
        expect(document.getElementById('download-modal-heading').innerHTML).toContain('Download');
        expect(document.getElementById('download-modal-description').innerHTML).toContain('Please wait');
        expect(document.getElementById('downloadButtons').innerHTML).toEqual('');
    });

    describe('Tests for updateProgress when dialog is for map', function () {
        var counts;
        beforeEach(function () {
            spyOn(providers.vm, 'getIds').and.returnValue(['DS1', 'DS2']);
            wrapper.vm.show('map');

            counts = {
                DS1: {
                    results: '24',
                    sites: '10',
                    activities : '0',
                    activitymetrics : '0'
                },
                DS2: {
                    results: '50',
                    sites: '20',
                    activities : '0',
                    activitymetrics : '0'
                },
                total: {
                    results: '100',
                    sites: '50',
                    activities : '0',
                    activitymetrics : '0'
                }
            };
        });

        it('Expects when totalCounts exceed limit that download is canceled', function () {
            counts.total.sites = '250,001';
            wrapper.vm.updateProgress(counts, 'Station', 'xml', continueSpy);

            expect(document.getElementById('download-modal-description').innerHTML).toContain('query is returning more than 250,000 sites');
            expect(document.getElementById('downloadButtons').innerHTML).toEqual('<li class="usa-button-group__item"><button type="button" class="usa-button" id="progressOkBtn" data-close-modal="">Ok</button></li>');
            expect(document.getElementById('closeDownloadModal')).toBe(null);
            expect(document.getElementById('continueButton')).toBe(null)

            let e = new Event('click');
            document.getElementById('progressOkBtn').dispatchEvent(e);
            expect(document.getElementById('download-status-modal').hidden).toBe(true);
            expect(continueSpy).not.toHaveBeenCalled();
        });

        it('Expects when totalCounts is under limit, that the status message is updated to allow the action', function () {
            counts.total.sites = '249,999';
            wrapper.vm.updateProgress(counts, 'Station', 'xml', continueSpy);

            expect(document.getElementById('download-modal-description').innerHTML).toContain('map the sites');
            expect(document.getElementById('progressOkBtn')).toBe(null);
            expect(document.getElementById('downloadButtons').innerHTML).toEqual('<li class="usa-button-group__item"><button type="button" class="usa-button" id="closeDownloadModal" data-close-modal="">Cancel</button></li><li class="usa-button-group__item"><button type="button" class="usa-button" id="continueButton" data-close-modal="">Continue</button></li>');

            let e = new Event('click');
            document.getElementById('closeDownloadModal').dispatchEvent(e);
            expect(document.getElementById('download-status-modal').hidden).toBe(true);
            expect(continueSpy).not.toHaveBeenCalled();

            wrapper.vm.show('map');
            wrapper.vm.updateProgress(counts, 'Station', 'xml', continueSpy);

            document.getElementById('continueButton').dispatchEvent(e);
            expect(continueSpy).toHaveBeenCalledWith('249,999');
            expect(document.getElementById('download-status-modal').hidden).toBe(true);
        });
    });

    describe('Tests for updateProgress when dialog is for download', function () {
        var counts;
        beforeEach(function () {
            spyOn(providers.vm, 'getIds').and.returnValue(['DS1', 'DS2']);
            wrapper.vm.show('download');

            counts = {
                DS1: {
                    results: '24',
                    sites: '10',
                    activities: '0',
                    activitymetrics: '0'
                },
                DS2: {
                    results: '50',
                    sites: '20',
                    activities : '0',
                    activitymetrics: '0'
                },
                total: {
                    results: '100',
                    sites: '50',
                    activities : '0',
                    activitymetrics: '0'
                }
            };
        });

        it('Expects when the dialog is for downloads and the fileFormat is not xlsx, that the download is always allowed', function () {
            counts.total = {
                sites: '250,001',
                results: '1,123,456',
                activities : '0',
                activitymetrics: '0'
            };
            wrapper.vm.updateProgress(counts, 'Station', 'csv', continueSpy);

            expect(document.getElementById('download-modal-description').innerHTML).toContain('download the data');
            expect(document.getElementById('progressOkBtn')).toBe(null);
            expect(document.getElementById('downloadButtons').innerHTML).toEqual('<li class="usa-button-group__item"><button type="button" class="usa-button" id="closeDownloadModal" data-close-modal="">Cancel</button></li><li class="usa-button-group__item"><button type="button" class="usa-button" id="continueButton" data-close-modal="">Continue</button></li>');

            let e = new Event('click');
            document.getElementById('continueButton').dispatchEvent(e);
            expect(document.getElementById('download-status-modal').hidden).toBe(true);
            expect(continueSpy).toHaveBeenCalledWith('250,001');

            wrapper.vm.show('download', continueSpy);
            wrapper.vm.updateProgress(counts, 'Result', 'tsv', continueSpy);

            expect(document.getElementById('download-modal-description').innerHTML).toContain('download the data');
            expect(document.getElementById('progressOkBtn')).toBe(null);
            expect(document.getElementById('downloadButtons').innerHTML).toEqual('<li class="usa-button-group__item"><button type="button" class="usa-button" id="closeDownloadModal" data-close-modal="">Cancel</button></li><li class="usa-button-group__item"><button type="button" class="usa-button" id="continueButton" data-close-modal="">Continue</button></li>');

            document.getElementById('continueButton').dispatchEvent(e);

            expect(document.getElementById('download-status-modal').hidden).toBe(true);
            expect(continueSpy).toHaveBeenCalledWith('1,123,456');
        });

        it('Expects when the dialog is for downloads and the fileFormat is xlsx, that the download is allowed if counts are less than or equal to 1,048,575', function () {
            counts.total = {
                sites: '1,048,574',
                results: '2,000,000',
                activities : '0',
                activitymetrics: '0'
            };
            wrapper.vm.updateProgress(counts, 'Station', 'xlsx', continueSpy);

            expect(document.getElementById('download-modal-description').innerHTML).toContain('download the data');
            expect(document.getElementById('progressOkBtn')).toBe(null);
            expect(document.getElementById('downloadButtons').innerHTML).toEqual('<li class="usa-button-group__item"><button type="button" class="usa-button" id="closeDownloadModal" data-close-modal="">Cancel</button></li><li class="usa-button-group__item"><button type="button" class="usa-button" id="continueButton" data-close-modal="">Continue</button></li>');

            let e = new Event('click');
            document.getElementById('continueButton').dispatchEvent(e);
            expect(document.getElementById('download-status-modal').hidden).toBe(true);
            expect(continueSpy).toHaveBeenCalledWith('1,048,574');
        });

        it('Expects when the dialog is for downloads and the fileFormat is xlsx, the download is not allowed if counts are greater than 1048575', function () {
            counts.total = {
                sites: '1,048,574',
                results: '2,000,000',
                activities : '0',
                activitymetrics: '0'
            };
            wrapper.vm.updateProgress(counts, 'Result', 'xlsx', continueSpy);

            expect(document.getElementById('download-modal-description').innerHTML).toContain('more than 1,048,575');
            expect(document.getElementById('downloadButtons').innerHTML).toEqual('<li class="usa-button-group__item"><button type="button" class="usa-button" id="progressOkBtn" data-close-modal="">Ok</button></li>');
            expect(document.getElementById('closeDownloadModal')).toBe(null);
            expect(document.getElementById('continueButton')).toBe(null);

            let e = new Event('click');
            document.getElementById('progressOkBtn').dispatchEvent(e);
            expect(document.getElementById('download-status-modal').hidden).toBe(true);
            expect(continueSpy).not.toHaveBeenCalled();
        });
    });

    it('Expects a call to cancelProgress to show the message and an ok button', function () {
        wrapper.vm.show('download');
        wrapper.vm.cancelProgress('Cancel message');
        expect(document.getElementById('download-modal-description').innerHTML).toContain('Cancel message');
        expect(document.getElementById('downloadButtons').innerHTML).toEqual('<li class="usa-button-group__item"><button type="button" class="usa-button" id="progressOkBtn" data-close-modal="">Ok</button></li>');
        expect(document.getElementById('closeDownloadModal')).toBe(null);
        expect(document.getElementById('continueButton')).toBe(null);

        let e = new Event('click');
        document.getElementById('progressOkBtn').dispatchEvent(e);
        expect(document.getElementById('download-status-modal').hidden).toBe(true);
    });
});
