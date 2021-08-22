import log from 'loglevel';
import { TOOLTIP } from './tooltipDefinitions';
import ArcGisOnlineHelpView from './views/arcGisOnlineHelpView';
import DownloadFormView from './views/downloadFormView';
import ShowAPIView from './views/showAPIView';
import SiteMapView from './views/siteMapView';
import DownloadProgressDialog from './downloadProgressDialog';
import { initTooltip } from './uswdsComponents/uswdsTooltip';
import * as dateValidator from './dateValidator';
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
              onStartOver(){
                $('#paramsBasic')[0].reset();
                $('#countrycodeBasic').val(null).trigger('change');
                $('#statecodeBasic').val(null).trigger('change');
                $('#countycodeBasic').val(null).trigger('change');
                $('#siteTypeBasic').val(null).trigger('change');
                $('#datasourceBasic').val(null).trigger('change');
                $('#dataTypeBasic').val(null).trigger('change');
                $('#fileFormatBasic').val(null).trigger('change');
                $('#siteCodeBasic').val(null).trigger('change');
                $('#sampleMediaBasic').val(null).trigger('change');
                $('#charGroupBasic').val(null).trigger('change');
                this.step = 0;
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
              closeIntro() {
                $('#formIntro').hide();
              },
              syncBtoAForm() {
                // country
                var basicCountry = $('#countrycodeBasic').val();
                $('#countrycode').val(basicCountry).trigger('change');

                // state
                var basicState = $('#statecodeBasic').val();
                $('#statecode').val(basicState).trigger('change');

                // site type
                var basicSiteType = $('#siteTypeBasic').val();
                $('#siteType').val(basicSiteType).trigger('change');
                
                // within
                var basicWithin = $('#withinBasic').val();
                $('#within').val(basicWithin).trigger('change');

                // lat/long
                var latitudeBasic = $('#latBasic').val();
                $('#lat').val(latitudeBasic).trigger('change');
                var longBasic = $('#longBasic').val();
                $('#long').val(longBasic).trigger('change');

                // dates
                var startBasic = $('#startDateLoBasic').val();
                $('#startDateLo').val(startBasic).trigger('change');
                var endBasic = $('#startDateHiBasic').val();
                $('#startDateHi').val(endBasic).trigger('change');
                
                // sample media
                var sampleBasic = $('#sampleMediaBasic').val();
                $('#sampleMedia').val(sampleBasic).trigger('change');

                // characteristic group
                var charBasic = $('#charGroupBasic').val();
                $('#characteristicType').val(charBasic).trigger('change');

                // datasources
                var nwisBasic = $('#nwis-basic')[0].checked;
                $('#nwis')[0].checked = nwisBasic;
                $('#nwis').trigger('change');
                var stewardsBasic = $('#stewards-basic')[0].checked;
                $('#stewards')[0].checked = stewardsBasic;
                $('#stewards').trigger('change');
                var storetBasic = $('#storet-basic')[0].checked;
                $('#storet')[0].checked = storetBasic;
                $('#storet').trigger('change');

                // county
                var basicCounty = $('#countycodeBasic').val();
                $('#countycode').val(basicCounty[0]).trigger('change');

                // sort
                var sortedBasic = $('#sortDataBasic')[0].checked;
                $('#sorted')[0].checked = sortedBasic;

                // data profiles
                let selectedRadio;
                // seeing radio is checked in the basic form
                let radiobuttonsBasic = $('#dataProfilesBasic').find(':input');
                for (const button in radiobuttonsBasic) {
                  if (radiobuttonsBasic[button].checked === true) {
                    selectedRadio = radiobuttonsBasic[button].id;
                    break;
                  }
                }

                // Setting checked radio in advanced form to false so there are not two selected
                let radiobuttonsAdvanced = $('#dataprofiles').find(':input');
                for (const button in radiobuttonsAdvanced) {
                  if (radiobuttonsAdvanced[button].checked === true) {
                    radiobuttonsAdvanced[button].checked = false;
                    break;
                  }
                }

                switch (selectedRadio) {
                  case "basic-organization":
                    $('#organization')[0].checked = true;
                    break;
                  case "basic-sites":
                    $('#sites')[0].checked = true;
                    break;
                  case "basic-projects":
                    $('#projects')[0].checked = true;
                    break;
                  case "basic-samples":
                    $('#samples')[0].checked = true;
                    break;
                  case "basic-biosamples":
                    $('#biosamples')[0].checked = true;
                    break;
                  case "basic-narrowsamples":
                    $('#narrowsamples')[0].checked = true;
                    break;
                  case "basic-activity-input":
                    $('#activity-input')[0].checked = true;
                    break;
                  }

                // File Formats
                let selectedFormatRadio;
                // seeing radio is checked in the basic form
                const formatbuttonsBasic = $('#fileBasic').find(':input');
                for (const button in formatbuttonsBasic) {
                  if (formatbuttonsBasic[button].checked === true) {
                    selectedFormatRadio = formatbuttonsBasic[button].id;
                    break;
                  }
                }

                // Setting checked radio in advanced form to false so there are not two selected
                const formatbuttonsAdvanced = $('#fileFormat').find(':input');
                for (const button in formatbuttonsAdvanced) {
                  if (formatbuttonsAdvanced[button].checked === true) {
                    formatbuttonsAdvanced[button].checked = false;
                    break;
                  }
                }

                switch (selectedFormatRadio) {
                  case "csv":
                    $('#csvAdv')[0].checked = true;
                    break;
                  case "tsv":
                    $('#tsvAdv')[0].checked = true;
                    break;
                  case "xlsx":
                    $('#xlsxAdv')[0].checked = true;
                    break;
                  }
              },
              syncAtoBForm() {
                // country
                var basicCountry = $('#countrycode').val();
                $('#countrycodeBasic').val(basicCountry).trigger('change');

                // state
                var basicState = $('#statecode').val();
                $('#statecodeBasic').val(basicState).trigger('change');

                // site type
                var basicSiteType = $('#siteType').val();
                $('#siteTypeBasic').val(basicSiteType).trigger('change');
                
                // within
                var basicWithin = $('#within').val();
                $('#withinBasic').val(basicWithin).trigger('change');

                // lat/long
                var latitudeBasic = $('#lat').val();
                $('#latBasic').val(latitudeBasic).trigger('change');
                var longBasic = $('#long').val();
                $('#longBasic').val(longBasic).trigger('change');

                // dates
                var startBasic = $('#startDateLo').val();
                $('#startDateLoBasic').val(startBasic).trigger('change');
                var endBasic = $('#startDateHi').val();
                $('#startDateHiBasic').val(endBasic).trigger('change');
                
                // sample media
                var sampleBasic = $('#sampleMedia').val();
                $('#sampleMediaBasic').val(sampleBasic).trigger('change');

                // characteristic group
                var charBasic = $('#characteristicType').val();
                $('#charGroupBasic').val(charBasic).trigger('change');

                // datasources
                var nwisBasic = $('#nwis')[0].checked;
                $('#nwis-basic')[0].checked = nwisBasic;
                $('#nwis').trigger('change');

                var stewardsBasic = $('#stewards')[0].checked;
                $('#stewards-basic')[0].checked = stewardsBasic;
                $('#stewards').trigger('change');

                var storetBasic = $('#storet')[0].checked;
                $('#storet-basic')[0].checked = storetBasic;
                $('#storet').trigger('change');
                // sort
                var sortedBasic = $('#sorted')[0].checked;
                $('#sortDataBasic')[0].checked = sortedBasic;

                // county
                var basicCounty = $('#countycode').val();
                $('#countycodeBasic').val(basicCounty[0]).trigger('change');

                // data profiles
                let selectedRadio;
                // seeing radio is checked in the basic form
                const radiobuttonsBasic = $('#dataProfilesBasic').find(':input');
                for (const button in radiobuttonsBasic) {
                  if (radiobuttonsBasic[button].checked === true) {
                    radiobuttonsBasic[button].checked = false;
                    break;
                  }
                }

                // Setting checked radio in advanced form to false so there are not two selected
                const radiobuttonsAdvanced = $('#dataprofiles').find(':input');
                for (const button in radiobuttonsAdvanced) {
                  if (radiobuttonsAdvanced[button].checked === true) {
                    selectedRadio = radiobuttonsAdvanced[button].id    
                    break;
                  }
                }

                switch (selectedRadio) {
                  case "organization-data":
                    $('#basic-organization')[0].checked = true;
                    break;
                  case "sites":
                    $('#basic-sites')[0].checked = true;
                    break;
                  case "projects":
                    $('#basic-projects')[0].checked = true;
                    break;
                  case "samples":
                    $('#basic-samples')[0].checked = true;
                    break;
                  case "biosamples":
                    $('#basic-biosamples')[0].checked = true;
                    break;
                  case "narrowsamples":
                    $('#basic-narrowsamples')[0].checked = true;
                    break;
                  case "activity-input":
                    $('#basic-activity-input')[0].checked = true;
                    break;
                  default:
                    break;
                  }

                // File Formats
                let selectedFormatRadio;
                // seeing radio is checked in the basic form
                const formatbuttonsBasic = $('#fileBasic').find(':input');
                for (const button in formatbuttonsBasic) {
                  if (formatbuttonsBasic[button].checked === true) {
                    formatbuttonsBasic[button].checked = false;
                    break;
                  }
                }

                // Setting checked radio in advanced form to false so there are not two selected
                const formatbuttonsAdvanced = $('#fileFormat').find(':input');
                for (const button in formatbuttonsAdvanced) {
                  if (formatbuttonsAdvanced[button].checked === true) {
                    selectedFormatRadio = formatbuttonsAdvanced[button].id;
                    
                    break;
                  }
                }

                switch (selectedFormatRadio) {
                  case "csvAdv":
                    $('#csv')[0].checked = true;
                    break;
                  case "tsvAdv":
                    $('#tsv')[0].checked = true;
                    break;
                  case "xlsxAdv":
                    $('#xlsx')[0].checked = true;
                    break;
                  }
              },
              validate() {
                let $startDateBasic =  $('#startDateLoBasic').val();
                let $endDateBasic = $('#startDateHiBasic').val();

                let start = dateValidator.format($startDateBasic, true)
                let end = dateValidator.format($endDateBasic, false)

                $('#startDateLoBasic').val(start).trigger('change');
                $('#startDateHiBasic').val(end).trigger('change');
              }
        }
    });


    // Handler for closing site announcement
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
    let $basicform = $('#paramsBasic');

    // Create sub views
    let downloadProgressDialog = new DownloadProgressDialog($('#download-status-modal'), 'advanced');
    let downloadProgressDialogBasic = new DownloadProgressDialog($('#download-status-modal-basic'), 'basic');
    let downloadFormView = new DownloadFormView({
        $form: $form,
        downloadProgressDialog: downloadProgressDialog
    });
    let downloadBasicFormView = new DownloadFormView({
        $form: $basicform,
        downloadProgressDialog: downloadProgressDialogBasic
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
    let initDownloadFormBasic = downloadBasicFormView.initialize();
    // siteMapView.initialize();
    showAPIView.initialize();
    arcGisOnlineHelpView.initialize();

    // TODO wqp-1723
    initDownloadForm.fail(function (jqxhr) {
        let $dialog = $('#service-error-dialog');
        if (jqxhr.status === 401 || jqxhr.status === 403) {
            $dialog.find('.modal-body').html('No longer authorized to use the application. Please reload the page to login again');
        }
        $dialog.modal('show');
    });
    initDownloadFormBasic.fail(function (jqxhr) {
        let $dialog = $('#service-error-dialog');
        if (jqxhr.status === 401 || jqxhr.status === 403) {
            $dialog.find('.modal-body').html('No longer authorized to use the application. Please reload the page to login again');
        }
        $dialog.modal('show');
    });
});
