<template>
    <multiselect v-model="orgIDValue" @input="updateSelected" tag-placeholder="All Organization IDs" name="organization" placeholder="All Organization IDs" aria-label="Input box for organization ID parameter" label="text" track-by="id" select-label="" :max-height="200" :options="orgIDOptions" :multiple="true" :taggable="true">
      <span slot="noOptions">Type to search</span>
      <span slot="noResult">No results found</span>
    </multiselect>
</template>

<script>
import Vue from 'vue';
import Multiselect from 'vue-multiselect';

export default {
  name: "MultiselectOrgID",
  components: {
    "multiselect": Multiselect.Multiselect
  },
  data () {
    return {
      orgIDValue: [],
      orgIDOptions: [],
    }
  },
  methods: {
    updateSelected(value) {
      this.orgIDValue = value;
      this.$store.commit("getOrgIDState", value);
    },
    updateOptions(value) {
      this.orgIDOptions = value;
    }
  },
  watch: {
    "$store.state.orgIDSelectedState": {
      deep: true,
      handler(){
        this.updateSelected(this.$store.state.orgIDSelectedState);
      }
    },
    "$store.state.orgIDOptionsState": {
      deep: true,
      handler(){
        this.updateOptions(this.$store.state.orgIDOptionsState);
      }
    },
  }
}
</script>
