<template>
</template>

<script>
import includes from 'lodash/includes';
import filter from 'lodash/filter';
import has from 'lodash/has';
import last from 'lodash/last';
import union from 'lodash/union';
import map from 'lodash/map';

import Vue from 'vue';
import InputValidationView from './InputValidationView.vue';
import store from '../store/store.js'
import PortalViews from './PortalViews.vue';
import { getPostalCode } from '../stateFIPS';
import { getAnchorQueryValues} from '../utils';
import providers from '../providers.js';

const USA = 'US';

let portalViewClass = Vue.extend(PortalViews);
let portalViews = new portalViewClass();

/*
 * Initializes and manages the Place inputs
 * @param {Object} options
 *      @prop {NodeList} container - div containing the place inputs.
 *      @prop {CachedCodes} countyModel
 *      @prop {CodesWithKeys} stateModel
 *      @prop {CodesWithKeys} countryModel
 * @returns {Object}
 *      @func initialize
 */

export default {
  name: "PlaceInputView",
  props: ['container', 'countyModel', 'stateModel', 'countryModel'],
  components:{
      InputValidationView,
      PortalViews
  },
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
        var templateSelection = function(selectData) {
            if (has(selectData, 'id')) {
                return selectData.id;
            } else {
                return null;
            }
        };

        var spec = {
            model: model,
            isMatch: isMatch
        };

        portalViews.codeSelect("getCountryOptionsState",
            select,
            spec, {
            templateSelection: templateSelection
            },
            initValues
        );

    },
    initializeCountrySelectBasic(select, model, initValues=[]) {
        var isMatch = function (searchTerm, lookup) {
            var termMatcher;

            if (searchTerm) {
                termMatcher = new RegExp(searchTerm, 'i');
                return termMatcher.test(lookup.id) || termMatcher.test(lookup.desc);
            } else {
                return true;
            }
        };
        var templateSelection = function(selectData) {
            if (has(selectData, 'id')) {
                return selectData.id;
            } else {
                return null;
            }
        };

        var spec = {
            model: model,
            isMatch: isMatch
        };

        portalViews.codeSelect("getCountryOptionsState",
            select,
            spec, {
            templateSelection: templateSelection
            },
            initValues
        );
    },
    initializeStateSelect(select, model, getCountryKeys, initValues=[]) {
        var isMatch = function (searchTerm, lookup) {
            var termMatcher;
            var codes;
            if (searchTerm) {
                termMatcher = new RegExp(searchTerm, 'i');
                codes = lookup.id.split(':');
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

        var templateSelection = function(selectData) {
            var codes;
            var result;
            if (has(selectData, 'id')) {
                codes = selectData.id.split(':');

                if (codes[0] === USA) {
                    result = codes[0] + ':' + getPostalCode(codes[1]);
                } else {
                    result = selectData.id;
                }
            } else {
                result = null;
            }
            return result;
        };

        portalViews.cascadedCodeSelect(
            "getStateOptionsState",
            select,
            spec,
            {
                templateSelection: templateSelection
            },
            initValues
        );
    },
    initializeStateSelectBasic(select, model, getCountryKeys, initValues=[]) {
        var isMatch = function (searchTerm, lookup) {
            var termMatcher;
            var codes;
            if (searchTerm) {
                termMatcher = new RegExp(searchTerm, 'i');
                codes = lookup.id.split(':');
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

        var templateSelection = function(selectData) {
            var codes;
            var result;
            if (has(selectData, 'id')) {
                codes = selectData.id.split(':');

                if (codes[0] === USA) {
                    result = codes[0] + ':' + getPostalCode(codes[1]);
                } else {
                    result = selectData.id;
                }
            } else {
                result = null;
            }
            return result;
        };

        portalViews.cascadedCodeSelect(
            "getStateOptionsState",
            select,
            spec,
            {
                templateSelection: templateSelection
            },
            initValues
        );
    },
    initializeCountySelect(select, model, getStateKeys, initValues) {
        var isMatch = function(searchTerm, lookup) {
            var termMatcher;
            var county;
            if (searchTerm) {
                termMatcher = new RegExp(searchTerm, 'i');
                county = last(lookup.desc.split(','));
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

        var templateSelection = function(selectData) {
            var codes;
            var result;

            if (has(selectData, 'id')) {
                codes = selectData.id.split(':');

                if (codes[0] === 'US') {
                    result = codes[0] + ':' + getPostalCode(codes[1]) + ':' + codes[2];
                } else {
                    result = selectData.id;
                }
            } else {
                result = null;
            }
            return result;
        };

        portalViews.cascadedCodeSelect(
            "getCountyOptionsState",
            select,
            countySpec,
            {
                templateSelection: templateSelection
            },
            initValues
        );
    },
    initializeCountySelectBasic(select, model, getStateKeys, initValues) {
        var isMatch = function(searchTerm, lookup) {
            var termMatcher;
            var county;
            if (searchTerm) {
                termMatcher = new RegExp(searchTerm, 'i');
                county = last(lookup.desc.split(','));
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

        var templateSelection = function(selectData) {
            var codes;
            var result;

            if (has(selectData, 'id')) {
                codes = selectData.id.split(':');

                if (codes[0] === 'US') {
                    result = codes[0] + ':' + getPostalCode(codes[1]) + ':' + codes[2];
                } else {
                    result = selectData.id;
                }
            } else {
                result = null;
            }
            return result;
        };

        portalViews.cascadedCodeSelect(
            "getCountyOptionsState",
            select,
            countySpec,
            {
                templateSelection: templateSelection
            },
            initValues
        );
    },
    /*
     * Initialize the select2's and add event handlers
     * @return promise
     *      @resolve - When all models have been fetched successfully
     *      @reject - If any of the fetches failed.
     */
    initialize() {
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
                store.commit("getStateOptionsState", map(result, (data) => {
                    return {
                        id: data.id,
                        text: data.desc + ' (' + providers.formatAvailableProviders(data.providers) + ')'
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
                store.commit("getCountyOptionsState", map(result, (data) => {
                    return {
                        id: data.id,
                        text: data.desc + ' (' + providers.formatAvailableProviders(data.providers) + ')'
                    };
                })
                );
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
            },
            event : 'select2:opening'
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
            },
            event : 'select2:opening'
        });
        
        return fetchComplete;
    },
    resetContainer() {
        let inputs = this.container.querySelector('input[name], select[name], textarea[name], button[name]');
        inputs.value;
        inputs.dispatchEvent(new Event('change'));
    }
  }
}
</script>