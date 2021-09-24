<template>
    <multiselect v-model="taxValue" @input="updateSelected" name="subjectTaxonomicName" label="text" track-by="id" placeholder="All Taxonomic Names" aria-label="Second of two input boxes for biological sampling parameters. Input box for taxonomic name parameter." :options="taxOptions" :multiple="true" :searchable="true" :loading="isLoading" :internal-search="false" :clear-on-select="false" :close-on-select="false" :options-limit="200" :max-height="600" :show-no-results="false" :hide-selected="true" @search-change="onchange">
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
import { getAnchorQueryValues} from './utils';

export default {
  name: "MultiselectTax",
  components: {
    "multiselect": Multiselect.Multiselect,
  },
  props: ["providers"],
  data () {
    return {
      taxValue: [],
      taxOptions: [],
      isLoading: false
    }
  },
  methods: {
    updateSelected(value) {
      this.taxValue = value;
      this.$store.commit("getTaxState", value);
    },
    updateOptions(value) {
      this.taxOptions = value;
    },
    formatData(data){
      let desc = data.hasOwnProperty('desc') && data.desc ? data.desc : data.value;
      return desc + ' (' + this.providers.formatAvailableProviders(data.providers) + ')';
    },
    onchange(value) {
      this.isLoading = true;

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
                text: self.formatData(code),
            };
        });

        self.taxOptions = results;

        self.isLoading = false;
      })
      .catch(function(jqXHR, textStatus, error) {
          log.error('Can\'t  get ' + self.codes + ', Server error: ' + error);
          self.isLoading = false;
      })
    },
    getInitValues(values){
      let selectedValue = [];
      let self = this;
      values.forEach(function(value){
        axios.get(Config.CODES_ENDPOINT + '/' + "subjecttaxonomicname",
        { params:
            {
                text: value,
                pagesize: 1,
                mimeType: 'json'
            }
        })
        .then(function (data) {
          let code = data.data.codes[0];
          var results = {
                  id: code.value,
                  text: self.formatData(code),
          };
          selectedValue.push(results);
          if(selectedValue.length === values.length){
            self.updateSelected(selectedValue)
          }
        })
        .catch(function(jqXHR, textStatus, error) {
            log.error('Can\'t  get ' + self.codes + ', Server error: ' + error);
        })
      })
    },
  },
  watch: {
    providers: function(){
      let self = this;
      let taxonomicName = document.querySelector('#subject-taxonomic-name');
      let initValues = getAnchorQueryValues(taxonomicName.getAttribute('name'));
      if (initValues.length > 0){
          self.getInitValues(initValues);
      }    
    },
  }
}
</script>
