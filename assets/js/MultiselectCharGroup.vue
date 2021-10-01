<template>
    <multiselect v-model="chargroupValue" @input="onchange" name="charGroup" tag-placeholder="All Characteristic Groups" placeholder="All Characteristic Groups" aria-label="Input box for characteristic groups parameter" label="text" track-by="id" select-label="" :max-height="200" :options="chargroupOptions" :multiple="true" :taggable="true">
      <span slot="noOptions">Type to search</span>
      <span slot="noResult">No results found</span>
    </multiselect>
</template>

<script>
import Vue from 'vue';
import Multiselect from 'vue-multiselect';

export default {
  name: "MultiselectCharGroup",
  components: {
    "multiselect": Multiselect.Multiselect
  },
  data () {
    return {
      chargroupValue: [],
      chargroupOptions: [],
    }
  },
  methods: {
    updateSelected(value) {
      this.chargroupValue = value;
    },
    updateOptions(value) {
      this.chargroupOptions = value;
    },
    onchange() {
      this.$store.commit("getChargroupState", this.chargroupValue);
    }
  },
  watch: {
    "$store.state.chargroupSelectedState": {
      deep: true,
      handler(){
        this.updateSelected(this.$store.state.chargroupSelectedState);
        this.onchange();
      }
    },
    "$store.state.chargroupOptionsState": {
      deep: true,
      handler(){
        this.updateOptions(this.$store.state.chargroupOptionsState);
      }
    },
  }
}
</script>
