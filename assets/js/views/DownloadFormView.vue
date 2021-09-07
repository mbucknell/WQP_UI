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
import { StaticSelect2 } from './portalViews';
import SamplingParameterInputView from './SamplingParameterInputView.vue';
import SiteParameterInputView from './SiteParameterInputView.vue';
import { CachedCodes, CodesWithKeys } from '../portalModels';
import providers from '../providers';
import queryService from '../queryService';
import { toggleShowHideSections, getQueryString, getAnchorQueryValues } from '../utils';

let downloadFormControllerClass = Vue.extend(DownloadFormController);
let downloadFormController = new downloadFormControllerClass();

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
  props: ['form', 'downloadProgressDialog', 'downloadProgressDialogBasic'],
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
  },
  methods: {
    /*
     * @return {PlaceInputView}
     */
    getPlaceInputView() {
        // Initialize Place inputs
        const getCountryFromState = function(id) {
            return id ? id.split(':')[0] : '';
        };
        const getStateFromCounty = function(id) {
            let ids = id.split(':');
            return ids.length > 1 ? ids[0] + ':' + ids[1] : '';
        };

        const countryModel = new CachedCodes({
            codes : 'countrycode'
        });
        const stateModel = new CodesWithKeys({
            codes : 'statecode',
            keyParameter : 'countrycode',
            parseKey : getCountryFromState
        });
        const countyModel = new CodesWithKeys({
            codes : 'countycode',
            keyParameter : 'statecode',
            parseKey : getStateFromCounty
        });
        let placeInputViewClass = Vue.extend(PlaceInputView);
            return new placeInputViewClass({
                propsData: {
                    container : document.querySelector('#place'),
                    countryModel : countryModel,
                    stateModel : stateModel,
                    countyModel : countyModel
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
                siteTypeModel : new CachedCodes({codes : 'sitetype'}),
                organizationModel : new CachedCodes({codes : 'organization'})
            }
        });
        let samplingParametersClass = Vue.extend(SamplingParameterInputView);
        const samplingParametersInputView = new samplingParametersClass({
            propsData: {
                container : this.form.querySelector('#sampling'),
                sampleMediaModel : new CachedCodes({codes: 'samplemedia'}),
                characteristicTypeModel : new CachedCodes({codes: 'characteristictype'})
            }
        });
        let biologicalSamplingInputClass = Vue.extend(BiologicalSamplingInputView);
        const biologicalSamplingInputView = new biologicalSamplingInputClass({
            propsData: {
                container : this.form.querySelector('#biological'),
                assemblageModel : new CachedCodes({codes: 'assemblage'})
            }
        });
        let dataDetailsClass = Vue.extend(DataDetailsView);
        this.dataDetailsView = new dataDetailsClass({
            propsData: {
                container : this.form.querySelector('.download-box-input-div'),
                updateResultTypeAction : (resultType) => {
                    this.form.getAttribute('action', queryService.getFormUrl(resultType));
                }
            }
        });

        // fetch the providers and initialize the providers select
        let initializeProviders = providers.fetch()
            .then(() => {
                const providerSelect = this.form.querySelector('#providers-select');
                new StaticSelect2(
                    providerSelect,
                    providers.getIds(),
                    {},
                    getAnchorQueryValues(providerSelect.getAttribute('name')));
            });

        // Initialize form sub view
        const initPlaceInputView = placeInputView.initialize();
        const initSiteParameterInputView = siteParameterInputView.initialize();
        const initSamplingParametersInputView = samplingParametersInputView.initialize();
        const initBiologicalSamplingInputInputView = biologicalSamplingInputView.initialize();
        let initComplete = Promise.all([
            initBiologicalSamplingInputInputView,
            initializeProviders,
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

////////////NOT CURRENTLY USED???///////////////////////////////////////////////////////////////////
        // Add Click handler for form show/hide/button
        // this.form.querySelector('.panel-heading .show-hide-toggle').onclick(function (el) {
        //     toggleShowHideSections(el, el.parents('.panel').querySelector('.panel-body'));
        // });

        // this.form.querySelector('.subpanel-heading .show-hide-toggle').onclick(function (el) {
        //     toggleShowHideSections(el, el.parents('.subpanel').querySelector('.subpanel-body'));
        // });

        // Initialize the share window and button event handler
        const shareContainer = this.form.querySelector('.share-container');
        const shareText = shareContainer.querySelector('textarea');
        shareText.value = window.location.href;
////////////NOT CURRENTLY USED???///////////////////////////////////////////////////////////////////
        // shareContainer.querySelector('button').onclick(() => {
        //     shareText.get(0).select();
        //     document.execCommand('copy');
        // });

        // Set up change event handler for form inputs to update the hash part of the url
        let inputs = this.form.querySelectorAll('input[name], select[name], textarea[name], button[name]').forEach(input => {
            input.onchange = () => {
                const queryParamArray = this.getQueryParamArray();
                const queryString = getQueryString(queryParamArray, ['zip', 'csrf_token']);
                window.location.hash = `#${queryString}`;
                shareText.value = window.location.href;
            };
        });

        let dataProviders = this.form.querySelector('#providers-select');
        let basicForm = document.querySelector('#paramsBasic');
        // Add click handler for clear parameters button
        basicForm.querySelector('.reset-params').onclick = () => {
            document.querySelector('#withinBasic').value = '';
            document.querySelector('#withinBasic').dispatchEvent(new Event('change'));
            document.querySelector('#latBasic').value = '';
            document.querySelector('#latBasic').dispatchEvent(new Event('change'));
            document.querySelector('#longBasic').value = '';
            document.querySelector('#longBasic').dispatchEvent(new Event('change'));
            document.querySelector('#countrycodeBasic').value = null;
            document.querySelector('#countrycodeBasic').dispatchEvent(new Event('change'));
            document.querySelector('#statecodeBasic').value = null;
            document.querySelector('#statecodeBasic').dispatchEvent(new Event('change'));
            document.querySelector('#countycodeBasic').value = null;
            document.querySelector('#countycodeBasic').dispatchEvent(new Event('change'));
            document.querySelector('#siteTypeBasic').value = null;
            document.querySelector('#siteTypeBasic').dispatchEvent(new Event('change'));
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
            let checkboxes = document.querySelector('.datasources-basic').querySelector('input, select, button, textarea');
            checkboxes.each(function(checkbox){
                checkboxes[checkbox].checked = true;
            });
            document.querySelector('#siteCodeBasic').value = null;
            document.querySelector('#siteCodeBasic').dispatchEvent(new Event('change'));
            document.querySelector('#sampleMediaBasic').value = null;
            document.querySelector('#sampleMediaBasic').dispatchEvent(new Event('change'));
            document.querySelector('#charGroupBasic').value = null;
            document.querySelector('#charGroupBasic').dispatchEvent(new Event('change'));
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

        // // Set up the Download button for basic and advanced forms
        this.setUpDownloadButton(basicForm);
        this.setUpDownloadButton(this.form);

        return initComplete;
    },
    setUpDownloadButton(form) {
        let formType;
        let buttonSelector;
        let downloadProgressDialog;
        if (form.id == "params"){
            formType = "advanced";
            buttonSelector = "#main-button";
            downloadProgressDialog = this.downloadProgressDialog;
        }else{
            formType = "basic";
            buttonSelector = "#basic-main-button";
            downloadProgressDialog = this.downloadProgressDialogBasic;
        }
        // Set up the Download button
        form.querySelector(buttonSelector).onclick = (event) => {
            const fileFormat = this.dataDetailsView.getMimeType();
            const resultType = this.dataDetailsView.getResultType();
            const queryParamArray = this.getQueryParamArray();
            const queryString = decodeURIComponent(getQueryString(queryParamArray));

            const startDownload = (totalCount) => {
                window._gaq.push([
                    '_trackEvent',
                    'Portal Page',
                    this.dataDetailsView.getResultType() + 'Download',
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
            queryService.fetchQueryCounts(resultType, queryParamArray, providers.getIds())
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
    getQueryParamArray() {
        // Need to eliminate form parameters within the mapping-div
        const formInputs = this.form.querySelectorAll('input:not(#mapping-div input, #nldi-map input), textarea:not(#mapping-div textarea, #nldi-map textarea), select:not(#mapping-div select, #nldi-map select), button:not(#mapping-div butto, #nldi-map button');

        let result = [];
        let providersArray = [];
        var length = formInputs.length;
        formInputs.forEach(function(el, index) {
            if (el.getAttribute('type') !== 'radio' || el.checked || (el.className === 'datasources usa-checkbox__input')) {
                const value = el.value;
                const valueIsNotEmpty = typeof value === 'string' ? value : value.length > 0;
                const name = el.getAttribute('name');
                if (valueIsNotEmpty && name) {
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
            }
        });
        return result;
    },

    getResultType() {
        return this.dataDetailsView.getResultType();
    }
  }
}
</script>