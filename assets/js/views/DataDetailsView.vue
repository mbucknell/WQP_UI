<template>
</template>

<script>
import { setEnabled, initializeInput, getAnchorQueryValues } from '../utils';


/*
 * Manages the data detail inputs view
 * @param {Object} options
 *      @prop {NodeList} $container - The div where the data detail inputs are contained
 *      @func updateResultTypeAction - called whenever the result-type radio buttons are changed
 *          @param {String} resultType - the checked radio button's value
 * @return {Object}
 *      @func initialize
 *      @func getResultType
 *      @func getMimeType
 */

export default {
  name: "DataDetailsView",
  props: ['container', 'updateResultTypeAction'],
  methods: {
        /*
     * Initializes the widgets and sets up the DOM event handlers.
     */
    initialize() {
        let site = this.container.querySelector('#sites');
        let biosamples = this.container.querySelector('#biosamples');
        let narrowResults = this.container.querySelector('#narrowsamples');
        let activity = this.container.querySelector('#activity-input');

        let sorted = this.container.querySelector('#sorted');
        let hiddenSorted = this.container.querySelector('input[type="hidden"][name="sorted"]');
        let mimeTypeRadioboxes = this.container.querySelector('input[name="mimeType"]');
        let resultTypeRadioboxes = this.container.querySelector('input.result-type');
        console.log(resultTypeRadioboxes)


        initializeInput(hiddenSorted);
        const sortedInitValues = getAnchorQueryValues(hiddenSorted.getAttribute('name'));
        if (sortedInitValues.length) {
            sorted.checked = sortedInitValues[0] === 'yes';
        }
        const mimeTypeInitValues = getAnchorQueryValues(mimeTypeRadioboxes.getAttribute('name'));
        if (mimeTypeInitValues.length) {
            this.container.querySelector(`input[value="{mimeTypeInitValues[0]}"]`).checked = true;
        }

        mimeTypeRadioboxes.addEventListener('change', () => {
            this.updateResultTypeAction(this.getResultType());
        });

        resultTypeRadioboxes.addEventListener('change', (event) => {
            const node = event.currentTarget;
            const resultType = document.querySelector(node).value;
            let dataProfile = this.container.querySelector('input[name="dataProfile"]');

            // Uncheck previously checked button
            console.log(node)
            this.container.querySelector('input.result-type:checked:not('+ node + '))').checked = false;

            // If activity, biological results or narrow results desired add a hidden input to set the
            // dataProfile, otherwise remove it.
            dataProfile.remove();
            if (biosamples.checked) {
                this.container.appendChild('<input type="hidden" name="dataProfile" value="biological" />');
            } else if (narrowResults.checked){
                this.container.appendChild('<input type="hidden" name="dataProfile" value="narrowResult" />');
            } else if (activity.checked) {
                this.container.appendChild('<input type="hidden" name="dataProfile" value="activityAll" />');
            }

            this.updateResultTypeAction(resultType);
        });

        sorted.onchange = function () {
            const val = sorted.checked ? 'yes' : 'no';
            hiddenSorted.value = val;
            hiddenSorted.dispatchEvent(new Event('change'));
        };

        hiddenSorted.onchange = () => {
            if (!hiddenSorted.value) {
                sorted.prop.checked = false;
            }
        };
    },
    resetContainer() {
        let inputs = this.container.querySelector('input[name], select[name], textarea[name], button[name]');

        this.container.querySelector('input.result-type:checked').checked = false;
        document.querySelector('#sites').checked = true;
        document.querySelector('#basic-sites').checked = true;
        document.querySelector('#csv').checked = true;
        document.querySelector('#sorted').checked = false;
        document.querySelector('#hidden-sorted').value = '';
        document.querySelector('input[name="dataProfile"]').remove();
        setEnabled(this.container.querySelector('input[name="mimeType"]'), true);
        inputs.dispatchEvent(new Event('change'));
    },
    getResultType() {
        return this.container.querySelector('input.result-type:checked').value;
    },
    getMimeType() {
        return this.container.querySelector('input[name="mimeType"]:checked').value;
    }
  },
}
</script>