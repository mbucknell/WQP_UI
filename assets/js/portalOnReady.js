import log from 'loglevel';
import { TOOLTIP } from './tooltipDefinitions';
import ArcGisOnlineHelpView from './views/ArcGisOnlineHelpView.vue';
import DownloadFormView from './views/DownloadFormView.vue';
import ShowAPIView from './views/ShowAPIView.vue';
import SiteMapView from './views/SiteMapView.vue';
import DownloadProgressDialog from './DownloadProgressDialog.vue';
import { initTooltip } from './uswdsComponents/uswdsTooltip';
import Vue from 'vue';
import Providers from './Providers.vue';
import DateValidator from './DateValidator.vue';
import MultiselectCountry from './MultiselectCountry.vue';
import MultiselectState from './MultiselectState.vue';
import MultiselectCounty from './MultiselectCounty.vue';
import MultiselectSitetype from './MultiselectSitetype.vue';
import MultiselectCharGroup from './MultiselectCharGroup.vue';
import MultiselectSampleMedia from './MultiselectSampleMedia.vue';
import MultiselectOrgID from './MultiselectOrgID.vue';
import MultiselectProjID from './MultiselectProjID.vue';
import MultiselectSiteID from './MultiselectSiteID.vue';
import MultiselectChar from './MultiselectChar.vue';
import MultiselectAssemblage from './MultiselectAssemblage.vue';
import MultiselectTax from './MultiselectTax.vue';
import store from "./store/store";

