<template>
    <multiselect v-model="countryValue" @input="onchange" tag-placeholder="All Countries" placeholder="All Countries" aria-label="Input box for country parameter" label="text" track-by="id" :options="countryOptions" :multiple="true" :taggable="true"></multiselect>
</template>

<script>
import Vue from 'vue';
import Multiselect from 'vue-multiselect';
import includes from 'lodash/includes';
import filter from 'lodash/filter';

export default {
  name: "MultiselectCountry",
  components: {
    "multiselect": Multiselect.Multiselect
  },
  data () {
    return {
      countryValue: [],
      countryOptions: [],
    }
  },
  methods: {
    updateSelected(value) {
      this.countryValue = value;
    },
    updateOptions(value) {
      this.countryOptions = value;
    },
    onchange() {
      /* update states */
      let countries = this.countryValue;
      const states = this.$store.state.stateOptionsState;
      const isInCountries = function(state) {
          const countryCode = state.id.split(':')[0];
          return includes(countries, countryCode);
      };

      if (!countries) {
          countries = [USA];
      }
      let statesArray = filter(states, isInCountries);
      this.$store.commit("getStateOptionsState", statesArray);
      this.$store.commit("getCountryState", this.countryValue);
    }
  },
  watch: {
    "$store.state.countrySelectedState": {
      deep: true,
      handler(){
        this.updateSelected(this.$store.state.countrySelectedState);
        this.onchange();
      }
    },
    "$store.state.countryOptionsState": {
      deep: true,
      handler(){
        this.updateOptions(this.$store.state.countryOptionsState);
      }
    },
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
