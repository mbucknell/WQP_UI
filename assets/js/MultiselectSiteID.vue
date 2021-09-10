<template>
    <multiselect v-model="siteIDValue" tag-placeholder="All Site IDs" placeholder="All Site IDs" aria-label="Input box for site ID parameter" label="text" track-by="id" :options="siteIDOptions" :multiple="true" :taggable="true"></multiselect>
</template>

<script>
import Vue from 'vue';
import Multiselect from 'vue-multiselect';

export default {
  name: "MultiselectSiteID",
  components: {
    "multiselect": Multiselect.Multiselect
  },
  data () {
    return {
      siteIDValue: [],
      siteIDOptions: [],
    }
  },
  methods: {
    updateSelected(value) {
      this.siteIDValue = value;
    },
    updateOptions(value) {
      this.siteIDOptions = value;
    }
  },
  watch: {
    "$store.state.siteIDSelectedState": {
      deep: true,
      handler(){
        this.updateSelected(this.$store.state.siteIDSelectedState);
      }
    },
    "$store.state.siteIDOptionsState": {
      deep: true,
      handler(){
        this.updateOptions(this.$store.state.siteIDOptionsState);
      }
    },
  }
}
</script>
