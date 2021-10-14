<template>
</template>

<script>
import Vue from 'vue';
import DateValidator from '../DateValidator.vue';
import InputValidationView from './InputValidationView.vue';
import PortalViews from './PortalViews.vue';

import PortalValidators from '../PortalValidators.vue';
import { getAnchorQueryValues, initializeInput } from '../utils';

let portalViewClass = Vue.extend(PortalViews);
let portalViews = new portalViewClass();

/*
 * Creates a sampling parameter input view
 * @param {Object} options
 *      @prop {NodeList} container - element where the sampling parameter inputs are contained
 *      @prop {CachedCodes} sampleMediaModel
 *      @prop {CachedCodes} characteristicTypeModel
 * @return {Object}
    *   @func initialize
 */

export default {
  name: "SamplingParameterInputView",
  props: ['container', 'sampleMediaModel', 'characteristicTypeModel', 'providers'],
  components:{
      DateValidator,
      InputValidationView,
      PortalValidators,
      PortalViews
  },
  methods: {
      initialize() {
        let sampleMedia = this.container.querySelector('#sampleMedia');
        let sampleMediaBasic = document.querySelector('#sampleMediaBasic');
        let characteristicType = this.container.querySelector('#characteristicType');
        let characteristicTypeBasic = document.querySelector('#charGroupBasic');
        let characteristicName = this.container.querySelector('#characteristicName');
        let projectCode = this.container.querySelector('#project-code');
        let pcode = this.container.querySelector('#pCode');
        let minresults = this.container.querySelector('#minresults');
        let startDate = this.container.querySelector('#startDateLo');
        let endDate = this.container.querySelector('#startDateHi');
        let startDateBasic = document.querySelector('#startDateLoBasic');
        let endDateBasic = document.querySelector('#startDateHiBasic');
        var minActivitiesInput = this.container.querySelector('#min-activities');

        let fetchSampleMedia = this.sampleMediaModel.fetch();
        let fetchCharacteristicType = this.characteristicTypeModel.fetch();
        let fetchComplete = Promise.all([fetchSampleMedia, fetchCharacteristicType]);

        let dateValidatorClass = Vue.extend(DateValidator);
        const datevalidator = new dateValidatorClass();
        let initSampleMedia = getAnchorQueryValues(sampleMedia.getAttribute('name'));
        let initSampleMediaBasic = getAnchorQueryValues(sampleMediaBasic.getAttribute('name'));
        let initChargroup = getAnchorQueryValues(characteristicType.getAttribute('name'));
        let initChargroupBasic = getAnchorQueryValues(characteristicTypeBasic.getAttribute('name'));

        fetchSampleMedia.then(() => {
            portalViews.codeSelect(
                "getSampleMediaState",
                "getSampleMediaOptionsState",
                sampleMedia,
                {
                    model : this.sampleMediaModel
                },
                {},
                initSampleMedia,
                this.providers
            );
            portalViews.codeSelect(
                "getSampleMediaState",
                "getSampleMediaOptionsState",
                sampleMediaBasic,
                {
                    model : this.sampleMediaModel
                },
                {},
                initSampleMediaBasic,
                this.providers
            );
        });
        fetchCharacteristicType.then(() => {
            portalViews.codeSelect(
                "getChargroupState",
                "getChargroupOptionsState",
                characteristicType,
                {
                    model : this.characteristicTypeModel
                },
                {},
                initChargroup,
                this.providers
            );
            portalViews.codeSelect(
                "getChargroupState",
                "getChargroupOptionsState",
                characteristicTypeBasic,
                {
                    model : this.characteristicTypeModel
                },
                {},
                initChargroupBasic,
                this.providers
            );
        });

        initializeInput(pcode);
        initializeInput(minresults);
        initializeInput(minActivitiesInput);
        initializeInput(startDate);
        initializeInput(endDate);
        initializeInput(startDateBasic);
        initializeInput(endDateBasic);

        let portalValidatorsClass = Vue.extend(PortalValidators);
        let portalValidators = new portalValidatorsClass();
        let positiveIntValidator = portalValidators.positiveIntValidator;

        let inputValidationView = Vue.extend(InputValidationView);
        // Add input validations and reformatting handlers
        let inputMinResults = new inputValidationView();
        inputMinResults.initialize({
            inputEl : minresults,
            validationFnc : positiveIntValidator
        });
        let inputStartDate = new inputValidationView();
        inputStartDate.initialize({
            inputEl: startDate,
            validationFnc: function (value) {
                return datevalidator.validate(value);
            },
            updateFnc: function (value) {
                return datevalidator.format(value, true);
            }
        });
        let inputEndDate = new inputValidationView();
        inputEndDate.initialize({
            inputEl: endDate,
            validationFnc: function(value) {
                return datevalidator.validate(value)
            },
            updateFnc: function (value) {
                return datevalidator.format(value, false);
            }
        });
        let minActivitiesVal = new inputValidationView();
        minActivitiesVal.initialize({
            inputEl: minActivitiesInput,
            validationFnc: positiveIntValidator
        });

        return fetchComplete;
    },
    resetContainer() {
        let inputs = this.container.querySelectorAll('input[name], select[name], textarea[name], button[name]');
        inputs.forEach(function(input){
            input.value = '';
            input.dispatchEvent(new Event('change'));
        })
    }
  }
}
</script>