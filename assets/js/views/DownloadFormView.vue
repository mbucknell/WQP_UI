<template>
</template>

<script>
import Vue from 'vue';
import DownloadFormController from '../DownloadFormController.vue';
import BiologicalSamplingInputView from './BiologicalSamplingInputView.vue';
import BoundingBoxInputView from './BoundingBoxInputView.vue';
import DataDetailsView from './DataDetailsView.vue';
import NldiView from './NldiView.vue';
import PlaceInputView from './PlaceInputView.vue';
import PointLocationInputView from './PointLocationInputView.vue';
import PortalViews from './PortalViews.vue';
import SamplingParameterInputView from './SamplingParameterInputView.vue';
import SiteParameterInputView from './SiteParameterInputView.vue';
import CachedCodesModel from '../CachedCodesModel.vue';
import CodesWithKeysModel from '../CodesWithKeysModel.vue';
import queryService from '../queryService';
import {getQueryString} from '../utils';
import store from '../store/store.js';

let downloadFormControllerClass = Vue.extend(DownloadFormController);
let downloadFormController = new downloadFormControllerClass();

let cachedCodesClass = Vue.extend(CachedCodesModel);
let codesWithKeysClass = Vue.extend(CodesWithKeysModel);

let portalViewClass = Vue.extend(PortalViews);
let portalViews = new portalViewClass();

/*
 * Initializes the download form and provides methods to get information from the form
 * @param {Object} options
 *      @prop {NodeList} form - The form which contains all of the query parameters
 *      @prop {DownloadProgressDialog} downloadProgressDialog
 * @return {Object}
 *      @func initialize
 *      @func getQueryParams
 */
