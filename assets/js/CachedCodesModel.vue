<template>
</template>

<script>
import find from 'lodash/find';
import has from 'lodash/has';
import map from 'lodash/map';
import log from 'loglevel';

import axios from 'axios';

/*
 * @param {Object} options
 *      @prop {String} codes - String used in the url to retrieve the model's data.
 * @returns {CachedCodes}
 *      @prop {Function} fetch
 *      @prop {Function} getAll
 *     @prop {Function} getLookups
 */

export default {
  name: "CachedCodesModel",
  data(){
      return {
          cachedData: []
      }
  }, 
  props: ['codes'],
  methods: {
    /*
        * @return {Promise}.
        *      @resolve {Array of Objects} - Each object has String properties: id, desc, and providers.
        *      @reject {String} - the error message.
        */
    fetch() {
        var resolvePromise;
        var rejectPromise;
        var fetchDeferred = new Promise(function(resolve, reject){
            resolvePromise = resolve;
            rejectPromise = reject;
        });
        var URL = Config.CODES_ENDPOINT + '/' + this.codes;
        let self = this;

        axios.get(URL, {
            params : {
                mimeType: 'json'
            }
        })
        .then(function (data) {
            self.cachedData = map(data.data.codes, (code) => {
                return {
                    id: code.value,
                    desc: has(code, 'desc') && code.desc ? code.desc : code.value, // defaults to value
                    providers: code.providers
                };
            });
            resolvePromise(self.cachedData);
        })
        .catch(function(jqXHR, textStatus, error) {
            log.error('Can\'t  get ' + self.codes + ', Server error: ' + error);
            rejectPromise(error);
        })
        return fetchDeferred;
    },
    /*
    * @returns {Array of Objects} - Each object has String properties: id, desc, and providers. This is the
    * same object that is returned with the last successfully fetch.
    */
    getAll() {
        return this.cachedData;
    },
    /*
    * @returns {Object} - The object in the model with the matching id property. Object contains id, desc, and providers
    *      properties. Return undefined if no object exists
    */
    getLookup(id) {
        return find(this.cachedData, function (lookup) {
            return lookup.id === id;
        });
    }
  }
}
</script>