<template>
</template>

<script>
import has from 'lodash/has';
import map from 'lodash/map';
import includes from 'lodash/includes';

import store from '../store/store.js';

export default {
  name: 'PortalViews',
  methods: {
    codeSelect(selectedState, state, el, options, initValues=[], providers) {
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

        store.commit(state, map(options.model.getAll(), formatData));
        if(initValues.length !== 0){
            let initState = [];
            initValues.forEach(function(value){
                initState.push(formatData(options.model.getLookup(value)));
            });
            store.commit(selectedState, initState);
        }
    },

    cascadedCodeSelect(selectedState, state, el, options, initValues=[], providers) {
        let selectOptions = options.model.getAll();
        let initState = [];

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
            if(result.selected){
                initState.push(result);
            }
            return result;
        };

        store.commit(state, map(selectOptions, initFormatData));
        if(initValues.length !== 0){
            store.commit(selectedState, initState);
        }
    }
  }
};
</script>