export default {
  name: "DownloadFormView",
  props: {
    form: {
      type: HTMLFormElement,
      required: true
    },
    downloadProgressDialog: {
      type: Object,
      required: true
    },
    downloadProgressDialogBasic: {
      type: Object,
      required: true
    },
    providers: {
      type: Object,
      required: true
    },
  },
  data () {
    return {
      selectedForm: document.querySelector('#paramsBasic')
    }
  },
  components: {
      DownloadFormController,
      SamplingParameterInputView,
      NldiView,
      PlaceInputView,
      BiologicalSamplingInputView,
      BoundingBoxInputView,
      SiteParameterInputView,
      PointLocationInputView,
      DataDetailsView,
      CachedCodesModel,
      CodesWithKeysModel,
      PortalViews
  },
  methods: {
    /*
     * @return {PlaceInputView}
     */
    getPlaceInputView() {
        let self = this;
        // Initialize Place inputs
        const getCountryFromState = function(id) {
            return id ? id.split(':')[0] : '';
        };
        const getStateFromCounty = function(id) {
            let ids = id.split(':');
            return ids.length > 1 ? ids[0] + ':' + ids[1] : '';
        };

        const countryModel = new cachedCodesClass({
            propsData: {
                codes : 'countrycode',
            }
        });
        const stateModel = new codesWithKeysClass({
            propsData: {
                codes : 'statecode',
                keyParameter : 'countrycode',
                parseKey : getCountryFromState
            }
        });
        const countyModel = new codesWithKeysClass({
            propsData: {
                codes : 'countycode',
                keyParameter : 'statecode',
                parseKey : getStateFromCounty
            }
        });
        let placeInputViewClass = Vue.extend(PlaceInputView);
            return new placeInputViewClass({
                propsData: {
                    container : document.querySelector('#place'),
                    countryModel : countryModel,
                    stateModel : stateModel,
                    countyModel : countyModel,
                    providers: self.providers
                }
            });
    },

    /*
     * Initializes the form and sets up the DOM event handlers
     * @param updateResultTypeAction - method that gets the resultType value the user entered in the web form.
     * @return promise
     *      @resolve - if all initialization including successful fetches are complete
     *      @reject - if any fetches failed.
     */
     initialize() {
        const placeInputView = this.getPlaceInputView();
        let pointLocationInputClass = Vue.extend(PointLocationInputView);
        const pointLocationInputView = new pointLocationInputClass({
            propsData: {
                container : this.form.querySelector('#point-location')
            }
        });
        let boundingBoxInputClass = Vue.extend(BoundingBoxInputView);
        const boundingBoxInputView = new boundingBoxInputClass({
            propsData: {
                container : this.form.querySelector('#bounding-box')
            }
        });
        let siteParameterInputClass = Vue.extend(SiteParameterInputView);
        const siteParameterInputView = new siteParameterInputClass({
            propsData: {
                container : this.form.querySelector('#site-params'),
                siteTypeModel : new cachedCodesClass({propsData: {codes : 'sitetype'}}),
                organizationModel : new cachedCodesClass({propsData: {codes : 'organization'}}),
                providers: this.providers
            }
        });
        let samplingParametersClass = Vue.extend(SamplingParameterInputView);
        const samplingParametersInputView = new samplingParametersClass({
            propsData: {
                container : this.form.querySelector('#sampling'),
                sampleMediaModel : new cachedCodesClass({propsData: {codes: 'samplemedia'}}),
                characteristicTypeModel : new cachedCodesClass({propsData: {codes: 'characteristictype'}}),
                providers: this.providers
            }
        });
        let biologicalSamplingInputClass = Vue.extend(BiologicalSamplingInputView);
        const biologicalSamplingInputView = new biologicalSamplingInputClass({
            propsData: {
                container : this.form.querySelector('#biological'),
                assemblageModel : new cachedCodesClass({propsData: {codes: 'assemblage'}}),
                providers: this.providers
            }
        });
        let dataDetailsClass = Vue.extend(DataDetailsView);
        this.dataDetailsView = new dataDetailsClass({
            propsData: {
                container : this.form.querySelector('.download-box-input-div'),
                updateResultTypeAction : (resultType) => {
                  const basicForm = document.querySelector('#paramsBasic');
                  const advancedForm = document.querySelector('#params');
                  console.log('ran updateResultTypeAction with resultType ', resultType)
                    // this.form.setAttribute('action', queryService.getFormUrl(resultType));
                    advancedForm.setAttribute('action', queryService.getFormUrl(resultType));
                    basicForm.setAttribute('action', queryService.getFormUrl(resultType));
                }
            }
        });

        // Initialize form sub view
        const initPlaceInputView = placeInputView.initialize();
        const initSiteParameterInputView = siteParameterInputView.initialize();
        const initSamplingParametersInputView = samplingParametersInputView.initialize();
        const initBiologicalSamplingInputInputView = biologicalSamplingInputView.initialize();
        let initComplete = Promise.all([
            initBiologicalSamplingInputInputView,
            initPlaceInputView,
            initSamplingParametersInputView,
            initSiteParameterInputView]);

        this.dataDetailsView.initialize();
        pointLocationInputView.initialize();
        boundingBoxInputView.initialize();

        // Only create map for advanced form
        if (Config.NLDI_ENABLED && this.form.getAttribute('id') == "params") {
            let nldiClass = Vue.extend(NldiView);
            const nldiView = new nldiClass({
                propsData: {
                    mapDivId : 'nldi-map',
                    input: 'nldi-url'
                }
            });
            nldiView.initialize(); 
        } else if (this.form.getAttribute('id') == "params"){
            this.form.querySelector('#nldi-container').style.display = "none";
            this.form.querySelector('#nldi-map').style.display = "none";
        }


        // Initialize the share window and button event handler
        const shareContainer = this.form.querySelector('.share-container');
        const shareText = shareContainer.querySelector('textarea');
        shareText.value = window.location.href;
        
        let self = this;
        document.querySelector('#basic-tab').addEventListener('click', function(){
            let formtype = document.querySelector('#paramsBasic');
            self.updateSelected(formtype);
        });

        document.querySelector('#advanced-tab').addEventListener('click', function(){
            let formtype = document.querySelector('#params');
            self.updateSelected(formtype);
        });

        this.setUpWatchers();

        let basicForm = document.querySelector('#paramsBasic');

        // Set up change event handler for form inputs to update the hash part of the url
        let inputs = this.form.querySelectorAll('input[name], select[name], textarea[name], button[name]').forEach(input => {
            input.onchange = () => {
                const queryParamArray = this.getQueryParamArray(this.form);
                const queryString = getQueryString(queryParamArray, ['zip', 'csrf_token']);
                window.location.hash = `#${queryString}`;
                shareText.value = window.location.href;
            };
        });
        let basicInputs = basicForm.querySelectorAll('input[name], select[name], textarea[name], button[name]').forEach(input => {
            input.onchange = () => {
                const queryParamArray = this.getQueryParamArray(basicForm);
                const queryString = getQueryString(queryParamArray, ['zip', 'csrf_token']);
                window.location.hash = `#${queryString}`;
                shareText.value = window.location.href;
            }
        });

        let dataProviders = this.form.querySelector('#providers-select');
        // Add click handler for clear parameters button
        basicForm.querySelector('.reset-params').onclick = () => {
            document.querySelector('#withinBasic').value = '';
            document.querySelector('#withinBasic').dispatchEvent(new Event('change'));
            document.querySelector('#latBasic').value = '';
            document.querySelector('#latBasic').dispatchEvent(new Event('change'));
            document.querySelector('#longBasic').value = '';
            document.querySelector('#longBasic').dispatchEvent(new Event('change'));
            document.querySelector('#countrycodeBasic').value = null;
            store.commit("getCountryState", []);
            store.commit("getStateState", []);
            store.commit("getCountyState", []);
            store.commit("getSitetypeState", [])
            placeInputView.resetContainer();
            pointLocationInputView.resetContainer();
            siteParameterInputView.resetContainer();
        };

        // Add click handler for clear filters button
        basicForm.querySelector('.reset-filters').onclick = () => {
            document.querySelector('#startDateLoBasic').value = '';
            document.querySelector('#startDateLoBasic').dispatchEvent(new Event('change'));
            document.querySelector('#startDateHiBasic').value = '';
            document.querySelector('#startDateHiBasic').dispatchEvent(new Event('change'));
            let checkboxes = document.querySelector('.datasources-basic').querySelectorAll('input, select, button, textarea');
            checkboxes.forEach(function(checkbox){
                checkbox.checked = true;
            });
            store.commit("getSampleMediaState", []);
            store.commit("getChargroupState", []);
            samplingParametersInputView.resetContainer();
        };

        basicForm.querySelector('#startOver').onclick = () => {
            placeInputView.resetContainer();
            pointLocationInputView.resetContainer();
            boundingBoxInputView.resetContainer();
            samplingParametersInputView.resetContainer();
            siteParameterInputView.resetContainer();
            this.dataDetailsView.resetContainer();
        };

        this.form.querySelector('#advancedStartOver').onclick = () => {
            placeInputView.resetContainer();
            pointLocationInputView.resetContainer();
            boundingBoxInputView.resetContainer();
            samplingParametersInputView.resetContainer();
            siteParameterInputView.resetContainer();
            this.dataDetailsView.resetContainer();
        };

        // // Set up the Download button for basic and advanced forms
        this.setUpDownloadButton(basicForm);
        this.setUpDownloadButton(this.form);

        return initComplete;
    },
    updateSelected(formtype) {
        this.selectedForm = formtype;
    },
    setUpWatchers(){
        const shareContainer = this.form.querySelector('.share-container');
        const shareText = shareContainer.querySelector('textarea');
        let self = this;
        let getQuery = function(){
            const queryParamArray = self.getQueryParamArray(self.selectedForm);
            const queryString = getQueryString(queryParamArray, ['zip', 'csrf_token']);
            window.location.hash = `#${queryString}`;
            shareText.value = window.location.href;
        }

        store.watch(() => store.state.countrySelectedState, () => {
            getQuery();
        });
        store.watch(() => store.state.stateSelectedState, () => {
            getQuery();
        });
        store.watch(() => store.state.countySelectedState, () => {
            getQuery();
        });
        store.watch(() => store.state.sitetypeSelectedState, () => {
            getQuery();
        });
        store.watch(() => store.state.siteIDSelectedState, () => {
            getQuery();
        });
        store.watch(() => store.state.projIDSelectedState, () => {
            getQuery();
        });
        store.watch(() => store.state.orgIDSelectedState, () => {
            getQuery();
        });
        store.watch(() => store.state.chargroupSelectedState, () => {
            getQuery();
        });
        store.watch(() => store.state.sampleMediaSelectedState, () => {
            getQuery();
        });
        store.watch(() => store.state.charSelectedState, () => {
            getQuery();
        });
        store.watch(() => store.state.assemblageSelectedState, () => {
            getQuery();
        });
        store.watch(() => store.state.taxSelectedState, () => {
            getQuery();
        });
    },
    setUpDownloadButton(form) {
        let formType;
        let buttonSelector;
        let downloadProgressDialog;
        if (form.id === "params") {
            formType = "advanced";
            buttonSelector = "#main-button";
            downloadProgressDialog = this.downloadProgressDialog;
        } else {
            formType = "basic";
            buttonSelector = "#basic-main-button";
            downloadProgressDialog = this.downloadProgressDialogBasic;
        }
        // Set up the Download button
        form.querySelector(buttonSelector).onclick = (event) => {
            const fileFormat = this.dataDetailsView.getMimeType();
            const resultType = this.dataDetailsView.getResultType();
            const queryParamArray = this.getQueryParamArray(form);
            const queryString = decodeURIComponent(getQueryString(queryParamArray));
console.log('queryString ', queryString)
            let self = this;
console.log('form ', form)
            const startDownload = (totalCount) => {
                window._gaq.push([
                    '_trackEvent',
                    'Portal Page',
                    self.dataDetailsView.getResultType() + 'Download',
                    queryString,
                    parseInt(totalCount)]);
                form.submit();
            };

            event.preventDefault();
            if (!downloadFormController.validateDownloadForm(form, formType)) {
                console.log("invalid")
                return;
            }

            window._gaq.push([
                '_trackEvent',
                'Portal Page',
                resultType + 'Count',
                queryString
            ]);

            downloadProgressDialog.show('download');
            queryService.fetchQueryCounts(resultType, queryParamArray, this.providers.getIds())
                .then((counts) => {
                    downloadProgressDialog.updateProgress(counts, resultType, fileFormat, startDownload);
                })
                .catch((message) => {
                    downloadProgressDialog.cancelProgress(message);
                });
        };
    },

    /*
     * Validate the form and return true if it is valid, false otherwise
     * @return {Boolean}
     */
    validateDownloadForm() {
        return downloadFormController.validateDownloadForm(this.form);
    },

    /*
     * Return an array of Objects with name, value, and data-multiple attributes representing the current state
     * of the form. Empty
     * values are removed from the array. For selects and checkbox fieldsets that can have multiple values value will be an array, otherwise
     * it will be a string.
     * @return {Array of Objects with name, value, and multiple properties}
     */
    getQueryParamArray(currentForm) {
        let stores = [
            {name: "countrycode", value: store.state.countrySelectedState}, 
            {name: "statecode", value: store.state.stateSelectedState},
            {name: "countycode", value: store.state.countySelectedState},
            {name: "siteType", value: store.state.sitetypeSelectedState},
            {name: "charGroup", value: store.state.chargroupSelectedState},
            {name: "sampleMedia", value: store.state.sampleMediaSelectedState},
            {name: "organization", value: store.state.orgIDSelectedState},
            {name: "project", value: store.state.projIDSelectedState},
            {name: "siteid", value: store.state.siteIDSelectedState},
            {name: "characteristicName", value: store.state.charSelectedState},
            {name: "assemblage", value: store.state.assemblageSelectedState},
            {name: "subjectTaxonomicName", value: store.state.taxSelectedState}
        ];

        // Need to eliminate form parameters within the mapping-div
        const formInputs = currentForm.querySelectorAll('input:not(#mapping-div input, #nldi-map input, input[name="dataProfile"]), textarea:not(#mapping-div textarea, #nldi-map textarea), select:not(#mapping-div select, #nldi-map select), button:not(#mapping-div button, #nldi-map button'); 
        let result = [];
        let providersArray = [];
        var length = formInputs.length;
        formInputs.forEach(function(el, index) {
            let multiselectArray = [];
            if (el.type != 'radio' || el.checked || (el.className === 'datasources usa-checkbox__input') ) {
                if (el.name != 'dataProfile'){
                    const value = el.value;
                    const valueIsNotEmpty = typeof value === 'string' ? value : value.length > 0;
                    const name = el.getAttribute('name');
                    if (valueIsNotEmpty && name && el.className != 'multiselect__input' && el.className != 'hidden-input') {
                        if ((valueIsNotEmpty &&  el.className === 'datasources usa-checkbox__input') && (el.checked === true)) {
                            providersArray.push(value)
                        } else if (el.className !== 'datasources usa-checkbox__input') {
                            result.push({
                                name: name,
                                value: value,
                                multiple: el.dataset.multiple ? true : false
                            });
                        }
                    }
                    if (index === (length - 1)) {
                        result.push({
                            name: 'providers',
                            value: providersArray,
                            multiple: el.dataset.multiple ? true : false
                        })
                    }
                    else if(el.className === 'hidden-input'){
                        stores.forEach(function(state){
                            if (el.name === state.name){
                                state.value.forEach(function(stateValue){
                                    multiselectArray.push(stateValue.id);
                                });
                                
                                if(multiselectArray.length !== 0){
                                    result.push({
                                        name: state.name,
                                        value: multiselectArray,
                                        multiple: el.dataset.multiple ? true : false
                                    })
                                }
                            }
                        });
                    }
                }
            }
        });
        return result;
    },

    // getResultType() {
    //     return this.dataDetailsView.getResultType();
    // }
  },
}
</script>