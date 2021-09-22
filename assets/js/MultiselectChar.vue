<template>
    <multiselect v-model="charValue" @input="updateSelected" name="characteristicName" label="text" track-by="id" placeholder="All Characteristics" aria-label="Input box for characteristics parameter" :options="charOptions" :multiple="true" :searchable="true" :loading="isLoading" :internal-search="false" :clear-on-select="false" :close-on-select="false" :max-height="600" :show-no-results="false" :hide-selected="true" @search-change="onchange">
      <span slot="noOptions">Type to search</span>
      <span slot="noResult">No results found</span>
    </multiselect>
</template>

<script>
import Vue from 'vue';
import Multiselect from 'vue-multiselect';
import axios from 'axios';
import log from 'loglevel';
import map from 'lodash/map';

export default {
  name: "MultiselectChar",
  components: {
    "multiselect": Multiselect.Multiselect,
  },
  props: ['providers'],
  data () {
    return {
      charValue: [],
      charOptions: [],
      isLoading: false,
    }
  },
  methods: {
    updateSelected(value) {
      this.charValue = value;
      this.$store.commit("getCharState", value);
    },
    updateOptions(value) {
      this.charOptions = value;
    },
    onchange(value) {
      this.isLoading = true;
      let self = this;

      let formatData = function (data) {
          var desc = data.hasOwnProperty('desc') && data.desc ? data.desc
              : data.value;
          return desc + ' (' + self.providers.formatAvailableProviders(data.providers) + ')';
      };

      axios.get(Config.CODES_ENDPOINT + '/' + "characteristicname",
      { params:
          {
              text: value,
              pagesize: 20,
              // pagenumber: params.page,
              mimeType: 'json'
          }
      })
      .then(function (data) {
        var results = map(data.data.codes, (code) => {
            return {
                id: code.value,
                text: formatData(code),
            };
        });

        self.charOptions = results;

        self.isLoading = false;
      })
      .catch(function(jqXHR, textStatus, error) {
          log.error('Can\'t  get ' + self.codes + ', Server error: ' + error);
          self.isLoading = false;
      })
    }
  },
}
</script>
