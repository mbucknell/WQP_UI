<template>
</template>

<script>
import queryService from '../queryService';
import { getQueryString, getCurlString } from '../utils';

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
  props: ['container', 'getQueryParamArray', 'getResultType'],
  methods: {
    initialize() {
        this.showAPIViewVisible = false;
        let apiQueryDiv = this.container.querySelector('#api-queries-div');
        let apiQueryTitle = this.container.querySelector('#query-div b');
        let apiQueryText = this.container.querySelector('#query-div textarea');
        let curlText = this.container.querySelector('#curl-query-div textarea');
        let wfsText = this.container.querySelector('#getfeature-query-div textarea');

        const showServiceCallsHandler = () => {
            let resultType = this.getResultType();
            let queryParamArray = this.getQueryParamArray();
            const queryParamsWithoutCSRFToken = queryParamArray.filter( param => param.name !== 'csrf_token' );

            let apiQueryString = queryService.getFormUrl(resultType, getQueryString(queryParamsWithoutCSRFToken));
            let curlString = getCurlString(resultType, queryParamsWithoutCSRFToken);

            apiQueryDiv.style.display = "block";
            apiQueryTitle.innerHTML = resultType.replace(/([A-Z])/g, ' $1');
            apiQueryText.innerHTML = apiQueryString;
            curlText.innerHTML = curlString;

            let queryWithoutDataProfileArray = queryParamsWithoutCSRFToken.filter( param => param.name !== 'dataProfile' );
            wfsText.innerHTML = L.WQPSitesLayer.getWfsGetFeatureUrl(queryWithoutDataProfileArray);
        };

        // Update the service calls when the
            this.showAPIViewVisible = true;
            showServiceCallsHandler();

        this.container.closest('form').onchange = () => {
            if (this.showAPIViewVisible) {
                showServiceCallsHandler();
            }
        };
    }
  },
}
</script>