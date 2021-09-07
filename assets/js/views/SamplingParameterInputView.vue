<template>
</template>

<script>
import Vue from 'vue';
import DateValidator from '../DateValidator.vue';
import InputValidationView from './InputValidationView.vue';
import { CodeSelect, PagedCodeSelect } from './portalViews';

import { positiveIntValidator } from '../portalValidators';
import { getAnchorQueryValues, initializeInput } from '../utils';

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
  props: ['container', 'sampleMediaModel', 'characteristicTypeModel'],
  components:{
      DateValidator,
      InputValidationView
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
        var minActivitiesInput = this.container.querySelector('#min-activities');

        let fetchSampleMedia = this.sampleMediaModel.fetch();
        let fetchCharacteristicType = this.characteristicTypeModel.fetch();
        let fetchComplete = Promise.all([fetchSampleMedia, fetchCharacteristicType]);

        let dateValidatorClass = Vue.extend(DateValidator);
        const datevalidator = new dateValidatorClass();

        fetchSampleMedia.then(() => {
            new CodeSelect(
                sampleMedia,
                {
                    model : this.sampleMediaModel
                },
                {},
                getAnchorQueryValues(sampleMedia.getAttribute('name'))
            );
            new CodeSelect(
                sampleMediaBasic,
                {
                    model : this.sampleMediaModel
                },
                {},
                getAnchorQueryValues(sampleMediaBasic.getAttribute('name'))
            );
        });
        fetchCharacteristicType.then(() => {
            new CodeSelect(
                characteristicType,
                {
                    model : this.characteristicTypeModel
                },
                {},
                getAnchorQueryValues(characteristicType.getAttribute('name'))
            );
            new CodeSelect(
                characteristicTypeBasic,
                {
                    model : this.characteristicTypeModel
                },
                {},
                getAnchorQueryValues(characteristicTypeBasic.getAttribute('name'))
            );
        });

        new PagedCodeSelect(
            characteristicName,
            {
                codes: 'characteristicname'
            },
            {
                closeOnSelect : false
            },
            null,
            null,
            getAnchorQueryValues(characteristicName.getAttribute('name'))
        );
        new PagedCodeSelect(
            projectCode,
            {
                codes: 'project'
            },
            {
                closeOnSelect : false
            },
            null,
            null,
            getAnchorQueryValues(projectCode.getAttribute('name'))
        );

        initializeInput(pcode);
        initializeInput(minresults);
        initializeInput(startDate);
        initializeInput(endDate);

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
        let inputs = this.container.querySelector('input[name], select[name], textarea[name], button[name]');
        inputs.value = '';
        inputs.dispatchEvent(new Event('change'));
    }
  }
}
</script>