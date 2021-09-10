<template>
    <multiselect v-model="countyValue" @input="onchange" tag-placeholder="All Counties" placeholder="All Counties" aria-label="Input box for county parameter" label="text" track-by="id" :options="countyOptions" :multiple="true" :taggable="true"></multiselect>
</template>

<script>
import Vue from 'vue';
import Multiselect from 'vue-multiselect';

export default {
  name: "MultiselectCounty",
  components: {
    "multiselect": Multiselect.Multiselect
  },
  data () {
    return {
      countyValue: [],
      countyOptions: [],
    }
  },
  methods: {
    updateSelected(value) {
      this.countyValue = value;
    },
    updateOptions(value) {
      this.countyOptions = value;
    },
    onchange() {
      this.$store.commit("getCountyState", this.countyValue);
    },
  },
  watch: {
    "$store.state.countySelectedState": {
      deep: true,
      handler(){
        this.updateSelected(this.$store.state.countySelectedState);
        this.onchange();
      }
    },
    "$store.state.countyOptionsState": {
      deep: true,
      handler(){
        this.updateOptions(this.$store.state.countyOptionsState);
      }
    },
  }
}
</script>
