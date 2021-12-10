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
          const node = event.currentTarget;
          const mainDataProfile = document.querySelector('#' + node.id).value;
          const subDataProfile = document.querySelector('#' + node.id).dataset['subprofile'];
          store.commit('updateDataProfile', {
            mainProfile: mainDataProfile,
            subProfile: subDataProfile
          });

          const shareContainer = self.form.querySelector('.share-container');
          const shareText = shareContainer.querySelector('textarea');
          const queryParamArray = getQueryParamArray(self.form);
          const queryString = getQueryString(queryParamArray, ['zip', 'csrf_token']);
          window.location.hash = `#${queryString}`;
          shareText.value = window.location.href;

          //  add or remove hidden input so that the server download will have the right params in the form
          const hiddenDataProfile = self.container.querySelector('input[type="hidden"][name="dataProfile"]');
          if (hiddenDataProfile) {
              hiddenDataProfile.remove();
          }
          const subProfile = store.state.dataProfile.subProfile;
          if (subProfile !== '') {
            const hiddenDataProfileNew = document.createElement("input");
            hiddenDataProfileNew.type = "hidden";
            hiddenDataProfileNew.value = subProfile;
            hiddenDataProfileNew.name = "dataProfile";
            self.container.appendChild(hiddenDataProfileNew);
          }
        };

        // update the form action so that the correct dataProfile (formerly called resultType) is used.
        // For example, the default form action attribute value is
        // 'https://www.waterqualitydata.us/data/Station/search', if the user would change the radio buttons
        // for the 'Data Profiles' to 'Project' the form action attribute value would be
        // 'https://www.waterqualitydata.us/data/Project/search'.
        const basicForm = document.querySelector('#params-basic');
        const advancedForm = document.querySelector('#params');
        const dataProfile = store.state.dataProfile.mainProfile;
        basicForm.setAttribute('action', getFormUrl(dataProfile));
        advancedForm.setAttribute('action', getFormUrl(dataProfile));
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