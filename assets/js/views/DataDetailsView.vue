<template>
</template>

<script>
import {setEnabled, initializeInput, getAnchorQueryValues, getQueryString, getQueryParamArray, getFormUrl } from '../utils';
import store from "../store/store";

export default {
  name: "DataDetailsView",
  props: {
    container: {
      type: HTMLDivElement,
      required: true
    },
    form: {
      type: HTMLFormElement,
      required: true
    }
  },
  methods: {
        /*
     * Initializes the widgets and sets up the DOM event handlers.
     */
    initialize() {
      let sorted = this.container.querySelector('#sorted');
      let hiddenSorted = this.container.querySelector('input[type="hidden"][name="sorted"]');
      let mimeTypeRadioboxes = document.querySelectorAll('input[name="mimeType"]');
      let dataProfileRadioButtons = document.querySelectorAll('input[name="dataProfileRadioButton"]');

        initializeInput(hiddenSorted);
        const sortedInitValues = getAnchorQueryValues(hiddenSorted.getAttribute('name'));
        if (sortedInitValues.length) {
            sorted.checked = sortedInitValues[0] === 'yes';
        }
        const self = this;
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
            }
        });

      dataProfileRadioButtons.forEach(function(radioButton) {
        radioButton.onchange = (event) => {
          // Get ALL the 'data profile' radio buttons (both the advanced and basic form)
          const node = event.currentTarget;
          const mainDataProfile = document.querySelector('#' + node.id).value;
          const subDataProfile = document.querySelector('#' + node.id).dataset['subprofile'];
          // Note - the mainDataProfile is used in the form action attribute value. For example,
          // 'https://www.waterqualitydata.us/data/Station/search'. If the user changes the radio buttons
          // for the 'Data Profiles' to 'Project' the form action attribute value would be
          // 'https://www.waterqualitydata.us/data/Project/search'. In the form, this represented by the 'value'
          // attribute. The mainDataProfile was previously called 'resultType' in relationship with the underlying services.
          // The subProfile - is used to define the URL parameter 'dataProfile'. For example &dataProfile=narrowResult
          store.commit('updateDataProfile', {
            mainProfile: mainDataProfile,
            subProfile: subDataProfile
          });

          // Update the share URLs (only show in advanced form)
          const shareContainer = self.form.querySelector('.share-container');
          const shareText = shareContainer.querySelector('textarea');
          const queryParamArray = getQueryParamArray(self.form);
          const queryString = getQueryString(queryParamArray, ['zip', 'csrf_token']);
          window.location.hash = `#${queryString}`;
          shareText.value = window.location.href;

          // Add or remove hidden input so that the server download will have the right params in the form
          // Start by grabbing BOTH the basic and advanced forms
          const formArray = [];
          const basicForm = document.querySelector('#params-basic');
          const advancedForm = document.querySelector('#params');
          formArray.push(basicForm, advancedForm);
          formArray.forEach((form) => {
            // Check if there is a hidden form field for the dataProfile (or as noted above subDataProfile)
            const hiddenProfile = form.querySelector('input[type="hidden"][name="dataProfile"]');
            if (hiddenProfile) {
              hiddenProfile.remove();
            }
            const subProfile = store.state.dataProfile.subProfile;
            // If the form radio button is set to a value for which the 'subProfile' is not blank, add a new hidden
            // input so that the data will be sent with the form action submission
            if (subProfile !== '') {
              const hiddenProfileNew = document.createElement("input");
              hiddenProfileNew.type = "hidden";
              hiddenProfileNew.value = subProfile;
              hiddenProfileNew.name = "dataProfile";
              form.appendChild(hiddenProfileNew);
            }

            // Set the form action to use the 'data profile' (called resultType in data from the service calls)
            const dataProfile = store.state.dataProfile.mainProfile;
            form.setAttribute('action', getFormUrl(dataProfile));
          });
        };
    });

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
    setUrlsInShareSection(form) {
      const shareContainer = form.querySelector('.share-container');
      const shareText = shareContainer.querySelector('textarea');
      const queryParamArray = getQueryParamArray(form);
      const queryString = getQueryString(queryParamArray, ['zip', 'csrf_token']);
      window.location.hash = `#${queryString}`;
      shareText.value = window.location.href;
    },
    resetContainer() {
        let inputs = this.container.querySelectorAll('input[name], select[name], textarea[name], button[name]');

        document.querySelector('input.result-type').checked = false;
        document.querySelector('#sites').checked = true;
        document.querySelector('#basic-sites').checked = true;
        document.querySelector('#csv').checked = true;
        document.querySelector('#sorted').checked = false;
        document.querySelector('#hidden-sorted').value = '';
        store.commit('updateMimeType', 'csv');
        store.commit('updateDataProfile', {
          mainProfile: 'Station',
          subProfile: ''
        });
      this.setUrlsInShareSection(this.form);
        setEnabled(document.querySelector('input[name="mimeType"]'), true);
        inputs.forEach(function(input){
            input.dispatchEvent(new Event('change'));
        });
    }
  }
}
</script>