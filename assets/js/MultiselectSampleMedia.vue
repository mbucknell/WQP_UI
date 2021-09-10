<template>
    <multiselect v-model="sampleMediaValue" @input="onchange" tag-placeholder="All Sample Media" placeholder="All Sample Media" aria-label="Input box for sample media parameter" label="text" track-by="id" :options="sampleMediaOptions" :multiple="true" :taggable="true"></multiselect>
</template>

<script>
import Vue from 'vue';
import Multiselect from 'vue-multiselect';

export default {
  name: "MultiselectSampleMedia",
  components: {
    "multiselect": Multiselect.Multiselect
  },
  data () {
    return {
      sampleMediaValue: [],
      sampleMediaOptions: [],
    }
  },
  methods: {
    updateSelected(value) {
      this.sampleMediaValue = value;
    },
    updateOptions(value) {
      this.sampleMediaOptions = value;
    },
    onchange() {
      this.$store.commit("getSampleMediaState", this.sampleMediaValue);
    }
  },
  watch: {
    "$store.state.sampleMediaSelectedState": {
      deep: true,
      handler(){
        this.updateSelected(this.$store.state.sampleMediaSelectedState);
        this.onchange();
      }
    },
    "$store.state.sampleMediaOptionsState": {
      deep: true,
      handler(){
        this.updateOptions(this.$store.state.sampleMediaOptionsState);
      }
    },
  }
}
</script>
