<template>
</template>

<script>
import has from 'lodash/has';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import log from 'loglevel';

import store from '../store/store.js'
import axios from 'axios';

export default {
  name: "PortalViews",
  methods: {
    /*
    * @param {jquery element for select} el
    * @param {Array of Strings} ids -  to be used for select options
    * @param {Object} select2Options
    * @param {Array of String} initValues
    */
    // staticSelect2(el, ids, select2Options, initValues=[]) {
    //     var defaultOptions = {
    //         allowClear: true,
    //         theme: 'bootstrap',
    //         data: map(ids, function (id) {
    //             return {id: id, text: id, selected: includes(initValues, id)};
    //         })
    //     };
    //     el.select2($.extend({}, defaultOptions, select2Options));
    // },

    /*
    @param {jquery element selecting a select input} el
    @param {Object} options
        @prop {Object} model - object which is created by a call to CachedCodes and the data has already been fetched.
        @prop {Function} isMatch - Optional function with two parameters - term {String} which contains the search term and
        lookup {Object} representing an object in model. Should return Boolean
        @prop {Function} formatData - Optional function takes data (object with id, desc, and providers) and produces a select2 result object
        with id and text properties.
    @param {Object} select2Options
    @param {Array of String} initValues
    */
    codeSelect(state, el, options, select2Options, initValues=[], providers) {
        var isMatch;
        var defaultOptions;

        // Assign defaults for optional parameters
        if (has(options, 'isMatch')) {
            isMatch = options.isMatch;
        } else {
            isMatch = function (term, lookup) {
                var termMatcher;
                if (term) {
                    termMatcher = new RegExp(term, 'i');
                    return termMatcher.test(lookup.desc);
                } else {
                    return true;
                }
            };
        }
        if (!has(options, 'formatData')) {
            options.formatData = function (data) {
                return {
                    id: data.id,
                    text: data.desc + ' (' + providers.formatAvailableProviders(data.providers) + ')',
                    selected: includes(initValues, data.id)
                };
            };
        }
        const formatData = function(data) {
            let result = options.formatData(data);
            result.selected = includes(initValues, result.id);
            return result;
        };

        //Initialize the select2
        defaultOptions = {
            allowClear: true,
            theme: 'bootstrap',
            matcher: function (term, data) {
                var searchTerm = has(term, 'term') ? term.term : '';
                if (isMatch(searchTerm, options.model.getLookup(data.id))) {
                    return data;
                } else {
                    return null;
                }
            },
            templateSelection: function (data) {
                var result;
                if (has(data, 'id')) {
                    result = data.id;
                } else {
                    result = null;
                }
                return result;
            },
            data: map(options.model.getAll(), formatData)
        };

        store.commit(state, defaultOptions.data);
    },

    /*
    * @param {jquery element selecting a select input} el
    * @param {Object} options
    *      @prop {Object} model - object which is created by a call to CodesWithKeys
    *      @prop {Function} isMatch - Optional function with two parameters - term {Object} which contains a term property for the search term and
    *          data {Object} representing an option. Should return Boolean.
    *      @prop {Function} formatData - Optional function takes data (object with id, desc, and providers) and produces a select2 result object
    *          with id and text properties.
    *      @prop {Function} getKeys - returns an array of keys to use when retrieving valid options for this select.
    *  @param {Object} select2Options
    *  @param {Array of String} initValues
    */
    cascadedCodeSelect(state, el, options, select2Options, initValues=[], providers) {
        // Assign defaults for optional parameters
        if (!has(options, 'isMatch')) {
            options.isMatch = function (term, data) {
                var termMatcher;
                if (term) {
                    termMatcher = new RegExp(term.term, 'i');
                    return termMatcher.test(data.id);
                } else {
                    return true;
                }
            };
        }

        if (!has(options, 'formatData')) {
            options.formatData = function (data) {
                return {
                    id: data.id,
                    text: data.desc + ' (' + providers.formatAvailableProviders(data.providers) + ')'
                };
            };
        }
        const initFormatData = function(data) {
            let result = options.formatData(data);
            result.selected = includes(initValues, result.id);
            return result;
        };
        var defaultOptions = {
            allowClear: true,
            theme: 'bootstrap',
            data: map(options.model.getAll(), initFormatData)
        };

        store.commit(state, defaultOptions.data);
    }
  }
}
</script>
