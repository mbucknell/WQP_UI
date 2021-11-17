<template>
</template>

<script>
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import log from 'loglevel';

import axios from 'axios';

export default {
  name: "Providers",
  data(){
      return {
          ids: [],
      }
  }, 
  methods: {
          /*
     * @return {promise} which is resolved if the fetch of providers is a success and rejected with the errors
     * message if the request fails.
     */
    fetch() {
        var resolvePromise;
        var rejectPromise;
        var fetchDeferred = new Promise(function(resolve, reject){
            resolvePromise = resolve;
            rejectPromise = reject;
        });

        var URL = Config.CODES_ENDPOINT + '/providers';
        let self = this;

        axios.get(URL, {
            params : {
                mimeType: 'json'
            }
        })
        .then(function (data) {
            self.ids = [];
            data.data.codes.forEach((code) => {
                self.ids.push(code.value);
            });
            resolvePromise();
        })
        .catch(function(jqXHR, textStatus, error) {
            self.ids = [];
            log.error('Unable to retrieve provider list with error: ' + error);
            rejectPromise(jqXHR, error);
        })
        return fetchDeferred;
    },

    /*
     * @return {Array of String} of provider id strings
     */
    getIds() {
        return this.ids;
    },

    /*
     * Parses availableProviders, removes providers that are not in the model. If the string contains all of the ids
     * in the model, then return 'all' otherwise return a comma separated list of the valid providers.
     * @param {String} availableProviders - Space separated list of providers
     * @return {String}
     */
    formatAvailableProviders(availableProviders /* String containing space separated list of providers */) {
        var isValidId = (id) => {
            return includes(this.ids, id);
        };
        var availableList = availableProviders.split(' ');
        var resultList = filter(availableList, isValidId);

        if (resultList.length === this.ids.length) {
            return 'all';
        } else {
            return resultList.join(', ');
        }
    }
  }
}
</script>