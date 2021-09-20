<template>
    <multiselect v-model="taxValue" @input="updateSelected" name="subjectTaxonomicName" label="text" track-by="id" placeholder="All Taxonomic Names" aria-label="Second of two input boxes for biological sampling parameters. Input box for taxonomic name parameter." :options="taxOptions" :multiple="true" :searchable="true" :loading="isLoading" :internal-search="false" :clear-on-select="false" :close-on-select="false" :options-limit="200" :limit="3" :limit-text="limitText" :max-height="600" :show-no-results="false" :hide-selected="true" @search-change="onchange">
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
import providers from './providers.js';

export default {
  name: "MultiselectTax",
  components: {
    "multiselect": Multiselect.Multiselect
  },
  data () {
    return {
      taxValue: [],
      taxOptions: [],
      isLoading: false
    }
  },
  methods: {
    limitText (count) {
      return `and ${count} other taxonomic names`
    },
    updateSelected(value) {
      this.taxValue = value;
      this.$store.commit("getTaxState", value);
    },
    updateOptions(value) {
      this.taxOptions = value;
    },
    onchange(value) {
      this.isLoading = true;

      let formatData = function (data) {
          var desc = data.hasOwnProperty('desc') && data.desc ? data.desc
              : data.value;
          return desc + ' (' + providers.formatAvailableProviders(data.providers) + ')';
      };

      let self = this;
      axios.get(Config.CODES_ENDPOINT + '/' + "subjecttaxonomicname",
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

        self.taxOptions = results;

        self.isLoading = false;
      })
      .catch(function(jqXHR, textStatus, error) {
          log.error('Can\'t  get ' + self.codes + ', Server error: ' + error);
          self.isLoading = false;
      })
    }
  },
  watch: {
  }
}
</script>
