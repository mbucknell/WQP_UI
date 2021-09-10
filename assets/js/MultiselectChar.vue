<template>
    <multiselect v-model="charValue" tag-placeholder="All Characteristics" placeholder="All Characteristics" aria-label="Input box for characteristics parameter" label="text" track-by="id" :options="charOptions" :multiple="true" :taggable="true"></multiselect>
</template>

<script>
import Vue from 'vue';
import Multiselect from 'vue-multiselect';

export default {
  name: "MultiselectChar",
  components: {
    "multiselect": Multiselect.Multiselect
  },
  data () {
    return {
      charValue: [],
      charOptions: [],
    }
  },
  methods: {
    updateSelected(value) {
      this.charValue = value;
    },
    updateOptions(value) {
      this.charOptions = value;
    }
  },
  watch: {
    "$store.state.charSelectedState": {
      deep: true,
      handler(){
        this.updateSelected(this.$store.state.charSelectedState);
      }
    },
    "$store.state.charOptionsState": {
      deep: true,
      handler(){
        this.updateOptions(this.$store.state.charOptionsState);
      }
    },
  }
}
</script>
