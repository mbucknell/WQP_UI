<template>
    <multiselect v-model="sitetypeValue" @input="onchange" name="siteType" tag-placeholder="All Site Types" placeholder="All Site Types" aria-label="Input box for site type parameter" label="text" track-by="id" :options="sitetypeOptions" :multiple="true" :taggable="true">
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
    },
    updateOptions(value) {
      this.sitetypeOptions = value;
    },
    onchange() {
      this.$store.commit("getSitetypeState", this.sitetypeValue);
    }
  },
  watch: {
    "$store.state.sitetypeSelectedState": {
      deep: true,
      handler(){
        this.updateSelected(this.$store.state.sitetypeSelectedState);
        this.onchange();
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
