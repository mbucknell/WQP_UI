import map from 'lodash/map';
import omit from 'lodash/omit';
import mapValues from 'lodash/mapValues';

import {getQueryParamJson} from './utils';
/*
 * @param {L.LatLngBounds} bounds
 * @returns a string representing bounds as south,west,north,east
 */
export const toBBoxString = function(bounds) {
    return bounds.getSouth() + ',' + bounds.getWest() + ',' + bounds.getNorth() + ',' + bounds.getEast();
};

/*
     * @static
     * @param {Array of Object} queryParamArray - each object contains name, value, and multiple properties.
     * @returns {String} - Returns the value of the SEARCHPARAMS query parameter that is sent in OGC request
     */
const getSearchParams =  function(queryParamArray) {
    const queryJson = getQueryParamJson(queryParamArray);
    let resultJson = omit(queryJson, ['mimeType', 'zip']);
    resultJson = mapValues(resultJson, function(value) {
        if (typeof value === 'string') {
            return value;
        } else {
            return value.join('|');
        }
    });
    var resultArray = map(resultJson, function (value, name) {
        return name + ':' + value;
    });
    return resultArray.join(';');
};


/*
 * @static
 * @returns {String} - Url which can be used to retrieve json feature information using WFS GetFeature.
 */
export const getWfsGetFeatureUrl = function(queryParamArray) {
    const LAYER_NAME = 'wqp_sites';
    const WFS_VERSION = '2.0.0';
    const queryData = {
        request: 'GetFeature',
        service: 'wfs',
        version: WFS_VERSION,
        typeNames: LAYER_NAME,
        SEARCHPARAMS: getSearchParams(queryParamArray),
        outputFormat: 'application/json'
    };

    return Config.SITES_GEOSERVER_ENDPOINT + 'wfs/?' + $.param(queryData);
};
