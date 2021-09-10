<template>
    <multiselect v-model="taxValue" tag-placeholder="All Taxonomic Names" placeholder="All Taxonomic Names" aria-label="Second of two input boxes for biological sampling parameters. Input box for taxonomic name parameter." label="text" track-by="id" :options="taxOptions" :multiple="true" :taggable="true"></multiselect>
</template>

<script>
import Vue from 'vue';
import Multiselect from 'vue-multiselect';

export default {
  name: "MultiselectTax",
  components: {
    "multiselect": Multiselect.Multiselect
  },
  data () {
    return {
      taxValue: [],
      taxOptions: [],
    }
  },
  methods: {
    updateSelected(value) {
      this.taxValue = value;
    },
    updateOptions(value) {
      this.taxOptions = value;
    }
  },
  watch: {
    "$store.state.taxSelectedState": {
      deep: true,
      handler(){
        this.updateSelected(this.$store.state.taxSelectedState);
      }
    },
    "$store.state.taxOptionsState": {
      deep: true,
      handler(){
        this.updateOptions(this.$store.state.taxOptionsState);
      }
    },
  }
}
</script>
