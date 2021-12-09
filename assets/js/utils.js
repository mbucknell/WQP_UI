import each from 'lodash/each';
import includes from 'lodash/includes';
import reject from 'lodash/reject';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import store from "./store/store";

/*
 * Returns a query string suitable for use as a URL query string with parameters on the ignoreList
 * removed.
 * @param {Array of Object} queryParamArray - Each object has a string name property, a value property that can be an
 *         an array or a string and a boolean multiple property (not used in this function).
 * @param {Array of String} ignoreList - Names to be removed from paramArray before serializing
 * @param {Boolean} multiSelectDelimited - if True, values that are arrays are serialized as a single param with ';' separated values
 * @return {String} - String suitable for use as a URL query string.
 */
export const getQueryString = function(queryParamArray, ignoreList, multiSelectDelimited) {
    var thisIgnoreList = ignoreList ? ignoreList : [];
    var resultArray = reject(queryParamArray, function (param) {
        return includes(thisIgnoreList, param.name);
    });

    var paramArray = [];

    resultArray.forEach(function(param) {
        // If not string than it is assumed to be an array
        if (typeof param.value === 'string') {
            paramArray.push(param);
        } else if (multiSelectDelimited) {
            paramArray.push({
                name: param.name,
                value: param.value.join(';')
            });
        } else {
            param.value.forEach(function(val) {
                paramArray.push({
                    name: param.name,
                    value: val
                });
            });
        }
    });

    return $.param(paramArray);
};

/*
 * @param {Array of Object containing string name, value (string or array) and multiple properties} queryParamArray
 * @returns {Object} where the properties are the name property from queryParamArray. If an object contains a true
 * multiple property and the value property is a string then the value is split into an array using the string in
 * the multiple property.
 */
export const getQueryParamJson = function(queryParamArray) {
    var result = {};
    each(queryParamArray, function(param) {
        if (typeof param.value === 'string' && param.multiple) {
            result[param.name] = param.value.split(';');
        } else {
            result[param.name] = param.value;
        }
    });
    return result;
};

export const isExtraSmallBrowser = function() {
    return document.querySelector('body').offsetWidth < 750;
};

/*
 * Add/Remove the disabled attribute for $els and make the element appear enabled/disabled.
 * @param {Array of jquery input elements} $els
 * @param {Boolean} isEnabled
 */
export const setEnabled = function(els, isEnabled /* Boolean */) {
    els.disabled = !isEnabled;
    var label = document.querySelector('label[for="' + els.getAttribute('id') + '"]');
    if (isEnabled) {
        label.classList.remove('disabled');
    } else {
        label.classList.add('disabled');
    }
};

/*
 * Cookie utils
 */
export const Cookie = {
    /*
     * @param String name
     * @return String containing the cookie value for name or the empty string if none exists.
     */
    getByName: function(cname) {
        var name = cname + '=';
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }
};

/*
 * @param {String} param
 * @return {Array} containing the values of the query parameter that is currently in the anchor part of the url
 */
export const getAnchorQueryValues = function(param) {
    const queryParams = window.location.hash.slice(1).split('&'); // Array of Arrays[name, value]
    return queryParams
        .map((queryParamString) => {
            return queryParamString.split('=');
        })
        .filter((nameValuePair) => {
            return nameValuePair[0] === param;
        })
        .map((nameValuePair) => {
            return decodeURIComponent(nameValuePair[1]);
        });
};

/*
 * Initialize the value of the $el input. Will only use the first value returned from getAnchorQueryValues if any.
 * @param {Jquery element} $el - should be a text input with a name attribute
 */

export const initializeInput = function(el) {
    const initValues = getAnchorQueryValues(el.getAttribute('name'));
    el.value = initValues.length ? initValues[0] : '';
};

/*
 * Assembles a curl string from the user entered form values
 * @param dataProfile {string} The value gathered from user input on the web form.
 * @param queryParamArray An array of values gathered from user input on web form.
 * @return {string} a formatted line that can be used a curl command.
 */

