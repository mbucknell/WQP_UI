import log from 'loglevel';
import { TOOLTIP } from './tooltipDefinitions';
import ArcGisOnlineHelpView from './views/arcGisOnlineHelpView';
import DownloadFormView from './views/downloadFormView';
import ShowAPIView from './views/showAPIView';
import SiteMapView from './views/siteMapView';
import DownloadProgressDialog from './downloadProgressDialog';
import { initTooltip } from './uswdsComponents/uswdsTooltip';
import Vue from 'vue';

$(document).ready(function () {

    // initializeing multiselects 
    $('#datasourceBasic').select2();
    $('#dataTypeBasic').select2();
    $('#fileFormatBasic').select2();

    $('.index-box-primary').click(function () {
      window.location = $(this).find('a').attr('href');
      return false;
    });
    $('.index-box-secondary').click(function () {
      window.location = $(this).find('a').attr('href');
    });
    $('.index-box-secondary .interior-list').click(function () {
      window.location = $(this).find('a').attr('href');
    });

    // showing Location Parameters first for basic form
    $("#basicLocation").show();
    $("#basicFilterResults").hide();
    $("#basicDownload").hide();
    
    const forms = new Vue({
        el: '#forms',
        delimiters: ['[[', ']]'],
        props: {
            // Show step labels
            showLabels: {
              type: Boolean,
              default: false
            },
            // Center counters and labels in each step
            centerLabels: {
              type: Boolean,
              default: false
            },
            // Show step counters
            showStepNumbers: {
              type: Boolean,
              default: false
            },
            // Show small step counters
            size: {
              type: String,
              default: 'sm'
            },
            step: {
              type: Number,
              default: 0
            },
            variant: {
              type: String,
              default: 'info'
            }
          },
          computed: {
            currentTitle() {
              if (this.steps && this.steps[this.step]) {
                if (this.steps[this.step].title) {
                  return this.steps[this.step].title;
                }
                else {
                  return this.steps[this.step];
                }
              }
              return '';
            }
          },
        data: {
            countryTooltip: TOOLTIP.countryTooltip,
            stateTooltip: TOOLTIP.stateTooltip,
            countyTooltip: TOOLTIP.countyTooltip,
            pointLocationTooltip: TOOLTIP.pointLocationTooltip,
            boundingBoxTooltip: TOOLTIP.boundingBoxTooltip,
            siteTypeTooltip: TOOLTIP.siteTypeTooltip,
            orgIDTooltip: TOOLTIP.orgIDTooltip,
            siteIDTooltip: TOOLTIP.siteIDTooltip,
            hucTooltip: TOOLTIP.hucTooltip,
            minSamplingTooltip: TOOLTIP.minSamplingTooltip,
            upDownStreamTooltip: TOOLTIP.upDownStreamTooltip,
            sampleMediaTooltip: TOOLTIP.sampleMediaTooltip,
            charGroupTooltip: TOOLTIP.charGroupTooltip,
            characteristicsTooltip: TOOLTIP.characteristicsTooltip,
            projectIDTooltip: TOOLTIP.projectIDTooltip,
            paramCodeTooltip: TOOLTIP.paramCodeTooltip,
            minimumResultsTooltip: TOOLTIP.minimumResultsTooltip,
            bioSamplingTooltip: TOOLTIP.bioSamplingTooltip,
            assemblageTooltip: TOOLTIP.assemblageTooltip,
            taxNameTooltip: TOOLTIP.taxNameTooltip,
            showAGOLTooltip: TOOLTIP.showAGOLTooltip,
            sortDataTooltip: TOOLTIP.sortDataTooltip,
            dateRangeTooltip: TOOLTIP.dateRangeTooltip,
            databasesTooltip: TOOLTIP.databasesTooltip,
            dataDownloadTooltip: TOOLTIP.dataDownloadTooltip,
            fileFormatTooltip: TOOLTIP.fileFormatTooltip,
            steps: [
                'Location Parameters',
                'Filter Results',
                'Download',
              ],
            latBasic: '',
            lonBasic: '',
            toggleForm: true,
            stepOne: true,
            stepTwo: false,
            stepThree: false,
        },
        mounted: function() {

            // Create tooltips
            this.$nextTick(function() {
              // DOM is now updated

              // Identifying all tooltips
              let elem = $(".tooltip")
              for (const el of elem) {
                  initTooltip(elem);
              }
          });
        },
        methods: {
            onClickTitle() {
                this.$emit('selectTitle', this.currentTitle);
              },
              onNext() {
                if (this.step < this.steps.length - 1) {
                  this.step += 1;
                } else {
                  this.step = 0;
                }
                this.showStepParameters()
              },
              onPrev() {
                if (this.step > 0) {
                  this.step -= 1;
                } else {
                  this.step = this.steps.length - 1;
                }
                this.showStepParameters()
              },
              showStepParameters() {
                if (this.step === 0) {
                  this.stepOne = true;
                  this.stepTwo = false;
                  this.stepThree = false;
                } else if (this.step === 1) {
                  this.stepOne = false;
                  this.stepTwo = true;
                  this.stepThree = false;
                } else if (this.step === 2) {
                  this.stepOne = false;
                  this.stepTwo = false;
                  this.stepThree = true;
                }
              },
              getlocation() {
                if (window.navigator.geolocation && window.navigator.geolocation.getCurrentPosition) {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition();
                  }
                }
              },
              closeIntro() {
                $('#formIntro').hide();
              }
        }
    });

    const announcement = document.getElementById("siteAnnouncement")
    const announcementcloseButton = document.getElementById("close-announcement")

    announcementcloseButton.onclick = function() { announcement.remove() };

    // Set the loglevel
    if (Config.DEBUG) {
        log.setLevel('debug', false);
    } else {
        log.setLevel('warn', false);
    }

    let $form = $('#params');

    // Create sub views
    let downloadProgressDialog = new DownloadProgressDialog($('#download-status-modal'));
    let downloadFormView = new DownloadFormView({
        $form: $form,
        downloadProgressDialog: downloadProgressDialog
    });
    let siteMapView = new SiteMapView({
        $container: $('#mapping-div'),
        downloadProgressDialog: downloadProgressDialog,
        downloadFormView: downloadFormView
    });
    let showAPIView = new ShowAPIView({
        $container: $('#show-queries-div'),
        getQueryParamArray: $.proxy(downloadFormView.getQueryParamArray, downloadFormView),
        getResultType: $.proxy(downloadFormView.getResultType, downloadFormView)
    });

    let arcGisOnlineHelpView = new ArcGisOnlineHelpView({
        $button: $('#show-arcgis-online-help'),
        $dialog: $('#arcgis-online-modal'),
        $siteMapViewContainer: $('#mapping-div'),
        getQueryParamArray: $.proxy(downloadFormView.getQueryParamArray, downloadFormView)
    });

    //Initialize subviews
    let initDownloadForm = downloadFormView.initialize();
    // siteMapView.initialize();
    showAPIView.initialize();
    arcGisOnlineHelpView.initialize();

    initDownloadForm.fail(function (jqxhr) {
        let $dialog = $('#service-error-dialog');
        if (jqxhr.status === 401 || jqxhr.status === 403) {
            $dialog.find('.modal-body').html('No longer authorized to use the application. Please reload the page to login again');
        }
        $dialog.modal('show');
    });
});
