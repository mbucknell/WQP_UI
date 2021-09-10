<template>
    <multiselect v-model="assemblageValue" tag-placeholder="All Assemblages" placeholder="All Assemblages" aria-label="First of two input boxes for biological sampling parameters. Input box for assemblage parameter." label="text" track-by="id" :options="assemblageOptions" :multiple="true" :taggable="true"></multiselect>
</template>

<script>
import Vue from 'vue';
import Multiselect from 'vue-multiselect';

export default {
  name: "MultiselectAssemblage",
  components: {
    "multiselect": Multiselect.Multiselect
  },
  data () {
    return {
      assemblageValue: [],
      assemblageOptions: [],
    }
  },
  methods: {
    updateSelected(value) {
      this.assemblageValue = value;
    },
    updateOptions(value) {
      this.assemblageOptions = value;
    }
  },
  watch: {
    "$store.state.assemblageSelectedState": {
      deep: true,
      handler(){
        this.updateSelected(this.$store.state.assemblageSelectedState);
      }
    },
    "$store.state.assemblageOptionsState": {
      deep: true,
      handler(){
        this.updateOptions(this.$store.state.assemblageOptionsState);
      }
    },
  }
}
</script>
