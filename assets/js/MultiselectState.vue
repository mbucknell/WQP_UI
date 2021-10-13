<template>
  <div>
    <select :multiple="true" class="hidden-input" name="statecode">
      <option v-for="option in state" :value="option" selected></option>
    </select>
    <multiselect v-model="stateValue" @input="updateSelected" placeholder="All States" aria-label="Input box for state parameter" label="text" track-by="id" select-label="" :max-height="200" :options="stateOptions" :multiple="true" :taggable="true">
      <span slot="noOptions">Type to search</span>
      <span slot="noResult">No results found</span>
    </multiselect>
  </div>
</template>

<script>
import Vue from 'vue';
import Multiselect from 'vue-multiselect';
import filter from 'lodash/filter';

export default {
  name: "MultiselectState",
  components: {
    "multiselect": Multiselect.Multiselect
  },
  data () {
    return {
      stateValue: [],
      stateOptions: [],
      state: [],
    }
  },
  methods: {
    updateSelected(value) {
      this.stateValue = value;
      let self = this;
      this.state = [];
      if(this.stateValue[0] !== undefined){
        this.stateValue.forEach(function(value){
          self.state.push(value.id);
        })
      }else{
        this.state = [];
      }
      this.$store.commit("getStateState", value);
    },
    updateOptions(value) {
      this.stateOptions = value;
    },
  },
  watch: {
    "$store.state.stateOptionsState": {
      deep: true,
      handler(){
        this.updateOptions(this.$store.state.stateOptionsState);
      }
    },
    "$store.state.stateSelectedState": {
      deep: true,
      handler(){
        this.updateSelected(this.$store.state.stateSelectedState);
      }
    },
  }
}
</script>
