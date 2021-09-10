<template>
</template>

<script>
import Vue from 'vue';
import InputValidationView from './InputValidationView.vue';

import PortalValidators from '../PortalValidators.vue';
import { getAnchorQueryValues } from '../utils';

/*
 * Creates a bounding box input view object
 * @param {Object} options
 *      @prop {NodeList} container - element where the bounding box inputs are contained
 * @returns {Object}
 *      @func initialize;
 */

export default {
  name: "BoundingBoxInputView",
  props: ['container'],
  components: {
      InputValidationView,
      PortalValidators
  },
  methods: {
      /*
     * Initializes all input widgets and DOM event handlers
     */
    initialize() {
        let textInputs = this.container.querySelector('input[type="text"]');
        let north = this.container.querySelector('#north');
        let south = this.container.querySelector('#south');
        let west = this.container.querySelector('#west');
        let east = this.container.querySelector('#east');
        let bbox = this.container.querySelector('input[name="bBox"]');

        let portalValidatorsClass = Vue.extend(PortalValidators);
        let portalValidators = new portalValidatorsClass();
        let realNumberValidator = portalValidators.realNumberValidator();

        let inputValidationClass = Vue.extend(InputValidationView);
        let inputValidationView = new inputValidationClass();
        inputValidationView.initialize({
            inputEl: textInputs,
            validationFnc: realNumberValidator
        });

        const initBboxValues = getAnchorQueryValues('bBox');
        if (initBboxValues.length) {
            const bboxVals = initBboxValues[0].split(',');
            if (bboxVals.length === 4) {
                west.value = bboxVals[0];
                south.value = bboxVals[1];
                east.value = bboxVals[2];
                north.value = bboxVals[3];
                bbox.value = initBboxValues[0];
            }
        }

        //Update bBox hidden input if any of the bounding box text fields are updated
        textInputs.onchange = () => {
            const northVal = north.value;
            const southVal = south.value;
            const eastVal = east.value;
            const westVal = west.value;
            if (northVal && southVal && eastVal && westVal) {
                let bboxVal = `${westVal},${southVal},${eastVal},${northVal}`;
                bbox.value = bboxVal
                bbox.dispatchEvent(new Event('change'));
            } else  {
                bbox.value = '';
                bbox.dispatchEvent(new Event('change'));
            }
        };


    },
    resetContainer() {
        let inputs = this.container.querySelector('input[name], select[name], textarea[name], button[name]');
        inputs.value = '';
        inputs.dispatchEvent(new Event('change'));

        // Also reset text input boxes for bbox
        this.container.querySelector('#north').value = '';
        this.container.querySelector('#south').value = '';
        this.container.querySelector('#west').value = '';
        this.container.querySelector('#east').value = '';

    }
  }
}
</script>