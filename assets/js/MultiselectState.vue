<template>
    <multiselect v-model="stateValue" name="statecode" @input="updateSelected" placeholder="All States" aria-label="Input box for state parameter" label="text" track-by="id" :options="stateOptions" :multiple="true" :taggable="true">
      <span slot="noOptions">Type to search</span>
      <span slot="noResult">No results found</span>
    </multiselect>
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
      this.$store.commit("getStateState", value);
    },
    updateOptions(value) {
      this.stateOptions = value;
    },
  },
  watch: {
    "$store.state.stateOptionsState": {
      deep: true,
      handler(){
        this.updateOptions(this.$store.state.stateOptionsState);
      }
    },
    "$store.state.stateSelectedState": {
      deep: true,
      handler(){
        this.updateSelected(this.$store.state.stateSelectedState);
      }
    },
  }
}
</script>
