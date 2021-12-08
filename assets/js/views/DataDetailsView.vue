<template>
</template>

<script>
import { setEnabled, initializeInput, getAnchorQueryValues } from '../utils';
import store from "../store/store";

/*
 * Manages the data detail inputs view
 * @param {Object} options
 *      @prop {NodeList} $container - The div where the data detail inputs are contained
 *      @func updateResultTypeAction - called whenever the result-type radio buttons are changed
 *          @param {String} dataProfile - the checked radio button's value
 */

export default {
  name: "DataDetailsView",
  props: {
    container: {
      type: HTMLDivElement,
      required: true
    },
    updateResultTypeAction: {
      type: Function,
      required: true
    }
  },
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
        let mimeTypeRadioboxes = document.querySelectorAll('input[name="mimeType"]');
        // console.log('mimeTypeRadioboxes ', mimeTypeRadioboxes)
      let dataProfileRadioButtons = document.querySelectorAll('input[name="dataProfile"]');
      // console.log('dataProfileRadioButtons ', dataProfileRadioButtons)
        // let resultTypeRadioboxes = document.querySelectorAll('input.result-type');
      // console.log('resultTypeRadioboxes ', resultTypeRadioboxes)
        initializeInput(hiddenSorted);
        const sortedInitValues = getAnchorQueryValues(hiddenSorted.getAttribute('name'));
        if (sortedInitValues.length) {
            sorted.checked = sortedInitValues[0] === 'yes';
        }
        let self = this;
        const mimeTypeInitValues = [];
        mimeTypeRadioboxes.forEach(function(radiobox){
            mimeTypeInitValues.push(getAnchorQueryValues(radiobox.getAttribute('name')));
        });

        mimeTypeInitValues.forEach(function(item) {
            if (item.length) {
                document.querySelector(`input[value="${item[0]}"]`).checked = true;
            }
        });

        mimeTypeRadioboxes.forEach(function(radioButton) {
          radioButton.onclick = () => {
              store.commit('updateMimeType', radioButton.value);
                // self.updateResultTypeAction(self.getResultType());
              self.updateResultTypeAction(store.state.mimeType);
            }
        });

      dataProfileRadioButtons.forEach(function(radioButton) {
        radioButton.onchange = (event) => {
          const node = event.currentTarget;
          const mainDataProfile = document.querySelector('#' + node.id).value;
          const dataName = 'subprofile';
          const subDataProfile = document.querySelector('#' + node.id).dataset[dataName];
          console.log('dataProfile  main ', mainDataProfile)
          console.log('dataProfile  sub ', subDataProfile)
          console.log('here dataprofile before', store.state.dataProfile.mainProfile)
          store.commit('updateDataProfile', {
            mainProfile: mainDataProfile,
            subProfile: subDataProfile
          });
          console.log('here dataprofile after', store.state.dataProfile.mainProfile)
                let dataProfileForURLParam = self.container.querySelector('input[name="dataProfileForURLParam"]');
                // console.log('dataProfileForURLParam ', dataProfileForURLParam)
                // Uncheck previously checked button
                document.querySelectorAll('input.result-type:checked:not(#'+ node.id + ')').forEach(function(input){
                    input.checked = false;
                    input.removeAttribute("checked", "checked")
                });
                // If activity, biological results or narrow results desired add a hidden input to set the
                // dataProfileForURLParam, otherwise remove it.
                // if(dataProfileForURLParam !== null) {
                //   dataProfileForURLParam.remove();
                // }
                // if (biosamples.checked) {
                //   console.log('biosamples')
                //     let newInput = document.createElement("input");
                //   newInput.class = "hidden-input";
                //     newInput.type = "hidden";
                //     newInput.value = "biological";
                //     newInput.name = "dataProfileForURLParam";
                //     self.container.appendChild(newInput);
                // } else if (narrowResults.checked){
                //   console.log('narrowResults')
                //     let newInput = document.createElement("input");
                //   newInput.class = "hidden-input";
                //     newInput.type = "hidden";
                //     newInput.value = "narrowResult";
                //     newInput.name = "dataProfileForURLParam";
                //     self.container.appendChild(newInput);
                // } else if (activity.checked) {
                //   console.log('activity')
                //     let newInput = document.createElement("input");
                //   newInput.class = "hidden-input";
                //     newInput.type = "hidden";
                //     newInput.value = "activityAll";
                //     newInput.name = "dataProfileForURLParam";
                //     self.container.appendChild(newInput);
                // }
                //
                // self.updateResultTypeAction(dataProfile);
            };
        })

        sorted.onchange = function () {
            const val = sorted.checked ? 'yes' : 'no';
            hiddenSorted.value = val;
            hiddenSorted.dispatchEvent(new Event('change'));
        };

        hiddenSorted.onchange = () => {
            if (!hiddenSorted.value) {
                sorted.checked = false;
            }
        };
    },
    resetContainer() {
        let inputs = this.container.querySelectorAll('input[name], select[name], textarea[name], button[name]');

        document.querySelector('input.result-type').checked = false;
        document.querySelector('#sites').checked = true;
        document.querySelector('#basic-sites').checked = true;
        document.querySelector('#csv').checked = true;
        document.querySelector('#sorted').checked = false;
        document.querySelector('#hidden-sorted').value = '';
        if(document.querySelector('input[name="dataProfileForURLParam"]') !== null){
            document.querySelector('input[name="dataProfileForURLParam"]').remove();
        }
        setEnabled(document.querySelector('input[name="mimeType"]'), true);
        inputs.forEach(function(input){
            input.dispatchEvent(new Event('change'));
        });
    },
    // getResultType() {
    //     if (document.querySelector('input.result-type:checked') !== null) {
    //         return document.querySelector('input.result-type:checked').value;
    //     } else {
    //         return null;
    //     }
    // },
    getMimeType() {
        return this.container.querySelector('input[name="mimeType"]:checked').value;
    }
  },
}
</script>