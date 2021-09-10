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
  props: ['container', 'sampleMediaModel', 'characteristicTypeModel'],
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
        var minActivitiesInput = this.container.querySelector('#min-activities');

        let fetchSampleMedia = this.sampleMediaModel.fetch();
        let fetchCharacteristicType = this.characteristicTypeModel.fetch();
        let fetchComplete = Promise.all([fetchSampleMedia, fetchCharacteristicType]);

        let dateValidatorClass = Vue.extend(DateValidator);
        const datevalidator = new dateValidatorClass();

        fetchSampleMedia.then(() => {
            portalViews.codeSelect(
                "getSampleMediaOptionsState",
                sampleMedia,
                {
                    model : this.sampleMediaModel
                },
                {},
                getAnchorQueryValues(sampleMedia.getAttribute('name'))
            );
            portalViews.codeSelect(
                "getSampleMediaOptionsState",
                sampleMediaBasic,
                {
                    model : this.sampleMediaModel
                },
                {},
                getAnchorQueryValues(sampleMediaBasic.getAttribute('name'))
            );
        });
        fetchCharacteristicType.then(() => {
            portalViews.codeSelect(
                "getChargroupOptionsState",
                characteristicType,
                {
                    model : this.characteristicTypeModel
                },
                {},
                getAnchorQueryValues(characteristicType.getAttribute('name'))
            );
            portalViews.codeSelect(
                "getChargroupOptionsState",
                characteristicTypeBasic,
                {
                    model : this.characteristicTypeModel
                },
                {},
                getAnchorQueryValues(characteristicTypeBasic.getAttribute('name'))
            );
        });

        portalViews.pagedCodeSelect(
            "getCharOptionsState",
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
        portalViews.pagedCodeSelect(
            "getProjIDOptionsState",
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

        let portalValidatorsClass = Vue.extend(PortalValidators);
        let portalValidators = new portalValidatorsClass();
        let positiveIntValidator = portalValidators.positiveIntValidator();

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