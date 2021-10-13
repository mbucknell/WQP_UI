<template>
 <div>
    <select :multiple="true" class="hidden-input" name="project">
      <option v-for="option in projID" :value="option" selected></option>
    </select>
    <multiselect v-model="projIDValue" @input="updateSelected" open-direction="bottom" label="text" track-by="id" placeholder="All Project IDs" aria-label="Input box for project ID parameter" select-label="" :options="projIDOptions" :multiple="true" :searchable="true" :loading="isLoading" :internal-search="false" :clear-on-select="false" :close-on-select="false" :max-height="200" :hide-selected="true" @search-change="onchange">
      <span slot="noOptions">Type to search</span>
      <span slot="noResult">No results found</span>
    </multiselect>
  </div>
</template>

<script>
import Vue from 'vue';
import Multiselect from 'vue-multiselect';
import axios from 'axios';
import log from 'loglevel';
import map from 'lodash/map';
import includes from 'lodash/includes';
import { getAnchorQueryValues} from './utils';

export default {
  name: "MultiselectProjID",
  components: {
    "multiselect": Multiselect.Multiselect
  },
  props: ["providers"],
  data () {
    return {
      projIDValue: [],
      projIDOptions: [],
      isLoading: false,
      filters: [],
      filterString: '',
      projID: [],
    }
  },
  methods: {
    updateSelected(value) {
      this.projIDValue = value;
      let self = this;
      this.projID = [];
      if(this.projIDValue[0] !== undefined){
        this.projIDValue.forEach(function(value){
          self.projID.push(value.id);
        })
      }else{
        this.projID = [];
      }
      this.$store.commit("getProjIDState", value);
    },
    updateOptions(value) {
      this.projIDOptions = value;
    },
    formatData(data){
      var desc = data.hasOwnProperty('desc') && data.desc ? data.desc
            : data.value;
        return desc + ' (' + this.providers.formatAvailableProviders(data.providers) + ')';
    },
    onchange(value) {
      this.isLoading = true;
      let self = this;

      axios.get(Config.CODES_ENDPOINT + '/' + "project",
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

        self.projIDOptions = results;

        self.isLoading = false;
      })
      .catch(function(jqXHR, textStatus, error) {
          log.error('Can\'t  get ' + self.codes + ', Server error: ' + error);
          self.isLoading = false;
      })
    },
    getInitValues(values) {
      let selectedValue = [];
      let self = this;

      values.forEach(function(value){
        axios.get(Config.CODES_ENDPOINT + '/' + "project",
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
      let projectName = document.querySelector('#project-code');
      let initValues = getAnchorQueryValues(projectName.getAttribute('name'));
      if (initValues.length > 0){
          self.getInitValues(initValues);
      }

      // Get initial options
      this.onchange('');
    },
    "$store.state.projIDSelectedState": {
      deep: true,
      handler(){
        this.updateSelected(this.$store.state.projIDSelectedState);
      }
    },
  }
}
</script>
