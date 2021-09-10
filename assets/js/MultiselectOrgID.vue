<template>
    <multiselect v-model="orgIDValue" tag-placeholder="All Organization IDs" placeholder="All Organization IDs" aria-label="Input box for organization ID parameter" label="text" track-by="id" :options="orgIDOptions" :multiple="true" :taggable="true"></multiselect>
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
