
<script>
import Vue from 'vue';
import DownloadFormController from '../DownloadFormController.vue';
import BiologicalSamplingInputView from './BiologicalSamplingInputView.vue';
import BoundingBoxInputView from './BoundingBoxInputView.vue';
import DataDetailsView from './DataDetailsView.vue';
import NldiView from './NldiView.vue';
import PlaceInputView from './PlaceInputView.vue';
import PointLocationInputView from './PointLocationInputView.vue';
import SamplingParameterInputView from './SamplingParameterInputView.vue';
import SiteParameterInputView from './SiteParameterInputView.vue';
import CachedCodesModel from '../CachedCodesModel.vue';
import CodesWithKeysModel from '../CodesWithKeysModel.vue';
import queryService from '../queryService';
import {getQueryString, getQueryParamArray} from '../utils';
import store from '../store/store.js';

let downloadFormControllerClass = Vue.extend(DownloadFormController);
let downloadFormController = new downloadFormControllerClass();

let cachedCodesClass = Vue.extend(CachedCodesModel);
let codesWithKeysClass = Vue.extend(CodesWithKeysModel);

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
  name: 'DownloadFormView',
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
    }
  },
  data() {
    return {
      selectedForm: document.querySelector('#params-basic')
    };
  },
  methods: {
    /*
     * @return {PlaceInputView}
     */
    getPlaceInputView() {
      let self = this;
      // Initialize Place inputs
      const getCountryFromState = function (id) {
        return id ? id.split(':')[0] : '';
      };
      const getStateFromCounty = function (id) {
        let ids = id.split(':');
        return ids.length > 1 ? ids[0] + ':' + ids[1] : '';
      };

      const countryModel = new cachedCodesClass({
        propsData: {
          codes: 'countrycode'
        }
      });
      const stateModel = new codesWithKeysClass({
        propsData: {
          codes: 'statecode',
          keyParameter: 'countrycode',
          parseKey: getCountryFromState
        }
      });
      const countyModel = new codesWithKeysClass({
        propsData: {
          codes: 'countycode',
          keyParameter: 'statecode',
          parseKey: getStateFromCounty
        }
      });
      let placeInputViewClass = Vue.extend(PlaceInputView);
      return new placeInputViewClass({
        propsData: {
          container: document.querySelector('#place'),
          countryModel: countryModel,
          stateModel: stateModel,
          countyModel: countyModel,
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
          container: this.form.querySelector('#point-location')
        }
      });
      let boundingBoxInputClass = Vue.extend(BoundingBoxInputView);
      const boundingBoxInputView = new boundingBoxInputClass({
        propsData: {
          container: this.form.querySelector('#bounding-box')
        }
      });
      let siteParameterInputClass = Vue.extend(SiteParameterInputView);
      const siteParameterInputView = new siteParameterInputClass({
        propsData: {
          container: this.form.querySelector('#site-params'),
          siteTypeModel: new cachedCodesClass({propsData: {codes: 'sitetype'}}),
          organizationModel: new cachedCodesClass({propsData: {codes: 'organization'}}),
          providers: this.providers
        }
      });
      let samplingParametersClass = Vue.extend(SamplingParameterInputView);
      const samplingParametersInputView = new samplingParametersClass({
        propsData: {
          container: this.form.querySelector('#sampling'),
          sampleMediaModel: new cachedCodesClass({propsData: {codes: 'samplemedia'}}),
          characteristicTypeModel: new cachedCodesClass({propsData: {codes: 'characteristictype'}}),
          providers: this.providers
        }
      });
      let biologicalSamplingInputClass = Vue.extend(BiologicalSamplingInputView);
      const biologicalSamplingInputView = new biologicalSamplingInputClass({
        propsData: {
          container: this.form.querySelector('#biological'),
          assemblageModel: new cachedCodesClass({propsData: {codes: 'assemblage'}}),
          providers: this.providers
        }
      });
      let dataDetailsClass = Vue.extend(DataDetailsView);
      this.dataDetailsView = new dataDetailsClass({
        propsData: {
          container: this.form.querySelector('.download-box-input-div'),
          form: this.form
          // updateResultTypeAction: (dataProfile) => {
            // Change the 'form action' on both the basic and advanced forms everytime the 'Data Profiles'
            // radio buttons are changed. This keeps the form action correctly selected when the basic form
            // 'id=params-basic' is selected. This is acceptable behavior because the 'form action' attribute
            // only accepts the URL and not the URL parameters. The URL parameters are only for the pre-download
            // query which reports the number of database entries that will be returned. The actual data download is
            // accomplished through the form action which sends the form data to a URL that changes depending on
            // the 'Data Profile' selected. For example, the default form action attribute value is
            // 'https://www.waterqualitydata.us/data/Station/search', if the user would change the radio buttons
            // for the 'Data Profiles' to 'Project' the form action attribute value would be
            // 'https://www.waterqualitydata.us/data/Project/search'.
          //   const basicForm = document.querySelector('#params-basic');
          //   const advancedForm = document.querySelector('#params');
          //   console.log('about to set form attribute with this dataProfile ', dataProfile)
          //   basicForm.setAttribute('action', queryService.getFormUrl(dataProfile));
          //   advancedForm.setAttribute('action', queryService.getFormUrl(dataProfile));
          // }
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
      let nldiView;
      if (Config.NLDI_ENABLED && this.form.getAttribute('id') === 'params') {
        let nldiClass = Vue.extend(NldiView);
        nldiView = new nldiClass({
          propsData: {
            mapDivId: 'nldi-map',
            input: 'nldi-url'
          }
        });
        nldiView.initialize();
      } else if (this.form.getAttribute('id') === 'params') {
        this.form.querySelector('#nldi-container').style.display = 'none';
        this.form.querySelector('#nldi-map').style.display = 'none';
      }


      // Initialize the share window and button event handler
      const shareContainer = this.form.querySelector('.share-container');
      const shareText = shareContainer.querySelector('textarea');
      shareText.value = window.location.href;

      let self = this;
      document.querySelector('#basic-tab').addEventListener('click', function () {
        let formtype = document.querySelector('#params-basic');
        self.updateSelected(formtype);
      });

      document.querySelector('#advanced-tab').addEventListener('click', function () {
        let formtype = document.querySelector('#params');
        self.updateSelected(formtype);
      });

      this.setUpWatchers();

      const basicForm = document.querySelector('#params-basic');
      // Set up change event handler for form inputs to update the hash part of the url
      // this.form.querySelectorAll('input[name], select[name], textarea[name], button[name]').forEach(input => {
      this.form.querySelectorAll('input[name]:not([name="dataProfile"]), select[name], textarea[name], button[name]').forEach(input => {
          input.onchange = () => {
          // console.log('in downloadview this.form ', this.form)
          const queryParamArray = getQueryParamArray(this.form);
          const queryString = getQueryString(queryParamArray, ['zip', 'csrf_token']);
          window.location.hash = `#${queryString}`;
          shareText.value = window.location.href;
        };
      });
      // basicForm.querySelectorAll('input[name], select[name], textarea[name], button[name]').forEach(input => {
      basicForm.querySelectorAll('input[name]:not([name="dataProfile"]), select[name], textarea[name], button[name]').forEach(input => {
        input.onchange = () => {
          const queryParamArray = getQueryParamArray(basicForm);
          const queryString = getQueryString(queryParamArray, ['zip', 'csrf_token']);
          window.location.hash = `#${queryString}`;
          shareText.value = window.location.href;
        };
      });

      // Sets up clear form action for all clear search buttons
      const dataDetailsView = this.dataDetailsView;
      const clearButtons = document.querySelectorAll('.clear-form');
      clearButtons.forEach((button) => {
        button.onclick = () => {
          // Clears basic form step 1
          document.querySelector('#withinBasic').value = '';
          document.querySelector('#withinBasic').dispatchEvent(new Event('change'));
          document.querySelector('#latBasic').value = '';
          document.querySelector('#latBasic').dispatchEvent(new Event('change'));
          document.querySelector('#longBasic').value = '';
          document.querySelector('#longBasic').dispatchEvent(new Event('change'));
          store.commit('getCountryState', []);
          store.commit('getStateState', []);
          store.commit('getCountyState', []);
          store.commit('getSitetypeState', []);

          // Clears basic form step 2
          const checkboxes = document.querySelector('.datasources-basic').querySelectorAll('input');
          checkboxes.forEach(function (checkbox) {
            checkbox.checked = true;
          });
          document.querySelector('#startDateLoBasic').value = '';
          document.querySelector('#startDateLoBasic').dispatchEvent(new Event('change'));
          document.querySelector('#startDateHiBasic').value = '';
          document.querySelector('#startDateHiBasic').dispatchEvent(new Event('change'));
          store.commit('getSampleMediaState', []);
          store.commit('getChargroupState', []);

          // Clears data details view on both basic and advanced
          dataDetailsView.resetContainer();

          // Clears all other data on advanced form
          placeInputView.resetContainer();
          nldiView.updateNldiInput('');
          pointLocationInputView.resetContainer();
          boundingBoxInputView.resetContainer();
          samplingParametersInputView.resetContainer();
          siteParameterInputView.resetContainer();
        };
      });

      // // Set up the Download button for basic and advanced forms
      this.setUpDownloadButton(basicForm);
      this.setUpDownloadButton(this.form);

      return initComplete;
    },
    updateUrlHashString(form) {
      const queryParamArray = getQueryParamArray(form);
      const queryString = getQueryString(queryParamArray, ['zip', 'csrf_token']);
      window.location.hash = `#${queryString}`;
      shareText.value = window.location.href;
    },

    updateSelected(formtype) {
      this.selectedForm = formtype;
    },
    setUpWatchers() {
      const shareContainer = this.form.querySelector('.share-container');
      const shareText = shareContainer.querySelector('textarea');
      let self = this;
      let getQuery = function () {
        const queryParamArray = getQueryParamArray(self.selectedForm);
        const queryString = getQueryString(queryParamArray, ['zip', 'csrf_token']);
        window.location.hash = `#${queryString}`;
        shareText.value = window.location.href;
      };

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
      if (form.id === 'params') {
        formType = 'advanced';
        buttonSelector = '#main-button';
        downloadProgressDialog = this.downloadProgressDialog;
      } else {
        formType = 'basic';
        buttonSelector = '#basic-main-button';
        downloadProgressDialog = this.downloadProgressDialogBasic;
      }
      // Set up the Download button
      form.querySelector(buttonSelector).onclick = (event) => {
        // const fileFormat = this.dataDetailsView.getMimeType();
        // const resultType = this.dataDetailsView.getResultType();
        const fileFormat = store.state.mimeType;
        const dataProfile = store.state.dataProfile.mainProfile;
        const queryParamArray = getQueryParamArray(form);
        const queryString = decodeURIComponent(getQueryString(queryParamArray));
        const self = this;
        const startDownload = (totalCount) => {
          window._gaq.push([
            '_trackEvent',
            'Portal Page',
            // self.dataDetailsView.getResultType() + 'Download',
            `${dataProfile}Download`,
            queryString,
            parseInt(totalCount)]);
          form.submit();
        };

        event.preventDefault();
        if (!downloadFormController.validateDownloadForm(form, formType)) {
          console.log('Form is invalid');
          return;
        }

        window._gaq.push([
          '_trackEvent',
          'Portal Page',
          // resultType + 'Count',
            `${dataProfile}Count`,
          queryString
        ]);

        downloadProgressDialog.show('download');
        // queryService.fetchQueryCounts(resultType, queryParamArray, this.providers.getIds())
        queryService.fetchQueryCounts(dataProfile, queryParamArray, this.providers.getIds())

            .then((counts) => {
              // downloadProgressDialog.updateProgress(counts, resultType, fileFormat, startDownload);
              downloadProgressDialog.updateProgress(counts, dataProfile, fileFormat, startDownload);
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

    // /*
    //  * Return an array of Objects with name, value, and data-multiple attributes representing the current state
    //  * of the form. Empty
    //  * values are removed from the array. For selects and checkbox fieldsets that can have multiple values value will be an array, otherwise
    //  * it will be a string.
    //  * @return {Array of Objects with name, value, and multiple properties}
    //  */
    // getQueryParamArray(currentForm) {
    //   let stores = [
    //     {name: 'countrycode', value: store.state.countrySelectedState},
    //     {name: 'statecode', value: store.state.stateSelectedState},
    //     {name: 'countycode', value: store.state.countySelectedState},
    //     {name: 'siteType', value: store.state.sitetypeSelectedState},
    //     {name: 'charGroup', value: store.state.chargroupSelectedState},
    //     {name: 'sampleMedia', value: store.state.sampleMediaSelectedState},
    //     {name: 'organization', value: store.state.orgIDSelectedState},
    //     {name: 'project', value: store.state.projIDSelectedState},
    //     {name: 'siteid', value: store.state.siteIDSelectedState},
    //     {name: 'characteristicName', value: store.state.charSelectedState},
    //     {name: 'assemblage', value: store.state.assemblageSelectedState},
    //     {name: 'subjectTaxonomicName', value: store.state.taxSelectedState}
    //   ];
    //
    //   // Need to eliminate form parameters within the mapping-div
    //   const formInputs =
    //       currentForm.querySelectorAll(
    //           // 'input:not(#mapping-div input, #nldi-map input, input[name="dataProfile"]), textarea:not(#mapping-div textarea, #nldi-map textarea), select:not(#mapping-div select, #nldi-map select), button:not(#mapping-div button, #nldi-map button)'
    //           'input:not(#mapping-div input, #nldi-map input), textarea:not(#mapping-div textarea, #nldi-map textarea), select:not(#mapping-div select, #nldi-map select), button:not(#mapping-div button, #nldi-map button)'
    //
    //       );
    //   let queryString = [];
    //   let providersArray = [];
    //   formInputs.forEach(function (el, index) {
    //     let multiselectArray = [];
    //     if (el.type !== 'radio' || el.checked || el.className === 'datasources usa-checkbox__input') {
    //
    //         const value = el.value;
    //         const valueIsNotEmpty = typeof value === 'string' ? value : value.length > 0;
    //         const name = el.getAttribute('name');
    //
    //         if (valueIsNotEmpty && name && el.className != 'multiselect__input' && el.className != 'hidden-input') {
    //           if (valueIsNotEmpty && el.className === 'datasources usa-checkbox__input' && el.checked === true) {
    //             providersArray.push(value);
    //           } else if (el.className !== 'datasources usa-checkbox__input') {
    //             if(valueIsNotEmpty && name === 'dataProfile') {
    //               if(el.dataset['subprofile'] !== '') {
    //                 console.log('sub profile ', el.dataset['subprofile'])
    //                 queryString.push({
    //                   name: name,
    //                   value: el.dataset['subprofile'],
    //                   multiple: el.dataset.multiple ? true : false
    //                 });
    //               }
    //             } else {
    //               queryString.push({
    //                 name: name,
    //                 value: value,
    //                 multiple: el.dataset.multiple ? true : false
    //               });
    //             }
    //           }
    //         }
    //         if (index === formInputs.length - 1) {
    //           queryString.push({
    //             name: 'providers',
    //             value: providersArray,
    //             multiple: el.dataset.multiple ? true : false
    //           });
    //         } else if (el.className === 'hidden-input') {
    //           stores.forEach(function (state) {
    //             if (el.name === state.name) {
    //               state.value.forEach(function (stateValue) {
    //                 multiselectArray.push(stateValue.id);
    //               });
    //
    //               if (multiselectArray.length !== 0) {
    //                 queryString.push({
    //                   name: state.name,
    //                   value: multiselectArray,
    //                   multiple: el.dataset.multiple ? true : false
    //                 });
    //               }
    //             }
    //           });
    //         }
    //       }
    //   });
    //   // console.log('in get query param array queryString ', queryString)
    //   return queryString;
    // },

    // getResultType() {
    //   return this.dataDetailsView.getResultType();
    // }
  }
};
</script>