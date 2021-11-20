import has from 'lodash/has';
import omit from 'lodash/omit';
import log from 'loglevel';
import numeral from 'numeral';
import axios from 'axios';

import { getQueryParamJson } from './utils';


// Export an object so we can mock the functions in the test suite.
export default {
    /*
     * @param {String} resultType - 'Station' or 'Result'
     * @param {Array of Objects with name, value and multiple properties representing query parameters} queryParamArray
     * @param {Array of Strings} providers - The application's providers.
     * @return {Jquery.Promise}
     *      @resolve {Object} - If the counts are successfully fetched this object will contain a 'total' property and
     *          properties for each provider. This property values will be an object with sites and results properties which
     *          will contain the counts for that provider (or total)
     *      @reject {String} - If the fetch fails, returns an error message.
     */
    fetchQueryCounts: function(resultType, queryParamArray, providers) {
        var rejectPromise;
        var resolvePromise;
        var deferred = new Promise(function(resolve, reject){
            resolvePromise = resolve;
            rejectPromise = reject;
        });

        var queryParamJson = getQueryParamJson(queryParamArray);
        var countQueryJson = omit(queryParamJson, ['mimeType', 'zip', 'sorted']);

        var formatCount = function(countData, key) {
            var countString = has(countData, key) ? countData[key] : '0';
            var result = numeral(countString).format('0,0');
            return result === '0' ? '0' : result;
        };
        axios.post(Config.QUERY_URLS[resultType] + '/count?mimeType=json', countQueryJson, {})
        .then(function (response) {
            let data = response.data;
            var result = {
                total: {
                    sites: formatCount(data, 'Total-Site-Count'),
                    projects: formatCount(data, 'Total-Project-Count'),
                    projectmonitoringlocationweightings: formatCount(data, 'Total-ProjectMonitoringLocationWeighting-Count'),
                    results: formatCount(data, 'Total-Result-Count'),
                    activities: formatCount(data, 'Total-Activity-Count'),
                    activitymetrics: formatCount(data, 'Total-ActivityMetric-Count'),
                    resultdetections: formatCount(data, 'Total-ResultDetectionQuantitationLimit-Count'),
                    organizations: formatCount(data, 'Total-Organization-Count'),
                    biologicalHabitatMetrics: formatCount(data, 'Total-BiologicalMetric-Count')
                }
            };
            providers.forEach(function(provider) {
                result[provider] = {
                    sites: formatCount(data, provider + '-Site-Count'),
                    projects: formatCount(data, provider + '-Project-Count'),
                    projectmonitoringlocationweightings: formatCount(data, provider + '-ProjectMonitoringLocationWeighting-Count'),
                    results: formatCount(data, provider + '-Result-Count'),
                    activities: formatCount(data, provider + '-Activity-Count'),
                    activitymetrics: formatCount(data, provider + '-ActivityMetric-Count'),
                    resultdetections: formatCount(data, provider + '-ResultDetectionQuantitationLimit-Count'),
                    organizations: formatCount(data, provider + '-Organization-Count'),
                    biologicalHabitatMetrics: formatCount(data, provider + '-BiologicalMetric-Count')
                };
            });
            log.debug('Successfully got counts');
            resolvePromise(result);
        })
        .catch(function(jqXHR, textStatus) {
            log.error(jqXHR)
            log.error('Unable to contact the WQP services: ' + textStatus);
            if (jqXHR.status === 401 || jqXHR.status === 403) {
                rejectPromise('No longer authorized to use the application. Please reload the page to login again');
            } else {
                rejectPromise('Unable to contact the WQP services: ' + textStatus);
            }
        })

        return deferred;
    },

    /*
     * @param {String} resultType
     * @param {String} queryParams - a query string
     * @returns {String} - the url and query params to download data
     */
	
    getFormUrl: function(resultType, queryParams) {
        console.log('getFormUrl resultType', resultType)
        console.log('getFormUrl queryParams', queryParams)
        var result = Config.QUERY_URLS[resultType];
        if (queryParams) {
            result = result + '?' + queryParams;
        }
        console.log('getFormUrl result', result)
        return result;
    }
};
