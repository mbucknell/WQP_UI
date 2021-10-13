<template>
  <div>
    <select :multiple="true" class="hidden-input" name="countycode">
      <option v-for="option in county" :value="option" selected></option>
    </select>
    <multiselect v-model="countyValue" @input="updateSelected" tag-placeholder="All Counties" placeholder="All Counties" aria-label="Input box for county parameter" label="text" track-by="id" select-label="" :max-height="200" :options="countyOptions" :multiple="true" :taggable="true">
      <span slot="noOptions">Type to search</span>
      <span slot="noResult">No results found</span>
    </multiselect>
  </div>
</template>

<script>
import Vue from 'vue';
import Multiselect from 'vue-multiselect';

export default {
  name: "MultiselectCounty",
  components: {
    "multiselect": Multiselect.Multiselect
  },
  data () {
    return {
      countyValue: [],
      countyOptions: [],
      county: [],
    }
  },
  methods: {
    updateSelected(value) {
      this.countyValue = value;
      let self = this;
      this.county = [];
      if(this.countyValue[0] !== undefined){
        this.countyValue.forEach(function(value){
          self.county.push(value.id);
        })
      }else{
        this.county = [];
      }
      this.$store.commit("getCountyState", this.countyValue);
    },
    updateOptions(value) {
      this.countyOptions = value;
    },
  },
  watch: {
    "$store.state.countySelectedState": {
      deep: true,
      handler(){
        this.updateSelected(this.$store.state.countySelectedState);
      }
    },
    "$store.state.countyOptionsState": {
      deep: true,
      handler(){
        this.updateOptions(this.$store.state.countyOptionsState);
      }
    },
  }
}
</script>
