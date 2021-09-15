<template>
</template>

<script>
import filter from 'lodash/filter';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import has from 'lodash/has';
import map from 'lodash/map';
import log from 'loglevel';

import { getHeaders } from './utils';
import axios from 'axios';

/*
 *
 * @params -
 *          @prop {String} codes - Used in the ajax url to retrieve the data
 *          @prop {String} keyParameter - the parameter name to use to retrieve the appropriate data subset
 *          @prop {Function} parseKey - function takes a lookup item and returns a string for the key it represents.
 * @returns {CodesWithKeys}
 *          @prop {Function} fetch
 *          @prop {Function} getAll
 *          @prop {Function} getAllKeys
 *          @prop {Function} getDataForKey
 *
 */

export default {
  name: "CodesWithKeysModel",
  data(){
      return {
          cachedData: [],
          HEADERS: getHeaders(),
      }
  }, 
  props: ['codes', 'keyParameter', 'parseKey'],
  methods: {
    /* Each object where each value is an array of objects with properties id, desc, and providers */

    /*
     * @param {Array of String} keys - the set of keys to be used when retrieving the lookup codes
     * @returns {Promise}
     *      @resolve {Array of Objects} - each object is a lookup with id, desc, and providers properties.
     *      @reject {String} descriptive error string
     */
    fetch(keys) {
        var resolvePromise;
        var rejectPromise;
        var fetchDeferred = new Promise(function(resolve, reject){
            resolvePromise = resolve;
            rejectPromise = reject;
        });
        var URL = Config.CODES_ENDPOINT + '/' + this.codes;
        let self = this;

        axios.get(URL + '?' + this.keyParameter + '=' + keys.join(';'), {
            headers: this.HEADERS,
            params : {
                mimeType: 'json'
            }
        })
        .then(function (data) {
            self.cachedData = map(keys, (key) => {
                var filtered = filter(data.data.codes, (lookup) => {
                    return self.parseKey(lookup.value) === key;
                });
                return {
                    key: key,
                    data: map(filtered, (lookup) => {
                        return {
                            id: lookup.value,
                            desc: has(lookup, 'desc') && lookup.desc ? lookup.desc : lookup.value, // defaults to value
                            providers: lookup.providers
                        };
                    })
                };
            });
            resolvePromise(self.getAll());
        })
        .catch(function(jqXHR, textStatus, error) {
            log.error('Can\'t get ' + self.codes + ', Server error: ' + error);
            rejectPromise(error);
        })
        return fetchDeferred;
    },
    /*
     * @return {Array of Object} - Object has id, desc, and providers string properties
     */
    getAll() {
        var all = map(this.cachedData, 'data');
        return flatten(all);
    },
    /*
     * @return {Array of String}
     */
    getAllKeys() {
        return map(this.cachedData, 'key');
    },
    /*
     * @return {Array of Objects} - Each object is a lookup with id, desc, and providers properties. Return undefined if that key
     * is not in the model
     */
    getDataForKey(key) {
        var isMatch = (object) => {
            return object.key === key;
        };
        var lookup = find(this.cachedData, isMatch);
        if (lookup) {
            return lookup.data;
        } else {
            return undefined;
        }
    }
  }
}
</script>