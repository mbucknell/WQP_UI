<template>
    <multiselect v-model="projIDValue" @input="updateSelected" name="project" open-direction="bottom" label="text" track-by="id" placeholder="All Project IDs" aria-label="Input box for project ID parameter" :options="projIDOptions" :multiple="true" :searchable="true" :loading="isLoading" :internal-search="false" :clear-on-select="false" :close-on-select="false" :max-height="600" :hide-selected="true" @search-change="onchange">
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
    }
  },
  methods: {
    limitText (count) {
      return `and ${count} other project IDs`
    },
    updateSelected(value) {
      this.projIDValue = value;
      this.$store.commit("getProjIDState", value);
    },
    updateOptions(value) {
      this.projIDOptions = value;
    },
    onchange(value) {
      this.isLoading = true;
      let self = this;
      
      let formatData = function (data) {
          var desc = data.hasOwnProperty('desc') && data.desc ? data.desc
              : data.value;
          return desc + ' (' + self.providers.formatAvailableProviders(data.providers) + ')';
      };

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
                text: formatData(code),
            };
        });

        self.projIDOptions = results;

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
