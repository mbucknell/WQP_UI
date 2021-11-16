<template>
  <div>
    <select :multiple="true" class="hidden-input" name="countrycode">
      <option v-for="option in country" :value="option" selected></option>
    </select>
    <multiselect v-model="countryValue" @input="updateSelected" tag-placeholder="All Countries" placeholder="All Countries" aria-label="Input box for country parameter" label="text" track-by="id" select-label="" :max-height="200" :options="countryOptions" :multiple="true" :taggable="true">
      <span slot="noOptions">Type to search</span>
      <span slot="noResult">No results found</span>
    </multiselect>
  </div>
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
      country: []
    };
  },
  methods: {
    updateSelected(value) {
      this.countryValue = value;
      let self = this;
      this.country = [];
      if(this.countryValue[0] !== undefined){
        this.countryValue.forEach(function(value){
          self.country.push(value.id);
        });
      } else {
        this.country = [];
      }
      this.$store.commit('getCountryState', value);
    },
    updateOptions(value) {
      this.countryOptions = value;
    }
  },
  watch: {
    '$store.state.countryOptionsState': {
      deep: true,
      handler(){
        this.updateOptions(this.$store.state.countryOptionsState);
      }
    },
    '$store.state.countrySelectedState': {
      deep: true,
      handler(){
        this.updateSelected(this.$store.state.countrySelectedState);
      }
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