export const getCurlString = function(dataProfile, queryParamArray) {
    let curlLeadingString = 'curl -X POST --header \'Content-Type: application/json\' --header \'Accept: application/zip';
    let urlBase = Config.QUERY_URLS[dataProfile];
    let queryParamJson = getQueryParamJson(queryParamArray);
    let dataParameters = omit(queryParamJson, ['mimeType', 'zip', 'sorted']);
    let queryParameters = pick(queryParamJson, ['mimeType', 'zip', 'sorted']);
    let params = $.param(queryParameters);
    let curlDataParamsString = '';
    // don't let empty objects show up in the curl command display
    if (Object.keys(dataParameters).length > 0) {
        curlDataParamsString = ` -d '${JSON.stringify(dataParameters)}'`;
    }

    return `${curlLeadingString}'${curlDataParamsString} '${urlBase}?${params}'`;
};


/*
    * Return an array of Objects with name, value, and data-multiple attributes representing the current state
    * of the form. Empty
    * values are removed from the array. For selects and checkbox fieldsets that can have multiple values value will be an array, otherwise
    * it will be a string.
    * @return {Array of Objects with name, value, and multiple properties}
    */
export const getQueryParamArray = function(currentForm) {
    let stores = [
        {name: 'countrycode', value: store.state.countrySelectedState},
        {name: 'statecode', value: store.state.stateSelectedState},
        {name: 'countycode', value: store.state.countySelectedState},
        {name: 'siteType', value: store.state.sitetypeSelectedState},
        {name: 'charGroup', value: store.state.chargroupSelectedState},
        {name: 'sampleMedia', value: store.state.sampleMediaSelectedState},
        {name: 'organization', value: store.state.orgIDSelectedState},
        {name: 'project', value: store.state.projIDSelectedState},
        {name: 'siteid', value: store.state.siteIDSelectedState},
        {name: 'characteristicName', value: store.state.charSelectedState},
        {name: 'assemblage', value: store.state.assemblageSelectedState},
        {name: 'subjectTaxonomicName', value: store.state.taxSelectedState}
    ];

    // Need to eliminate form parameters within the mapping-div
    const formInputs =
        currentForm.querySelectorAll(
            // 'input:not(#mapping-div input, #nldi-map input, input[name="dataProfile"]), textarea:not(#mapping-div textarea, #nldi-map textarea), select:not(#mapping-div select, #nldi-map select), button:not(#mapping-div button, #nldi-map button)'
            'input:not(#mapping-div input, #nldi-map input), textarea:not(#mapping-div textarea, #nldi-map textarea), select:not(#mapping-div select, #nldi-map select), button:not(#mapping-div button, #nldi-map button)'

        );
    let queryString = [];
    let providersArray = [];
    formInputs.forEach(function (el, index) {
        let multiselectArray = [];
        if (el.type !== 'radio' || el.checked || el.className === 'datasources usa-checkbox__input') {

            const value = el.value;
            const valueIsNotEmpty = typeof value === 'string' ? value : value.length > 0;
            const name = el.getAttribute('name');

            if (valueIsNotEmpty && name && el.className != 'multiselect__input' && el.className != 'hidden-input') {
                if (valueIsNotEmpty && el.className === 'datasources usa-checkbox__input' && el.checked === true) {
                    providersArray.push(value);
                } else if (el.className !== 'datasources usa-checkbox__input') {
                    if(valueIsNotEmpty && name === 'dataProfileRadioButton') {
                        if(el.dataset['subprofile'] !== '') {
                            queryString.push({
                                name: 'dataProfile',
                                value: el.dataset['subprofile'],
                                multiple: el.dataset.multiple ? true : false
                            });
                        }
                    } else {
                        queryString.push({
                            name: name,
                            value: value,
                            multiple: el.dataset.multiple ? true : false
                        });
                    }
                }
            }
            if (index === formInputs.length - 1) {
                queryString.push({
                    name: 'providers',
                    value: providersArray,
                    multiple: el.dataset.multiple ? true : false
                });
            } else if (el.className === 'hidden-input') {
                stores.forEach(function (state) {
                    if (el.name === state.name) {
                        state.value.forEach(function (stateValue) {
                            multiselectArray.push(stateValue.id);
                        });

                        if (multiselectArray.length !== 0) {
                            queryString.push({
                                name: state.name,
                                value: multiselectArray,
                                multiple: el.dataset.multiple ? true : false
                            });
                        }
                    }
                });
            }
        }
    });

    return queryString;
}

