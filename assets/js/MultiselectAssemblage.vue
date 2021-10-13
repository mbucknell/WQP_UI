<template>
  <div>
    <select :multiple="true" class="hidden-input" name="assemblage">
      <option v-for="option in assemblage" :value="option" selected></option>
    </select>
    <multiselect v-model="assemblageValue" @input="updateSelected" tag-placeholder="All Assemblages" placeholder="All Assemblages" aria-label="First of two input boxes for biological sampling parameters. Input box for assemblage parameter." label="text" track-by="id" select-label="" :max-height="200" :options="assemblageOptions" :multiple="true" :taggable="true">
      <span slot="noOptions">Type to search</span>
      <span slot="noResult">No results found</span>
    </multiselect>
  </div>
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
      assemblage: [],
    }
  },
  methods: {
    updateSelected(value) {
      this.assemblageValue = value;
      let self = this;
      this.assemblage = [];
      if(this.assemblageValue[0] !== undefined){
        this.assemblageValue.forEach(function(value){
          self.assemblage.push(value.id);
        })
      }else{
        this.assemblage = [];
      }
      this.$store.commit("getAssemblageState", value);
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
