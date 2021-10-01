<template>
    <multiselect v-model="charValue" @input="updateSelected" name="characteristicName" label="text" track-by="id" placeholder="All Characteristics" aria-label="Input box for characteristics parameter" select-label="" :options="charOptions" :max-height="200" :multiple="true" :searchable="true" :loading="isLoading" :internal-search="false" :clear-on-select="false" :close-on-select="false" :show-no-results="false" :hide-selected="true" @search-change="onchange">
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
    formatData(data){
      var desc = data.hasOwnProperty('desc') && data.desc ? data.desc
          : data.value;
      return desc + ' (' + this.providers.formatAvailableProviders(data.providers) + ')';
    },
    onchange(value) {
      this.isLoading = true;
      let self = this;

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
                text: self.formatData(code),
            };
        });

        self.charOptions = results;

        self.isLoading = false;
      })
      .catch(function(jqXHR, textStatus, error) {
          log.error('Can\'t  get ' + self.codes + ', Server error: ' + error);
      })
    },
    getInitValues(values) {
      let selectedValue = [];
      let self = this;

      values.forEach(function(value){
        axios.get(Config.CODES_ENDPOINT + '/' + "characteristicname",
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
      });
    }
  },
  watch: {
    providers: function(){
      let self = this;
      let charName = document.querySelector('#characteristicName');
      let initValues = getAnchorQueryValues(charName.getAttribute('name'));
      if (initValues.length > 0){
          self.getInitValues(initValues);
      }
      // Get initial options
      this.onchange('');
    },
    "$store.state.charSelectedState": {
      deep: true,
      handler(){
        this.updateSelected(this.$store.state.charSelectedState);
      }
    },
  }
}
</script>
