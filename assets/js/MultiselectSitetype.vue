<template>
  <div>
    <select :multiple="true" class="hidden-input" name="siteType">
      <option v-for="option in sitetype" :value="option" selected></option>
    </select>
    <multiselect v-model="sitetypeValue" @input="updateSelected" tag-placeholder="All Site Types" placeholder="All Site Types" aria-label="Input box for site type parameter" label="text" track-by="id" select-label="" :max-height="200" :options="sitetypeOptions" :multiple="true" :taggable="true">
      <span slot="noOptions">Type to search</span>
      <span slot="noResult">No results found</span>
    </multiselect>
  </div>
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
      sitetype: [],
    }
  },
  methods: {
    updateSelected(value) {
      this.sitetypeValue = value;
      let self = this;
      this.sitetype = [];
      if(this.sitetypeValue[0] !== undefined){
        this.sitetypeValue.forEach(function(value){
          self.sitetype.push(value.id);
        })
      }else{
        this.sitetype = [];
      }
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
