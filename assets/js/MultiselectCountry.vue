<template>
    <multiselect v-model="countryValue" name="countrycode" @input="updateSelected" tag-placeholder="All Countries" placeholder="All Countries" aria-label="Input box for country parameter" label="text" track-by="id" select-label="" :max-height="200" :options="countryOptions" :multiple="true" :taggable="true">
      <span slot="noOptions">Type to search</span>
      <span slot="noResult">No results found</span>
    </multiselect>
</template>

<script>
import Vue from 'vue';
import Multiselect from 'vue-multiselect';
import filter from 'lodash/filter';
import includes from 'lodash/includes';

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
      this.$store.commit("getCountryState", value);
    },
    updateOptions(value) {
      this.countryOptions = value;
    },
  },
  watch: {
    "$store.state.countryOptionsState": {
      deep: true,
      handler(){
        this.updateOptions(this.$store.state.countryOptionsState);
      }
    },
    "$store.state.countrySelectedState": {
      deep: true,
      handler(){
        this.updateSelected(this.$store.state.countrySelectedState);
      }
    },
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
