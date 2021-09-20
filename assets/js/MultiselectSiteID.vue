<template>
    <multiselect v-model="siteIDValue" @input="updateSelected" name="siteid" label="text" track-by="id" open-direction="bottom" placeholder="All Site IDs" aria-label="Input box for site ID parameter" :options="siteIDOptions" :multiple="true" :searchable="true" :loading="isLoading" :clear-on-select="false" :internal-search="false" :close-on-select="false" :max-height="600" :hide-selected="true" @search-change="onchange">
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
import includes from 'lodash/includes';
import providers from './providers.js';

export default {
  name: "MultiselectSiteID",
  components: {
    "multiselect": Multiselect.Multiselect
  },
  data () {
    return {
      siteIDValue: [],
      siteIDOptions: [],
      isLoading: false,
      filters: [],
      filterString: '',
    }
  },
  methods: {
    updateSelected(value) {
      this.siteIDValue = value;
      this.$store.commit("getSiteIDState", value);
    },
    updateOptions(value) {
      this.siteIDOptions = value;
    },
    getParentParams(parentValue) {
      this.filterString = '?' + parentValue.parametername + '=';
      let self = this;
      //add parentValue to URL, using .join if it is an array and simply appending if a string
      parentValue.values.forEach(function(value){
        self.filterString += value.id + ",";
      });

      return this.filterString;
    },
    addFilters(values, parametername){
      let hasFilter = false;
      if (this.filters.length === 0){
        this.filters.push({values: values, parametername: parametername});
      }else{
        for(let i = 0; i < this.filters.length; i++){
          if (this.filters[i].parametername === parametername){
            hasFilter = true;
            this.filters[i].values = values;
          }
          if(i < this.filters.length -1){
            if (!hasFilter){ 
              this.filters.push({values: values, parametername: parametername});
            }
          }
        };
      }
    },
    onchange(value) {
      this.isLoading = true;
      let self = this;
      let url;
      this.filters.forEach(function(filter) {
        self.getParentParams(filter);
      });
      if (this.filters.length > 0){
        url = Config.CODES_ENDPOINT + '/' + "monitoringlocation" + this.filterString;
        if (this.filterString[this.filterString.length - 1] === ","){
          url = url.slice(0, -1);
        }
      }else{
        url = Config.CODES_ENDPOINT + '/' + "monitoringlocation";
      }

      let formatData = function(data){
        if (data.desc !== undefined){
          return data.value + ' - ' + data.desc;
        }else{
          return data.value
        }
      }

      axios.get(url,
      { params:
          {
              text: value,
              pagesize: 20,
              mimeType: 'json'
          }
      })
      .then(function (data, params) {
        var results = map(data.data.codes, (code) => {
            return {
                id: code.value,
                text: formatData(code),
            };
        });
        
        self.siteIDOptions = results;

        self.isLoading = false;
      })
      .catch(function(jqXHR, textStatus, error) {
          log.error('Can\'t  get ' + self.codes + ', Server error: ' + error);
          self.isLoading = false;
      })
    }
  },
  watch: {
    "$store.state.orgIDSelectedState": {
      deep: true,
      handler(){
        if (this.$store.state.orgIDSelectedState.length > 0){
          this.addFilters(this.$store.state.orgIDSelectedState, "organizationid")
        }else if (this.filterString.includes("organizationid")){
          this.filters = this.filters.filter(filter => filter.parametername !== "organizationid")
        }
      }
    },
  }
}
</script>
