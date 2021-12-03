<template>
</template>

<script>
import last from 'lodash/last';
import union from 'lodash/union';
import map from 'lodash/map';

import Vue from 'vue';
import InputValidationView from './InputValidationView.vue';
import store from '../store/store.js';
import PortalViews from './PortalViews.vue';
import { getPostalCode } from '../stateFIPS';
import { getAnchorQueryValues} from '../utils';

const USA = 'US';

let portalViewClass = Vue.extend(PortalViews);
let portalViews = new portalViewClass();

export default {
  name: 'PlaceInputView',
  props: ['container', 'countyModel', 'stateModel', 'countryModel', 'providers'],
  methods: {
      initializeCountrySelect(select, model, initValues=[]) {
        var isMatch = function (searchTerm, lookup) {
            var termMatcher;

            if (searchTerm) {
                termMatcher = new RegExp(searchTerm, 'i');
                return termMatcher.test(lookup.id) || termMatcher.test(lookup.desc);
            } else {
                return true;
            }
        };

        var spec = {
            model: model,
            isMatch: isMatch
        };

        portalViews.codeSelect(
            'getCountryState',
            'getCountryOptionsState',
            select,
            spec,
            initValues,
            this.providers
        );

    },
    initializeCountrySelectBasic(select, model, initValues=[]) {
        const isMatch = function (searchTerm, lookup) {
            if (searchTerm) {
                const termMatcher = new RegExp(searchTerm, 'i');
                return termMatcher.test(lookup.id) || termMatcher.test(lookup.desc);
            } else {
                return true;
            }
        };

        const spec = {
            model: model,
            isMatch: isMatch
        };

        portalViews.codeSelect(
            'getCountryState',
            'getCountryOptionsState',
            select,
            spec,
            initValues,
            this.providers
        );
    },
    initializeStateSelect(select, model, getCountryKeys, initValues=[]) {
        const isMatch = function (searchTerm, lookup) {
            if (searchTerm) {
                const termMatcher = new RegExp(searchTerm, 'i');
                const codes = lookup.id.split(':');
                return termMatcher.test(lookup.id) ||
                    termMatcher.test(lookup.desc) ||
                    termMatcher.test(getPostalCode(codes[1]));
            } else {
                return true;
            }
        };
        var spec = {
            model: model,
            isMatch: isMatch,
            getKeys: getCountryKeys
        };

        portalViews.cascadedCodeSelect(
            'getStateState',
            'getStateOptionsState',
            select,
            spec,
            initValues,
            this.providers
        );
    },
    initializeStateSelectBasic(select, model, getCountryKeys, initValues=[]) {
        var isMatch = function (searchTerm, lookup) {
            if (searchTerm) {
                const termMatcher = new RegExp(searchTerm, 'i');
                const codes = lookup.id.split(':');
                return termMatcher.test(lookup.id) ||
                    termMatcher.test(lookup.desc) ||
                    termMatcher.test(getPostalCode(codes[1]));
            } else {
                return true;
            }
        };
        var spec = {
            model: model,
            isMatch: isMatch,
            getKeys: getCountryKeys
        };


        portalViews.cascadedCodeSelect(
            'getStateState',
            'getStateOptionsState',
            select,
            spec,
            initValues,
            this.providers
        );
    },
    initializeCountySelect(select, model, getStateKeys, initValues) {
        var isMatch = function(searchTerm, lookup) {
            if (searchTerm) {
                const termMatcher = new RegExp(searchTerm, 'i');
                const county = last(lookup.desc.split(','));
                return termMatcher.test(county);
            } else {
                return true;
            }
        };
        var countySpec = {
            model: model,
            isMatch: isMatch,
            getKeys: getStateKeys
        };

        portalViews.cascadedCodeSelect(
            'getCountyState',
            'getCountyOptionsState',
            select,
            countySpec,
            initValues,
            this.providers
        );
    },
    initializeCountySelectBasic(select, model, getStateKeys, initValues) {
        const isMatch = function(searchTerm, lookup) {
            if (searchTerm) {
                const termMatcher = new RegExp(searchTerm, 'i');
                const county = last(lookup.desc.split(','));
                return termMatcher.test(county);
            } else {
                return true;
            }
        };
        var countySpec = {
            model: model,
            isMatch: isMatch,
            getKeys: getStateKeys
        };

        portalViews.cascadedCodeSelect(
            'getCountyState',
            'getCountyOptionsState',
            select,
            countySpec,
            initValues,
            this.providers
        );
    },
    /*
     * Initialize the select and add event handlers
     * @return promise
     *      @resolve - When all models have been fetched successfully
     *      @reject - If any of the fetches failed.
     */
    initialize() {
        let self = this;
        //Initialize select els
        let countrySelectBasic = document.querySelector('#countrycodeBasic');
        let countrySelect = this.container.querySelector('#countrycode');
        let stateSelectBasic = document.querySelector('#statecodeBasic');
        let stateSelect = this.container.querySelector('#statecode');
        let countySelectBasic = document.querySelector('#countycodeBasic');
        let countySelect = this.container.querySelector('#countycode');

        const initCountriesBasic = getAnchorQueryValues(countrySelectBasic.getAttribute('name'));
        const initCountries = getAnchorQueryValues(countrySelect.getAttribute('name'));
        const initStatesBasic = getAnchorQueryValues(stateSelectBasic.getAttribute('name'));
        const initStates = getAnchorQueryValues(stateSelect.getAttribute('name'));
        const initCountiesBasic = getAnchorQueryValues(countySelectBasic.getAttribute('name'));
        const initCounties = getAnchorQueryValues(countySelect.getAttribute('name'));

        const getCountryKeys = function () {
            const results = store.state.countrySelectedState;
            return results.length > 0 ? results : [USA];
        };
        const getCountryKeysBasic = function () {
            const results = store.state.countrySelectedState;
            return results.length > 0 ? results : [USA];
        };

        const getStateKeys = function() {
            const results = store.state.stateSelectedState;
            return results.length > 0 ? results : [];
        };
        const getStateKeysBasic = function() {
            const results = store.state.stateSelectedState;
            return results.length > 0 ? results : [];
        };

        //Fetch initial model data
        let fetchCountries = this.countryModel.fetch();
        let fetchCountriesBasic = this.countryModel.fetch();

        let fetchStates = this.stateModel.fetch(union([USA], initCountries));
        let fetchStatesBasic = this.stateModel.fetch(union([USA], initCountriesBasic));

        //When country changes, fetch states again
        store.watch(() => store.state.countrySelectedState, () => {
            if(store.state.countrySelectedState.length !== 0){
                fetchStates = this.stateModel.fetch(union([store.state.countrySelectedState[0].id], initCountries));
            }else{
                fetchStates = this.stateModel.fetch(union([USA], initCountries));
            }
            fetchStates.then((result) => {
                store.commit('getStateOptionsState', map(result, (data) => {
                    return {
                        id: data.id,
                        text: data.desc + ' (' + self.providers.formatAvailableProviders(data.providers) + ')'
                    };
                })
                );
            });
        });

        let fetchCounties;
        if (initStates.length) {
            fetchCounties = this.countyModel.fetch(initStates);
        } else {
            fetchCounties = Promise.resolve();
        }

        let fetchCountiesBasic;
        if (initStates.length) {
            fetchCountiesBasic = this.countyModel.fetch(initStates);
        } else {
            fetchCountiesBasic = Promise.resolve();
        }
        let fetchComplete = Promise.all([fetchCountries, fetchStates, fetchCounties, fetchCountiesBasic]);

        //When state changes, fetch counties again
        store.watch(() => store.state.stateSelectedState, () => {
            if(store.state.stateSelectedState.length !== 0){
                fetchCounties = this.countyModel.fetch(union([store.state.stateSelectedState[0].id], initCountries));
            }else{
                fetchCounties = this.countyModel.fetch(union([USA], initCountries));
            }
            fetchCounties.then((result) => {
                store.commit('getCountyOptionsState', map(result, (data) => {
                    return {
                        id: data.id,
                        text: data.desc + ' (' + self.providers.formatAvailableProviders(data.providers) + ')'
                    };
                }));
            });
        });

        //Initialize multiselects
        fetchCountries.then(() => {
            this.initializeCountrySelect(countrySelect, this.countryModel, initCountries);
        });
        fetchCountriesBasic.then(() => {
            this.initializeCountrySelectBasic(countrySelectBasic, this.countryModel, initCountriesBasic);
        });
        fetchStates.then(() => {
            this.initializeStateSelect(stateSelect, this.stateModel, getCountryKeys, initStates);
        });
        fetchStatesBasic.then(() => {
            this.initializeStateSelectBasic(stateSelectBasic, this.stateModel, getCountryKeysBasic, initStatesBasic);
        });
        fetchCounties.then(() => {
            this.initializeCountySelect(countySelect, this.countyModel, getStateKeys, initCounties);
        });
        fetchCountiesBasic.then(() => {
            this.initializeCountySelectBasic(countySelectBasic, this.countyModel, getStateKeysBasic, initCountiesBasic);
        });

        let inputValidationClass = Vue.extend(InputValidationView);
        let inputValidationViewBasic = new inputValidationClass();
        inputValidationViewBasic.initialize({
            inputEl : countySelectBasic,
            validationFnc : function(val, ev) {
                let result;
                if (getStateKeysBasic().length === 0) {
                    ev.preventDefault();
                    result  = {
                        isValid : false,
                        errorMessage : 'Please select at least one state'
                    };
                } else {
                    result = {
                        isValid : true
                    };
                }
                return result;
            }
        });
        
        let inputValidationViewAdv = new inputValidationClass();
        inputValidationViewAdv.initialize({
            inputEl : countySelect,
            validationFnc : function(val, ev) {
                let result;
                if (getStateKeys().length === 0) {
                    ev.preventDefault();
                    result  = {
                        isValid : false,
                        errorMessage : 'Please select at least one state'
                    };
                } else {
                    result = {
                        isValid : true
                    };
                }
                return result;
            }
        });
        
        return fetchComplete;
    },
    resetContainer() {
        let inputs = this.container.querySelectorAll('input[name], select[name], textarea[name], button[name]');
        inputs.forEach(function(input) {
          input.value = '';
          input.dispatchEvent(new Event('change'));
        });
    }
  }
};
</script>