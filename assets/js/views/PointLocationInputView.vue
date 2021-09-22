<template>
</template>

<script>
import log from 'loglevel';

import Vue from 'vue';
import InputValidationView from './InputValidationView.vue';

import PortalValidators from '../PortalValidators.vue';
import { initializeInput } from '../utils';

/*
 * Creates a pointLocationInputView object
 * @param {Object} options
 *      @prop {NodeList} container - element where the point location inputs are contained
 * @returns
 *      @func initialize;
 */

export default {
  name: "PointLocationInputView",
  props: ['container'],
  components: {
      InputValidationView,
      PortalValidators
  },
  methods: {
      // GeoLocation easter egg.
    updateMyLocation(lat, lon) {
        var updateInputs = function(position) {
                lat.value = position.coords.latitude;
                lat.dispatchEvent(new Event('change'));
                lon.value = position.coords.longitude;
                lon.dispatchEvent(new Event('change'));
        };

        var displayError = function(err) {
            log.error('ERROR(' + err.code + '): ' + err.message);
            //TODO: Add call to show alert
        };

        window.navigator.geolocation.getCurrentPosition(updateInputs, displayError, {
            timeout: 8000,
            maximumAge: 60000
        });

        return false;
    },
    /*
     * Initializes all widgets and DOM event handlers
     */
    initialize() {
        let portalValidatorsClass = Vue.extend(PortalValidators);
        let portalValidators = new portalValidatorsClass();
        let realNumberValidator = portalValidators.realNumberValidator;
        let inputValidationClass = Vue.extend(InputValidationView)
        let inputValidationView = new inputValidationClass();
        inputValidationView.initialize( {
            inputEl: this.container.querySelector('input[type="text"]'),
            validationFnc: realNumberValidator
        });

        let within = this.container.querySelector('#within');
        let lat = this.container.querySelector('#lat');
        let lon = this.container.querySelector('#long');
        let latBasic = document.querySelector('#latBasic');
        let lonBasic = document.querySelector('#longBasic');

        initializeInput(within);
        initializeInput(lat);
        initializeInput(lon);

        // only give user the option if their browser supports geolocation
        if (window.navigator.geolocation && window.navigator.geolocation.getCurrentPosition) {
            let useMyLocationDiv = this.container.querySelector('#useMyLocation');
            let useMyLocationDivBasic = document.querySelector('#useMyLocationBasic');

            useMyLocationDiv.innerHTML = '<button class="usa-button usa-button--outline" type="button">Use my location</button>';
            useMyLocationDivBasic.innerHTML = '<button class="usa-button usa-button--outline" type="button">Use my location</button>';

            useMyLocationDiv.querySelector('button').onclick = () => {
                this.updateMyLocation(lat, lon);
            };
            useMyLocationDivBasic.querySelector('button').onclick = () => {
                this.updateMyLocation(latBasic, lonBasic);
            };
        }
    },
    resetContainer() {
        let inputs = this.container.querySelector('input[name], select[name], textarea[name], button[name]');
        inputs.value = '';
        inputs.dispatchEvent(new Event('change'));
    }
  }
}
</script>