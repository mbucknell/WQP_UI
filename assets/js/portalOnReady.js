import log from 'loglevel';
import { TOOLTIP } from './tooltipDefinitions';
import ArcGisOnlineHelpView from './views/ArcGisOnlineHelpView.vue';
import DownloadFormView from './views/DownloadFormView.vue';
import ShowAPIView from './views/ShowAPIView.vue';
import SiteMapView from './views/SiteMapView.vue';
import DownloadProgressDialog from './DownloadProgressDialog.vue';
import { initTooltip } from './uswdsComponents/uswdsTooltip';
import Vue from 'vue';
import DateValidator from './DateValidator.vue';

$(document).ready(function () {

    // initializeing multiselects 
    $('#datasourceBasic').select2();
    $('#dataTypeBasic').select2();
    $('#fileFormatBasic').select2();

    ////// These might be old, there is no element with these class names in any other files/////////
    // $('.index-box-primary').click(function () {
    //   window.location = $(this).find('a').attr('href');
    //   return false;
    // });
    // $('.index-box-secondary').click(function () {
    //   window.location = $(this).find('a').attr('href');
    // });
    // $('.index-box-secondary .interior-list').click(function () {
    //   window.location = $(this).find('a').attr('href');
    // });

    // showing Location Parameters first for basic form
    document.querySelector("#basicLocation").style.display = "block";
    document.querySelector("#basicFilterResults").style.display = "none";
    document.querySelector("#basicDownload").style.display = "none";

    const forms = new Vue({
        el: '#forms',
        delimiters: ['[[', ']]'],
        components: {
          "date-validator": DateValidator,
          "download-progress-dialog": DownloadProgressDialog,
          ArcGisOnlineHelpView,
          SiteMapView,
          ShowAPIView,
        },
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

              //Identifying all tooltips
              let elem = $(".tooltip")
              for (const el of elem) {
                  initTooltip(elem);
              }
              // let elem = document.querySelectorAll(".tooltip");
              // elem.forEach(el => {
              //   initTooltip(el)
              // })
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
                document.querySelector('#paramsBasic').reset();
                document.querySelector('#countrycodeBasic').value = null;
                document.querySelector('#countrycodeBasic').dispatchEvent(new Event('change'));
                document.querySelector('#statecodeBasic').value = null;
                document.querySelector('#statecodeBasic').dispatchEvent(new Event('change'));
                document.querySelector('#countycodeBasic').value = null;
                document.querySelector('#countycodeBasic').dispatchEvent(new Event('change'));
                document.querySelector('#siteTypeBasic').value = null;
                document.querySelector('#siteTypeBasic').dispatchEvent(new Event('change'));
                document.querySelector('#dataSourceBasic').value = null;
                document.querySelector('#dataSourceBasic').dispatchEvent(new Event('change'));
                document.querySelector('#dataProfilesBasic').value = null;
                document.querySelector('#dataProfilesBasic').dispatchEvent(new Event('change'));
                document.querySelector('#formatBasic').value = null;
                document.querySelector('#formatBasic').dispatchEvent(new Event('change'));
                document.querySelector('#sampleMediaBasic').value = null;
                document.querySelector('#sampleMediaBasic').dispatchEvent(new Event('change'));
                document.querySelector('#charGroupBasic').value = null;
                document.querySelector('#charGroupBasic').dispatchEvent(new Event('change'));
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
                document.querySelector('#formIntro').style.display = "none";
              },
              syncBtoAForm() {
                // country
                var basicCountry = document.querySelector('#countrycodeBasic').value;
                var countrycode = document.querySelector('#countrycode')
                countrycode.value = basicCountry;
                countrycode.dispatchEvent(new Event('change'));

                // state
                var basicState = document.querySelector('#statecodeBasic').value;
                var statecode = document.querySelector('#statecode');
                statecode.value = basicState;
                statecode.dispatchEvent(new Event('change'));

                // site type
                var basicSiteType = document.querySelector('#siteTypeBasic').value;
                var siteType = document.querySelector('#siteType');
                siteType.value = basicSiteType;
                siteType.dispatchEvent(new Event('change'));
                
                // within
                var basicWithin = document.querySelector('#withinBasic').value;
                var within = document.querySelector('#within');
                within.value = basicWithin;
                within.dispatchEvent(new Event('change'));

                // lat/long
                var latitudeBasic = document.querySelector('#latBasic').value;
                var lat = document.querySelector('#lat');
                lat.value = latitudeBasic;
                lat.dispatchEvent(new Event('change'));
                var longBasic = document.querySelector('#longBasic').value;
                var long = document.querySelector('#long');
                long.value = longBasic;
                long.dispatchEvent(new Event('change'));

                // dates
                var startBasic = document.querySelector('#startDateLoBasic').value;
                var startDateLo = document.querySelector('#startDateLo');
                startDateLo.value = startBasic;
                startDateLo.dispatchEvent(new Event('change'));
                var endBasic = document.querySelector('#startDateHiBasic').value;
                var startDateHi = document.querySelector('#startDateHi');
                startDateHi.value = endBasic;
                startDateHi.dispatchEvent(new Event('change'));
                
                // sample media
                var sampleBasic = document.querySelector('#sampleMediaBasic').value;
                var sampleMedia = document.querySelector('#sampleMedia');
                sampleMedia.value = sampleBasic;
                sampleMedia.dispatchEvent(new Event('change'));

                // characteristic group
                var charBasic = document.querySelector('#charGroupBasic').value;
                var charType = document.querySelector('#characteristicType');
                charType.value = charBasic;
                charType.dispatchEvent(new Event('change'));

                // datasources
                var nwisBasic = document.querySelector('#nwis-basic').checked;
                var nwis = document.querySelector('#nwis');
                nwis.checked = nwisBasic;
                nwis.dispatchEvent(new Event('change'));
                var stewardsBasic = document.querySelector('#stewards-basic').checked;
                var stewards = document.querySelector('#stewards');
                stewards.checked = stewardsBasic;
                stewards.dispatchEvent(new Event('change'));
                var storetBasic = document.querySelector('#storet-basic').checked;
                var storet = document.querySelector('#storet');
                storet.checked = storetBasic;
                storet.dispatchEvent(new Event('change'));

                // county
                var basicCounty = document.querySelector('#countycodeBasic').value;
                var countycode = document.querySelector('#countycode');
                countycode.value = basicCounty[0];
                countycode.dispatchEvent(new Event('change'));

                // sort
                var sortedBasic = document.querySelector('#sortDataBasic').checked;
                var sorted = document.querySelector('#sorted')
                sorted.checked = sortedBasic;

                // data profiles
                let selectedRadio;
                // seeing radio is checked in the basic form
                let radiobuttonsBasic = document.querySelector('#dataProfilesBasic');
                let radiobuttonsInput = radiobuttonsBasic.querySelectorAll('input');
                for (const button in radiobuttonsInput) {
                  if (radiobuttonsInput[button].checked === true) {
                    selectedRadio = radiobuttonsInput[button].id;
                    break;
                  }
                }

                // Setting checked radio in advanced form to false so there are not two selected
                let radiobuttonsAdvanced = document.querySelector('#dataprofiles')
                let radiobuttonsAdvancedInput = radiobuttonsAdvanced.querySelectorAll('input');
                for (const button in radiobuttonsAdvancedInput) {
                  if (radiobuttonsAdvancedInput[button].checked === true) {
                    radiobuttonsAdvancedInput[button].checked = false;
                    break;
                  }
                }

                switch (selectedRadio) {
                  case "basic-organization":
                    document.querySelector('#organization').checked = true;
                    break;
                  case "basic-sites":
                    document.querySelector('#sites').checked = true;
                    break;
                  case "basic-projects":
                    document.querySelector('#projects').checked = true;
                    break;
                  case "basic-samples":
                    document.querySelector('#samples').checked = true;
                    break;
                  case "basic-biosamples":
                    document.querySelector('#biosamples').checked = true;
                    break;
                  case "basic-narrowsamples":
                    document.querySelector('#narrowsamples').checked = true;
                    break;
                  case "basic-activity-input":
                    document.querySelector('#activity-input').checked = true;
                    break;
                  }

                // File Formats
                let selectedFormatRadio;
                // seeing radio is checked in the basic form
                const formatbuttonsBasic = document.querySelector('#fileBasic');
                let formatbuttonsBasicInput = formatbuttonsBasic.querySelectorAll('input');
                for (const button in formatbuttonsBasicInput) {
                  if (formatbuttonsBasicInput[button].checked === true) {
                    selectedFormatRadio = formatbuttonsBasicInput[button].id;
                    break;
                  }
                }

                // Setting checked radio in advanced form to false so there are not two selected
                const formatbuttonsAdvanced = document.querySelector('#fileFormat')
                let formatbuttonsAdvancedInput = formatbuttonsAdvanced.querySelectorAll('input');
                for (const button in formatbuttonsAdvancedInput) {
                  if (formatbuttonsAdvancedInput[button].checked === true) {
                    formatbuttonsAdvancedInput[button].checked = false;
                    break;
                  }
                }

                switch (selectedFormatRadio) {
                  case "csv":
                    document.querySelector('#csvAdv').checked = true;
                    break;
                  case "tsv":
                    document.querySelector('#tsvAdv').checked = true;
                    break;
                  case "xlsx":
                    document.querySelector('#xlsxAdv').checked = true;
                    break;
                  }
              },
              syncAtoBForm() {
                // country
                var basicCountry = document.querySelector('#countrycode').value;
                var countycodeBasic = document.querySelector('#countrycodeBasic');
                countrycodeBasic.value = basicCountry;
                countrycodeBasic.dispatchEvent(new Event('change'));

                // state
                var basicState = document.querySelector('#statecode').value;
                var statecodeBasic = document.querySelector('#statecodeBasic');
                statecodeBasic.value = basicState;
                statecodeBasic.dispatchEvent(new Event('change'));

                // site type
                var basicSiteType = document.querySelector('#siteType').value;
                var siteTypeBasic = document.querySelector('#siteTypeBasic');
                siteTypeBasic.value = basicSiteType;
                siteTypeBasic.dispatchEvent(new Event('change'));
                
                // within
                var basicWithin = document.querySelector('#within').value;
                var withinBasic = document.querySelector('#withinBasic');
                withinBasic.value = basicWithin;
                withinBasic.dispatchEvent(new Event('change'));

                // lat/long
                var latitudeBasic = document.querySelector('#lat').value;
                var latBasic = document.querySelector('#latBasic');
                latBasic.value = latitudeBasic;
                latBasic.dispatchEvent(new Event('change'));
                var longBasic = document.querySelector('#long').value;
                var long = document.querySelector('#longBasic');
                long.value = longBasic;
                long.dispatchEvent(new Event('change'));

                // dates
                var startBasic = document.querySelector('#startDateLo').value;
                var startDateLoBasic = document.querySelector('#startDateLoBasic');
                startDateLoBasic.value = startBasic;
                startDateLoBasic.dispatchEvent(new Event('change'));
                var endBasic = document.querySelector('#startDateHi').value;
                var startDateHiBasic = document.querySelector('#startDateHiBasic');
                startDateHiBasic.value = endBasic;
                startDateHiBasic.dispatchEvent(new Event('change'));
                
                // sample media
                var sampleBasic = document.querySelector('#sampleMedia').value;
                var sampleMediaBasic = document.querySelector('#sampleMediaBasic');
                sampleMediaBasic.value = sampleBasic;
                sampleMediaBasic.dispatchEvent(new Event('change'));

                // characteristic group
                var charBasic = document.querySelector('#characteristicType').value;
                var charGroupBasic = document.querySelector('#charGroupBasic');
                charGroupBasic.value = charBasic;
                charGroupBasic.dispatchEvent(new Event('change'));

                // datasources
                var nwisBasic = document.querySelector('#nwis').checked;
                var nwis = document.querySelector('#nwis-basic');
                nwis.checked = nwisBasic;
                nwis.dispatchEvent(new Event('change'));

                var stewardsBasic = document.querySelector('#stewards').checked;
                var stewards = document.querySelector('#stewards-basic');
                stewards.checked = stewardsBasic;
                stewards.dispatchEvent(new Event('change'));

                var storetBasic = document.querySelector('#storet').checked;
                var storet = document.querySelector('#storet-basic');
                storet.checked = storetBasic;
                storet.dispatchEvent(new Event('change'));
                // sort
                var sortedBasic = document.querySelector('#sorted').checked;
                var sortDataBasic = document.querySelector('#sortDataBasic');
                sortDataBasic.checked = sortedBasic;

                // county
                var basicCounty = document.querySelector('#countycode').value;
                var countycodeBasic = document.querySelector('#countycodeBasic');
                countycodeBasic.value = basicCounty;
                countycodeBasic.dispatchEvent(new Event('change'));

                // data profiles
                let selectedRadio;
                // seeing radio is checked in the basic form
                const radiobuttonsBasic = document.querySelector('#dataProfilesBasic');
                let radiobuttonsBasicInput = radiobuttonsBasic.querySelectorAll('input');
                for (const button in radiobuttonsBasicInput) {
                  if (radiobuttonsBasicInput[button].checked === true) {
                    radiobuttonsBasicInput[button].checked = false;
                    break;
                  }
                }

                // Setting checked radio in advanced form to false so there are not two selected
                const radiobuttonsAdvanced = document.querySelector('#dataprofiles');
                let radiobuttonsAdvancedInput = radiobuttonsAdvanced.querySelectorAll('input');
                for (const button in radiobuttonsAdvancedInput) {
                  if (radiobuttonsAdvancedInput[button].checked === true) {
                    selectedRadio = radiobuttonsAdvancedInput[button].id    
                    break;
                  }
                }

                switch (selectedRadio) {
                  case "organization-data":
                    document.querySelector('#basic-organization').checked = true;
                    break;
                  case "sites":
                    document.querySelector('#basic-sites').checked = true;
                    break;
                  case "projects":
                    document.querySelector('#basic-projects').checked = true;
                    break;
                  case "samples":
                    document.querySelector('#basic-samples').checked = true;
                    break;
                  case "biosamples":
                    document.querySelector('#basic-biosamples').checked = true;
                    break;
                  case "narrowsamples":
                    document.querySelector('#basic-narrowsamples').checked = true;
                    break;
                  case "activity-input":
                    document.querySelector('#basic-activity-input').checked = true;
                    break;
                  default:
                    break;
                  }

                // File Formats
                let selectedFormatRadio;
                // seeing radio is checked in the basic form
                const formatbuttonsBasic = document.querySelector('#fileBasic');
                let formatbuttonsBasicInput = formatbuttonsBasic.querySelectorAll('input');
                for (const button in formatbuttonsBasicInput) {
                  if (formatbuttonsBasicInput[button].checked === true) {
                    formatbuttonsBasicInput[button].checked = false;
                    break;
                  }
                }

                // Setting checked radio in advanced form to false so there are not two selected
                const formatbuttonsAdvanced = document.querySelector('#fileFormat');
                let formatbuttonsAdvancedInput = formatbuttonsAdvanced.querySelectorAll('input');
                for (const button in formatbuttonsAdvancedInput) {
                  if (formatbuttonsAdvancedInput[button].checked === true) {
                    selectedFormatRadio = formatbuttonsAdvancedInput[button].id;
                    
                    break;
                  }
                }

                switch (selectedFormatRadio) {
                  case "csvAdv":
                    document.querySelector('#csv').checked = true;
                    break;
                  case "tsvAdv":
                    document.querySelector('#tsv').checked = true;
                    break;
                  case "xlsxAdv":
                    document.querySelector('#xlsx').checked = true;
                    break;
                  }
              },
              validate() {
                let $startDateBasic = document.querySelector('#startDateLoBasic').value;
                let $endDateBasic = document.querySelector('#startDateHiBasic').value;

                this.$nextTick(function() {
                  // DOM is now updated
                  let start = this.$refs.datevalidator.format($startDateBasic, true);
                  let end = this.$refs.datevalidator.format($endDateBasic, false);
                  document.querySelector('#startDateLoBasic').value = start;
                  document.querySelector('#startDateLoBasic').dispatchEvent(new Event('change'));;
                  document.querySelector('#startDateHiBasic').value = end;
                  document.querySelector('#startDateHiBasic').dispatchEvent(new Event('change'));
                });
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

    let form = document.querySelector('#params');
    let basicform = document.querySelector('#paramsBasic');

    // Create sub views
    let downloadProgressClass = Vue.extend(DownloadProgressDialog);
    let downloadProgressDialog = new downloadProgressClass({
      propsData:{
        el: document.getElementById('download-status-modal'), 
        formType: 'advanced'
      }
    });
    let downloadProgressDialogBasic = new downloadProgressClass({
      propsData:{
        el: document.getElementById('download-status-modal-basic'), 
        formType: 'basic'
      }
    });
    let downloadFormClass = Vue.extend(DownloadFormView);
    let downloadFormView = new downloadFormClass({
      propsData:{
        form: form, 
        downloadProgressDialog: downloadProgressDialog
      }
    });
    let siteMapClass = Vue.extend(SiteMapView);
    let siteMapView = new siteMapClass({
        container: document.querySelector('#mapping-div'),
        downloadProgressDialog: downloadProgressDialog,
        downloadFormView: downloadFormView
    });
    let showAPIClass = Vue.extend(ShowAPIView);
    let showAPIView = new showAPIClass({
        propsData: {
          container: document.querySelector('#show-queries-div'),
          getQueryParamArray: $.proxy(downloadFormView.getQueryParamArray, downloadFormView),
          getResultType: $.proxy(downloadFormView.getResultType, downloadFormView)
        }
    });
/////////////NOT CURRENTLY BEING USED?? #MAPPING-DIV COMMENTED OUT IN INDEX.HTML/////////////////////////
    // let arcGisOnlineHelpClass = Vue.extend(ArcGisOnlineHelpView);
    // let arcGisOnlineHelpView = new arcGisOnlineHelpClass({
    //   propsData:{
    //     button: document.querySelector('#show-arcgis-online-help'),
    //     dialog: document.querySelector('#arcgis-online-modal'),
    //     siteMapViewContainer: document.querySelector('#mapping-div'),
    //     getQueryParamArray: $.proxy(downloadFormView.getQueryParamArray, downloadFormView)
    //   }
    // });

    //Initialize subviews
    let initDownloadForm = downloadFormView.initialize();
    // siteMapView.initialize();
    showAPIView.initialize();
    // arcGisOnlineHelpView.initialize();

    // TODO wqp-1723
    initDownloadForm.catch(function (jqxhr) {
        let $dialog = document.querySelector('#service-error-dialog');
        if (jqxhr.status === 401 || jqxhr.status === 403) {
            $dialog.querySelector('.modal-body').innerHTML = 'No longer authorized to use the application. Please reload the page to login again';
        }
        $dialog.modal.style.display = "block";
    });
});
