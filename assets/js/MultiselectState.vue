<template>
    <multiselect v-model="stateValue" @input="onchange" tag-placeholder="All States" placeholder="All States" aria-label="Input box for state parameter" label="text" track-by="id" :options="stateOptions" :multiple="true" :taggable="true"></multiselect>
</template>

<script>
import Vue from 'vue';
import Multiselect from 'vue-multiselect';
import filter from 'lodash/filter';

export default {
  name: "MultiselectState",
  components: {
    "multiselect": Multiselect.Multiselect
  },
  data () {
    return {
      stateValue: [],
      stateOptions: [],
    }
  },
  methods: {
    updateSelected(value) {
      this.stateValue = value;
    },
    updateOptions(value) {
      this.stateOptions = value;
    },
    onchange() {
      const states = this.stateValue;
      const counties = this.$store.state.countySelectedState;
      const isInStates = function(county) {
          const codes = county.split(':');
          const stateCode = codes[0] + ':' + codes[1];
          return includes(states, stateCode);
      };

      let countyArray = filter(counties, isInStates);
      this.$store.commit("getCountyState", countyArray);
      this.$store.commit("getStateState", states);
    }
  },
  watch: {
    "$store.state.stateSelectedState": {
      deep: true,
      handler(){
        this.updateSelected(this.$store.state.stateSelectedState);
        this.onchange();
      }
    },
    "$store.state.stateOptionsState": {
      deep: true,
      handler(){
        this.updateOptions(this.$store.state.stateOptionsState);
      }
    },
  }
}
</script>