document.addEventListener("DOMContentLoaded", function() {

    // showing Location Parameters first for basic form
    document.querySelector("#basicLocation").style.display = "block";
    document.querySelector("#basicFilterResults").style.display = "none";
    document.querySelector("#basicDownload").style.display = "none";

    const forms = new Vue({
        el: '#forms',
        store: store,
        delimiters: ['[[', ']]'],
        components: {
          "date-validator": DateValidator,
          "download-progress-dialog": DownloadProgressDialog,
          ArcGisOnlineHelpView,
          SiteMapView,
          ShowAPIView,
          "Multiselectcountry": MultiselectCountry,
          "Multiselectstate": MultiselectState,
          "Multiselectcounty": MultiselectCounty,
          "Multiselectsitetype": MultiselectSitetype,
          "Multiselectchargroup": MultiselectCharGroup,
          "Multiselectsamplemedia": MultiselectSampleMedia,
          "Multiselectorg": MultiselectOrgID,
          "Multiselectprojid": MultiselectProjID,
          "Multiselectsiteid": MultiselectSiteID,
          "Multiselectchar": MultiselectChar,
          "Multiselectassemblage": MultiselectAssemblage,
          "Multiselecttax": MultiselectTax,
          Providers
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
            stationTooltip: TOOLTIP.stationTooltip,
            cURLTooltip: TOOLTIP.cURLTooltip,
            WFSTooltip: TOOLTIP.WFSTooltip,
            steps: [
                'Location Parameters',
                'Filter Results',
                'Download',
              ],
            toggleForm: true,
            stepOne: true,
            stepTwo: false,
            stepThree: false,
            providers: [],
            showIntro: false
        },
        mounted: function() {

            // Create tooltips
            this.$nextTick(function() {
              // DOM is now updated
              let elemNodeList = document.querySelectorAll(".tooltip");
              elemNodeList.forEach(elem => {
                elem.className = 'usa-tooltip';
                elem.setAttribute('data-position', 'right');
              })
              initTooltip(elemNodeList)
          });
          
          let self = this;
          let providersClass = Vue.extend(Providers);
          let providerClass = new providersClass();
          providerClass.fetch()
            .then(function(){
              self.providers = providerClass;
              self.initialize()
            })
            .catch(function(){
              self.initialize()
            })

            // show or hide intro
            const localStorageSetting = localStorage.getItem("showIntro");
            if (localStorageSetting !== "false") {
              this.showIntro = true;
            }
        },
        methods: {
            initialize() {
                
                
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
                    formType: 'advanced',
                    providers: this.providers
                  }
                });
                let downloadProgressDialogBasic = new downloadProgressClass({
                  propsData:{
                    el: document.getElementById('download-status-modal-basic'), 
                    formType: 'basic',
                    providers: this.providers
                  }
                });
                let downloadFormClass = Vue.extend(DownloadFormView);
                let downloadFormView = new downloadFormClass({
                  propsData:{
                    form: form, 
                    downloadProgressDialog: downloadProgressDialog,
                    downloadProgressDialogBasic: downloadProgressDialogBasic,
                    providers: this.providers
                  }
                });
                let siteMapClass = Vue.extend(SiteMapView);
                let siteMapView = new siteMapClass({
                    container: document.querySelector('#mapping-div'),
                    downloadProgressDialog: downloadProgressDialog,
                    downloadFormView: downloadFormView,
                    providers: this.providers
                });
                let showAPIClass = Vue.extend(ShowAPIView);
                let showAPIView = new showAPIClass({
                  propsData: {
                    container: document.querySelector('#show-queries-div'),
                    getQueryParamArray: downloadFormView.getQueryParamArray.bind(downloadFormView),
                    getResultType: downloadFormView.getResultType.bind(downloadFormView)
                  }
                });
            /////////////NOT CURRENTLY BEING USED?? #MAPPING-DIV COMMENTED OUT IN INDEX.HTML/////////////////////////
                // let arcGisOnlineHelpClass = Vue.extend(ArcGisOnlineHelpView);
                // let arcGisOnlineHelpView = new arcGisOnlineHelpClass({
                //   propsData:{
                //     button: document.querySelector('#show-arcgis-online-help'),
                //     dialog: document.querySelector('#arcgis-online-modal'),
                //     siteMapViewContainer: document.querySelector('#mapping-div'),
                //     getQueryParamArray: downloadFormView.getQueryParamArray.bind(downloadFormView)
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
            },
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
                store.commit("getCountryState", []);
                store.commit("getStateState", []);
                store.commit("getCountyState", []);
                store.commit("getSitetypeState", []);
                store.commit("getSampleMediaState", []);
                store.commit("getChargroupState", []);
                document.querySelector('#dataSourceBasic').value = null;
                document.querySelector('#dataSourceBasic').dispatchEvent(new Event('change'));
                document.querySelector('#dataProfilesBasic').value = null;
                document.querySelector('#dataProfilesBasic').dispatchEvent(new Event('change'));
                document.querySelector('#csv').checked = true;
                document.querySelector('#csv').dispatchEvent(new Event('change'));
                this.step = 0;
                this.showStepParameters()
              },
              onAdvancedStartOver(){
                document.querySelector('#params').reset();
                store.commit("getCountryState", []);
                store.commit("getStateState", []);
                store.commit("getCountyState", []);
                store.commit("getSitetypeState", []);
                store.commit("getSampleMediaState", []);
                store.commit("getChargroupState", []);
                store.commit("getAssemblageState", []);
                store.commit("getCharState", []);
                store.commit("getOrgIDState", []);
                store.commit("getProjIDState", []);
                store.commit("getTaxState", []);
                store.commit("getSiteIDState", []);
                let within = document.querySelector('#within')
                within.value = null;
                within.dispatchEvent(new Event('change'));
                let lat = document.querySelector('#lat');
                lat.value = null;
                lat.dispatchEvent(new Event('change'));
                let long = document.querySelector('#long')
                long.value = null;
                long.dispatchEvent(new Event('change'));
                let north = document.querySelector('#north');
                north.value = null;
                north.dispatchEvent(new Event('change'));
                let south = document.querySelector('#south');
                south.value = null;
                south.dispatchEvent(new Event('change'));
                let east = document.querySelector('#east');
                east.value = null;
                east.dispatchEvent(new Event('change'));
                let west = document.querySelector('#west');
                west.value = null;
                west.dispatchEvent(new Event('change'));
                let huc = document.querySelector('#huc');
                huc.value = null;
                huc.dispatchEvent(new Event('change'));
                let pCode = document.querySelector('#pCode');
                pCode.value = null;
                pCode.dispatchEvent(new Event('change'));
                let startDateHi = document.querySelector('#startDateHi');
                startDateHi.value = null;
                startDateHi.dispatchEvent(new Event('change'));
                let startDateLo = document.querySelector('#startDateLo');
                startDateLo.value = null;
                startDateLo.dispatchEvent(new Event('change'));
                let minActivities = document.querySelector('#min-activities-div');
                minActivities.value = null;
                minActivities.dispatchEvent(new Event('change'));
                let minResults = document.querySelector('#minresults-div');
                minResults.value = null;
                minResults.dispatchEvent(new Event('change'));
                let dataSource = document.querySelector('#dataSource')
                dataSource.value = null;
                dataSource.dispatchEvent(new Event('change'));
                let downloadDiv = document.querySelector('#download-data-div');
                downloadDiv.value = null;
                downloadDiv.dispatchEvent(new Event('change'));
                document.querySelector('#csvAdv').checked = true;
                document.querySelector('#csvAdv').dispatchEvent(new Event('change'));
                document.querySelector('#dataprofiles').value = null;
                document.querySelector('#dataprofiles').dispatchEvent(new Event('change'));
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
                    document.querySelector('#csvAdv').dispatchEvent(new Event('change'));
                    break;
                  case "tsv":
                    document.querySelector('#tsvAdv').checked = true;
                    document.querySelector('#tsvAdv').dispatchEvent(new Event('change'));
                    break;
                  case "xlsx":
                    document.querySelector('#xlsxAdv').checked = true;
                    document.querySelector('#xlsxAdv').dispatchEvent(new Event('change'));
                    break;
                  }
              },
              syncAtoBForm() {
                
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
                // setting radio is checked in the basic form
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
                    document.querySelector('#csv').dispatchEvent(new Event('change'));
                    break;
                  case "tsvAdv":
                    document.querySelector('#tsv').checked = true;
                    document.querySelector('#csv').dispatchEvent(new Event('change'));
                    break;
                  case "xlsxAdv":
                    document.querySelector('#xlsx').checked = true;
                    document.querySelector('#csv').dispatchEvent(new Event('change'));
                    break;
                  }
              },
              validate() {
                let startDateBasic = document.querySelector('#startDateLoBasic').value;
                let endDateBasic = document.querySelector('#startDateHiBasic').value;

                this.$nextTick(function() {
                  // DOM is now updated
                  let start = this.$refs.datevalidator.format(startDateBasic, true);
                  let end = this.$refs.datevalidator.format(endDateBasic, false);
                  document.querySelector('#startDateLoBasic').value = start;
                  document.querySelector('#startDateLoBasic').dispatchEvent(new Event('change'));;
                  document.querySelector('#startDateHiBasic').value = end;
                  document.querySelector('#startDateHiBasic').dispatchEvent(new Event('change'));
                });
              },
              setLocalStorage($event) {
                if ($event.target.checked) {
                  localStorage.setItem("showIntro", "false");
                } else {
                  localStorage.setItem("showIntro", "true");
                }
              }
        }
    });
});
