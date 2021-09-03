<template>
</template>

<script>
import includes from 'lodash/includes';
import filter from 'lodash/filter';
import has from 'lodash/has';
import last from 'lodash/last';
import union from 'lodash/union';

import Vue from 'vue';
import InputValidationView from './InputValidationView.vue';
import { CodeSelect, CascadedCodeSelect } from './portalViews';
import { getPostalCode } from '../stateFIPS';
import { getAnchorQueryValues} from '../utils';

const USA = 'US';

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
      InputValidationView
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

        new CodeSelect(
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

        new CodeSelect(
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

        new CascadedCodeSelect(
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

        new CascadedCodeSelect(
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

        new CascadedCodeSelect(
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

        new CascadedCodeSelect(
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
            const results = countrySelect.value;
            return results.length > 0 ? results : [USA];
        };
        const getCountryKeysBasic = function () {
            const results = countrySelectBasic.value;
            return results.length > 0 ? results : [USA];
        };

        const getStateKeys = function() {
            const results = stateSelect.value;
            return results.length > 0 ? results : [];
        };
        const getStateKeysBasic = function() {
            const results = stateSelectBasic.value;
            return results.length > 0 ? results : [];
        };

        //Fetch initial model data
        let fetchCountries = this.countryModel.fetch();
        let fetchCountriesBasic = this.countryModel.fetch();
        let fetchStates = this.stateModel.fetch(union([USA], initCountries));
        let fetchStatesBasic = this.stateModel.fetch(union([USA], initCountriesBasic));
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
        let fetchComplete = Promise.all([fetchCountries, fetchStates, fetchCounties, fetchCountriesBasic, fetchStatesBasic, fetchCountiesBasic]);

        //Initialize select2s
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

        //Add event handlers
        countrySelect.addEventListener('change', function (ev) {
            /* update states */
            let countries = ev.target.value;
            const states = stateSelect.value;
            const isInCountries = function(state) {
                const countryCode = state.split(':')[0];
                return includes(countries, countryCode);
            };

            if (!countries) {
                countries = [USA];
            }
            stateSelect.value = filter(states, isInCountries);
            stateSelect.dispatchEvent(new Event('change'));
        });

        //Add event handlers
        countrySelectBasic.addEventListener('change', function (ev) {
            /* update states */
            let countries = ev.target.value;
            const states = stateSelectBasic.value;
            const isInCountries = function(state) {
                const countryCode = state.split(':')[0];
                return includes(countries, countryCode);
            };

            if (!countries) {
                countries = [USA];
            }
            stateSelectBasic.value = filter(states, isInCountries);
            stateSelectBasic.dispatchEvent(new Event('change'));
        }); 

        stateSelect.addEventListener('change', function (ev) {
            const states = ev.target.value;
            const counties = countySelect.value;
            const isInStates = function(county) {
                const codes = county.split(':');
                const stateCode = codes[0] + ':' + codes[1];
                return includes(states, stateCode);
            };

            countySelect.value = filter(counties, isInStates);
            countySelect.dispatchEvent(new Event('change'));
        });

        stateSelectBasic.addEventListener('change', function (ev) {
            const states = ev.target.value;
            const counties = countySelectBasic.value;
            const isInStates = function(county) {
                const codes = county.split(':');
                const stateCode = codes[0] + ':' + codes[1];
                return includes(states, stateCode);
            };

            countySelectBasic.value = filter(counties, isInStates);
            countySelectBasic.dispatchEvent(new Event('change'));
        });

        let inputValidationClass = Vue.extend(InputValidationView);
        new inputValidationClass({
            propsData: {
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
            }
        });
        
        new inputValidationClass({
            propsData: {
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
            }
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