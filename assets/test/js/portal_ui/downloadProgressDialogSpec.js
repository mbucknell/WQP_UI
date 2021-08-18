import DownloadProgressDialog from '../../../js/downloadProgressDialog';
import providers from '../../../js/providers';


describe('Tests for DownloadProgressDialog', function () {
    var thisDialog;
    var continueSpy;

    beforeEach(function () {
        // $('body').append('<div id=progress-dialog class="modal">' +
        //     '<div class="modal-content">' +
        //     '<div class="modal-dialog">' +
        //     '<div class="modal-header"><h4></h4></div>' +
        //     '<div class="modal-body"></div>' +
        //     '<div class="modal-footer"></div>' +
        //     '</div></div></div>');

        $('body').append('<div class="usa-modal" id="progress-dialog">'+
            '<div class="usa-modal__content">'+
                '<h2 class="usa-modal__heading" id="download-modal-heading"></h2>'+
                '<p id="download-modal-description"></p>'+         
                '<ul class="usa-button-group" id="downloadButtons"></ul>'+
            '</div>'+
        '</div>')


        thisDialog = new DownloadProgressDialog($('#progress-dialog'));
        continueSpy = jasmine.createSpy('continueSpy');
    });
    afterEach(function () {
        $('#progress-dialog').remove();
    });

    it('Expects the dialog to be visible with appropriate content and header when show is called', function () {
        thisDialog.show('map');
        expect($('#progress-dialog').is(':visible')).toBe(true);
        expect($('#download-modal-heading').html()).toContain('Map Sites');
        expect(document.getElementById('download-modal-description').innerHTML).toContain('Please wait');
        expect(document.getElementById('downloadButtons').innerHTML).toEqual('');

        thisDialog.show('download');
        expect($('#progress-dialog').is(':visible')).toBe(true);
        expect($('#download-modal-heading').html()).toContain('Download');
        expect(document.getElementById('download-modal-description').innerHTML).toContain('Please wait');
        expect($('#downloadButtons').html()).toEqual('');
    });

    describe('Tests for updateProgress when dialog is for map', function () {
        var counts;
        beforeEach(function () {
            spyOn(providers, 'getIds').and.returnValue(['DS1', 'DS2']);
            thisDialog.show('map');

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
            thisDialog.updateProgress(counts, 'Station', 'xml', continueSpy);

            expect(document.getElementById('download-modal-description').innerHTML).toContain('query is returning more than 250,000 sites');
            expect(document.getElementById('downloadButtons').innerHTML).toEqual('<li class="usa-button-group__item"><button type="button" class="usa-button" id="progressOkBtn" data-close-modal="">Ok</button></li>');
            expect(document.getElementById('closeDownloadModal')).toBe(null);
            expect(document.getElementById('continueButton')).toBe(null)

            let e = new Event('click');
            document.getElementById('progressOkBtn').dispatchEvent(e);
            expect($('#progress-dialog').is(':visible')).toBe(false);
            expect(continueSpy).not.toHaveBeenCalled();
        });

        it('Expects when totalCounts is under limit, that the status message is updated to allow the action', function () {
            counts.total.sites = '249,999';
            thisDialog.updateProgress(counts, 'Station', 'xml', continueSpy);

            expect(document.getElementById('download-modal-description').innerHTML).toContain('map the sites');
            expect(document.getElementById('progressOkBtn')).toBe(null);
            expect(document.getElementById('downloadButtons').innerHTML).toEqual('<li class="usa-button-group__item"><button type="button" class="usa-button" id="closeDownloadModal" data-close-modal="">Cancel</button></li><li class="usa-button-group__item"><button type="button" class="usa-button" id="continueButton" data-close-modal="">Continue</button></li>');

            let e = new Event('click');
            document.getElementById('closeDownloadModal').dispatchEvent(e);
            expect($('#progress-dialog').is(':visible')).toBe(false);
            expect(continueSpy).not.toHaveBeenCalled();

            thisDialog.show('map');
            thisDialog.updateProgress(counts, 'Station', 'xml', continueSpy);

            document.getElementById('continueButton').dispatchEvent(e);
            expect(continueSpy).toHaveBeenCalledWith('249,999');
            expect($('#progress-dialog').is(':visible')).toBe(false);
        });
    });

    describe('Tests for updateProgress when dialog is for download', function () {
        var counts;
        beforeEach(function () {
            spyOn(providers, 'getIds').and.returnValue(['DS1', 'DS2']);
            thisDialog.show('download');

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
            thisDialog.updateProgress(counts, 'Station', 'csv', continueSpy);

            expect(document.getElementById('download-modal-description').innerHTML).toContain('download the data');
            expect(document.getElementById('progressOkBtn')).toBe(null);
            expect(document.getElementById('downloadButtons').innerHTML).toEqual('<li class="usa-button-group__item"><button type="button" class="usa-button" id="closeDownloadModal" data-close-modal="">Cancel</button></li><li class="usa-button-group__item"><button type="button" class="usa-button" id="continueButton" data-close-modal="">Continue</button></li>');

            let e = new Event('click');
            document.getElementById('continueButton').dispatchEvent(e);
            expect($('#progress-dialog').is(':visible')).toBe(false);
            expect(continueSpy).toHaveBeenCalledWith('250,001');

            thisDialog.show('download', continueSpy);
            thisDialog.updateProgress(counts, 'Result', 'tsv', continueSpy);

            expect(document.getElementById('download-modal-description').innerHTML).toContain('download the data');
            expect(document.getElementById('progressOkBtn')).toBe(null);
            expect(document.getElementById('downloadButtons').innerHTML).toEqual('<li class="usa-button-group__item"><button type="button" class="usa-button" id="closeDownloadModal" data-close-modal="">Cancel</button></li><li class="usa-button-group__item"><button type="button" class="usa-button" id="continueButton" data-close-modal="">Continue</button></li>');

            document.getElementById('continueButton').dispatchEvent(e);

            expect($('#progress-dialog').is(':visible')).toBe(false);
            expect(continueSpy).toHaveBeenCalledWith('1,123,456');
        });

        it('Expects when the dialog is for downloads and the fileFormat is xlsx, that the download is allowed if counts are less than or equal to 1,048,575', function () {
            counts.total = {
                sites: '1,048,574',
                results: '2,000,000',
                activities : '0',
                activitymetrics: '0'
            };
            thisDialog.updateProgress(counts, 'Station', 'xlsx', continueSpy);

            expect(document.getElementById('download-modal-description').innerHTML).toContain('download the data');
            expect(document.getElementById('progressOkBtn')).toBe(null);
            expect(document.getElementById('downloadButtons').innerHTML).toEqual('<li class="usa-button-group__item"><button type="button" class="usa-button" id="closeDownloadModal" data-close-modal="">Cancel</button></li><li class="usa-button-group__item"><button type="button" class="usa-button" id="continueButton" data-close-modal="">Continue</button></li>');

            let e = new Event('click');
            document.getElementById('continueButton').dispatchEvent(e);
            expect($('#progress-dialog').is(':visible')).toBe(false);
            expect(continueSpy).toHaveBeenCalledWith('1,048,574');
        });

        it('Expects when the dialog is for downloads and the fileFormat is xlsx, the download is not allowed if counts are greater than 1048575', function () {
            counts.total = {
                sites: '1,048,574',
                results: '2,000,000',
                activities : '0',
                activitymetrics: '0'
            };
            thisDialog.updateProgress(counts, 'Result', 'xlsx', continueSpy);

            expect(document.getElementById('download-modal-description').innerHTML).toContain('more than 1,048,575');
            expect(document.getElementById('downloadButtons').innerHTML).toEqual('<li class="usa-button-group__item"><button type="button" class="usa-button" id="progressOkBtn" data-close-modal="">Ok</button></li>');
            expect(document.getElementById('closeDownloadModal')).toBe(null);
            expect(document.getElementById('continueButton')).toBe(null);

            let e = new Event('click');
            document.getElementById('progressOkBtn').dispatchEvent(e);
            expect($('#progress-dialog').is(':visible')).toBe(false);
            expect(continueSpy).not.toHaveBeenCalled();
        });
    });

    it('Expects a call to cancelProgress to show the message and an ok button', function () {
        thisDialog.show('download');
        thisDialog.cancelProgress('Cancel message');
        expect(document.getElementById('download-modal-description').innerHTML).toContain('Cancel message');
        expect(document.getElementById('downloadButtons').innerHTML).toEqual('<li class="usa-button-group__item"><button type="button" class="usa-button" id="progressOkBtn" data-close-modal="">Ok</button></li>');
        expect(document.getElementById('closeDownloadModal')).toBe(null);
        expect(document.getElementById('continueButton')).toBe(null);

        let e = new Event('click');
        document.getElementById('progressOkBtn').dispatchEvent(e);
        expect($('#progress-dialog').is(':visible')).toBe(false);
    });
});
