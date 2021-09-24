<template>
    <multiselect v-model="sitetypeValue" @input="updateSelected" name="siteType" tag-placeholder="All Site Types" placeholder="All Site Types" aria-label="Input box for site type parameter" label="text" track-by="id" :options="sitetypeOptions" :multiple="true" :taggable="true">
      <span slot="noOptions">Type to search</span>
      <span slot="noResult">No results found</span>
    </multiselect>
</template>

<script>
import Vue from 'vue';
import Multiselect from 'vue-multiselect';

export default {
  name: "MultiselectSitetype",
  components: {
    "multiselect": Multiselect.Multiselect
  },
  data () {
    return {
      sitetypeValue: [],
      sitetypeOptions: [],
    }
  },
  methods: {
    updateSelected(value) {
      this.sitetypeValue = value;
      this.$store.commit("getSitetypeState", value);
    },
    updateOptions(value) {
      this.sitetypeOptions = value;
    },
  },
  watch: {
    "$store.state.sitetypeSelectedState": {
      deep: true,
      handler(){
        this.updateSelected(this.$store.state.sitetypeSelectedState);
      }
    },
    "$store.state.sitetypeOptionsState": {
      deep: true,
      handler(){
        this.updateOptions(this.$store.state.sitetypeOptionsState);
      }
    },
  }
}
</script>
