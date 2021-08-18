import includes from 'lodash/includes';
import filter from 'lodash/filter';
import has from 'lodash/has';
import last from 'lodash/last';
import union from 'lodash/union';

import InputValidation from './inputValidationView';
import { CodeSelect, CascadedCodeSelect } from './portalViews';
import { getPostalCode } from '../stateFIPS';
import { getAnchorQueryValues} from '../utils';

const USA = 'US';

/*
 * Initializes and manages the Place inputs
 * @param {Object} options
 *      @prop {Jquery element} $container - div containing the place inputs.
 *      @prop {CachedCodes} countyModel
 *      @prop {CodesWithKeys} stateModel
 *      @prop {CodesWithKeys} countryModel
 * @returns {Object}
 *      @func initialize
 */
export default class PlaceInputView {
    constructor({$container, countyModel, stateModel, countryModel}) {
        this.$container = $container;
        this.countyModel = countyModel;
        this.stateModel = stateModel;
        this.countryModel = countryModel;
    }

    initializeCountrySelect($select, model, initValues=[]) {
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
            $select,
            spec, {
            templateSelection: templateSelection
            },
            initValues
        );
    }

    initializeCountrySelectBasic($select, model, initValues=[]) {
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
            $select,
            spec, {
            templateSelection: templateSelection
            },
            initValues
        );
    }

    initializeStateSelect($select, model, getCountryKeys, initValues=[]) {
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
            $select,
            spec,
            {
                templateSelection: templateSelection
            },
            initValues
        );
    }
    
    initializeStateSelectBasic($select, model, getCountryKeys, initValues=[]) {
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
            $select,
            spec,
            {
                templateSelection: templateSelection
            },
            initValues
        );
    }

    initializeCountySelect($select, model, getStateKeys, initValues) {
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
            $select,
            countySpec,
            {
                templateSelection: templateSelection
            },
            initValues
        );
    }

    initializeCountySelectBasic($select, model, getStateKeys, initValues) {
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
            $select,
            countySpec,
            {
                templateSelection: templateSelection
            },
            initValues
        );
    }

    /*
     * Initialize the select2's and add event handlers
     * @return Jquery promise
     *      @resolve - When all models have been fetched successfully
     *      @reject - If any of the fetches failed.
     */
    initialize() {
        //Initialize select els
        let $countrySelectBasic = $('#countrycodeBasic');
        let $countrySelect = this.$container.find('#countrycode');
        let $stateSelectBasic = $('#statecodeBasic');
        let $stateSelect = this.$container.find('#statecode');
        let $countySelectBasic = $('#countycodeBasic');
        let $countySelect = this.$container.find('#countycode');

        const initCountriesBasic = getAnchorQueryValues($countrySelectBasic.attr('name'));
        const initCountries = getAnchorQueryValues($countrySelect.attr('name'));
        const initStatesBasic = getAnchorQueryValues($stateSelectBasic.attr('name'));
        const initStates = getAnchorQueryValues($stateSelect.attr('name'));
        const initCountiesBasic = getAnchorQueryValues($countySelectBasic.attr('name'));
        const initCounties = getAnchorQueryValues($countySelect.attr('name'));

        const getCountryKeys = function () {
            const results = $countrySelect.val();
            return results.length > 0 ? results : [USA];
        };
        const getCountryKeysBasic = function () {
            const results = $countrySelectBasic.val();
            return results.length > 0 ? results : [USA];
        };

        const getStateKeys = function() {
            const results = $stateSelect.val();
            return results.length > 0 ? results : [];
        };
        const getStateKeysBasic = function() {
            const results = $stateSelectBasic.val();
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
            fetchCounties = $.Deferred().resolve();
        }
        let fetchCountiesBasic;
        if (initStates.length) {
            fetchCountiesBasic = this.countyModel.fetch(initStates);
        } else {
            fetchCountiesBasic = $.Deferred().resolve();
        }
        let fetchComplete = $.when(fetchCountries, fetchStates, fetchCounties, fetchCountriesBasic, fetchStatesBasic, fetchCountiesBasic);

        //Initialize select2s
        fetchCountries.done(() => {
            this.initializeCountrySelect($countrySelect, this.countryModel, initCountries);
        });
        fetchCountriesBasic.done(() => {
            this.initializeCountrySelectBasic($countrySelectBasic, this.countryModel, initCountriesBasic);
        });
        fetchStates.done(() => {
            this.initializeStateSelect($stateSelect, this.stateModel, getCountryKeys, initStates);
        });
        fetchStatesBasic.done(() => {
            this.initializeStateSelectBasic($stateSelectBasic, this.stateModel, getCountryKeysBasic, initStatesBasic);
        });
        fetchCounties.done(() => {
            this.initializeCountySelect($countySelect, this.countyModel, getStateKeys, initCounties);
        });
        fetchCountiesBasic.done(() => {
            this.initializeCountySelectBasic($countySelectBasic, this.countyModel, getStateKeysBasic, initCountiesBasic);
        });

        //Add event handlers
        $countrySelect.on('change', function (ev) {
            /* update states */
            let countries = $(ev.target).val();
            const states = $stateSelect.val();
            const isInCountries = function(state) {
                const countryCode = state.split(':')[0];
                return includes(countries, countryCode);
            };

            if (!countries) {
                countries = [USA];
            }
            $stateSelect.val(filter(states, isInCountries)).trigger('change');
        });

        //Add event handlers
        $countrySelectBasic.on('change', function (ev) {
            /* update states */
            let countries = $(ev.target).val();
            const states = $stateSelectBasic.val();
            const isInCountries = function(state) {
                const countryCode = state.split(':')[0];
                return includes(countries, countryCode);
            };

            if (!countries) {
                countries = [USA];
            }
            $stateSelectBasic.val(filter(states, isInCountries)).trigger('change');
        }); 

        $stateSelect.on('change', function (ev) {
            const states = $(ev.target).val();
            const counties = $countySelect.val();
            const isInStates = function(county) {
                const codes = county.split(':');
                const stateCode = codes[0] + ':' + codes[1];
                return includes(states, stateCode);
            };

            $countySelect.val(filter(counties, isInStates)).trigger('change');
        });

        $stateSelectBasic.on('change', function (ev) {
            const states = $(ev.target).val();
            const counties = $countySelectBasic.val();
            const isInStates = function(county) {
                const codes = county.split(':');
                const stateCode = codes[0] + ':' + codes[1];
                return includes(states, stateCode);
            };

            $countySelectBasic.val(filter(counties, isInStates)).trigger('change');
        });

        new InputValidation({
            inputEl : $countySelectBasic,
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
        
        new InputValidation({
            inputEl : $countySelect,
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
    }

    countyBasicInputValidation() {
        
    }

    resetContainer() {
        let $inputs = this.$container.find(':input[name]');
        $inputs.val('');
        $inputs.trigger('change');
    }
}
