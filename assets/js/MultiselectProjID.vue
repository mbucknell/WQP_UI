<template>
    <multiselect v-model="projIDValue" tag-placeholder="All Project IDs" placeholder="All Project IDs"  aria-label="Input box for project ID parameter" label="text" track-by="id" :options="projIDOptions" :multiple="true" :taggable="true"></multiselect>
</template>

<script>
import Vue from 'vue';
import Multiselect from 'vue-multiselect';

export default {
  name: "MultiselectProjID",
  components: {
    "multiselect": Multiselect.Multiselect
  },
  data () {
    return {
      projIDValue: [],
      projIDOptions: [],
    }
  },
  methods: {
    updateSelected(value) {
      this.projIDValue = value;
    },
    updateOptions(value) {
      this.projIDOptions = value;
    }
  },
  watch: {
    "$store.state.projIDSelectedState": {
      deep: true,
      handler(){
        this.updateSelected(this.$store.state.projIDSelectedState);
      }
    },
    "$store.state.projIDOptionsState": {
      deep: true,
      handler(){
        this.updateOptions(this.$store.state.projIDOptionsState);
      }
    },
  }
}
</script>
