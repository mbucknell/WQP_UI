<template>
</template>

<script>
import {getWfsGetFeatureUrl} from '../leafletUtils';
import { getQueryString, getCurlString, getQueryParamArray, getFormUrl } from '../utils';
import store from '../store/store.js';


/*
 * Initializes the windows which show the various API calls
 * @param {Object} options
 *      @prop {NodeList} container - The container containing the show button and the query windows.
 *      @prop {Function} getQueryParamArray - Returns the current query parameter array
 *      @prop {Function} getResultType - Returns the result type value the user selected in the form
 *      @returns {Array of Objects with name and value properties}
 */

export default {
  name: "ShowAPIView",
  props: {
    container: {
      type: HTMLDivElement,
      required: true
    }
  },
  methods: {
    initialize() {
        this.showAPIViewVisible = false;
        let apiQueryDiv = this.container.querySelector('#api-queries-div');
        let apiQueryTitle = this.container.querySelector('#query-div b');
        let apiQueryText = this.container.querySelector('#query-div textarea');
        let curlText = this.container.querySelector('#curl-query-div textarea');
        let wfsText = this.container.querySelector('#getfeature-query-div textarea');

        const showServiceCallsHandler = () => {
          const dataProfile = store.state.dataProfile.mainProfile;
          let queryParamArray = getQueryParamArray(this.container.closest("form"));
          const queryParamsWithoutCSRFToken = queryParamArray.filter( param => param.name !== 'csrf_token' );
          let apiQueryString;
          let curlString;

          apiQueryString = getFormUrl(dataProfile, getQueryString(queryParamsWithoutCSRFToken));
          curlString = getCurlString(dataProfile, queryParamsWithoutCSRFToken);
          apiQueryDiv.style.display = 'block';
          apiQueryTitle.innerHTML = dataProfile.replace(/([A-Z])/g, ' $1');
          apiQueryText.innerHTML = apiQueryString;
          curlText.innerHTML = curlString;
            
          if (queryParamsWithoutCSRFToken.filter(param => param.name.includes('dataProfile'))){
              let queryWithoutDataProfileArray = queryParamsWithoutCSRFToken.filter(param => param.name !== 'dataProfile');
              wfsText.innerHTML = getWfsGetFeatureUrl(queryWithoutDataProfileArray);
          } else {
              wfsText.innerHTML =getWfsGetFeatureUrl(queryParamsWithoutCSRFToken);
          }
      };

        this.showAPIViewVisible = true;
        showServiceCallsHandler();

        this.container.closest('form').onchange = () => {
            if (this.showAPIViewVisible) {
                showServiceCallsHandler();
            }
        };
        document.querySelector('#advanced-tab').onclick = () => {
            this.container.closest('form').dispatchEvent(new Event('change'));
        }
        document.querySelector('.advancedLink').onclick = () => {
            this.container.closest('form').dispatchEvent(new Event('change'));
        }

        this.setUpWatchers();
    },
    setUpWatchers() {
        store.watch(() => store.state.countrySelectedState, () => {
            this.container.closest('form').dispatchEvent(new Event('change'));
        });
        store.watch(() => store.state.stateSelectedState, () => {
            this.container.closest('form').dispatchEvent(new Event('change'));
        });
        store.watch(() => store.state.countySelectedState, () => {
            this.container.closest('form').dispatchEvent(new Event('change'));
        });
        store.watch(() => store.state.sitetypeSelectedState, () => {
            this.container.closest('form').dispatchEvent(new Event('change'));
        });
        store.watch(() => store.state.siteIDSelectedState, () => {
            this.container.closest('form').dispatchEvent(new Event('change'));
        });
        store.watch(() => store.state.projIDSelectedState, () => {
            this.container.closest('form').dispatchEvent(new Event('change'));
        });
        store.watch(() => store.state.orgIDSelectedState, () => {
            this.container.closest('form').dispatchEvent(new Event('change'));
        });
        store.watch(() => store.state.chargroupSelectedState, () => {
            this.container.closest('form').dispatchEvent(new Event('change'));
        });
        store.watch(() => store.state.sampleMediaSelectedState, () => {
            this.container.closest('form').dispatchEvent(new Event('change'));
        });
        store.watch(() => store.state.charSelectedState, () => {
            this.container.closest('form').dispatchEvent(new Event('change'));
        });
        store.watch(() => store.state.assemblageSelectedState, () => {
            this.container.closest('form').dispatchEvent(new Event('change'));
        });
        store.watch(() => store.state.taxSelectedState, () => {
            this.container.closest('form').dispatchEvent(new Event('change'));
        });
    }
  },
}
</script>