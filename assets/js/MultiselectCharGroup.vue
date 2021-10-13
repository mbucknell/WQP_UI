<template>
 <div>
    <select :multiple="true" class="hidden-input" name="charGroup">
      <option v-for="option in chargroup" :value="option" selected></option>
    </select>
    <multiselect v-model="chargroupValue" @input="updateSelected" tag-placeholder="All Characteristic Groups" placeholder="All Characteristic Groups" aria-label="Input box for characteristic groups parameter" label="text" track-by="id" select-label="" :max-height="200" :options="chargroupOptions" :multiple="true" :taggable="true">
      <span slot="noOptions">Type to search</span>
      <span slot="noResult">No results found</span>
    </multiselect>
  </div>
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
      chargroup: [],
    }
  },
  methods: {
    updateSelected(value) {
      this.chargroupValue = value;
      let self = this;
      this.chargroup = [];
      if(this.chargroupValue[0] !== undefined){
        this.chargroupValue.forEach(function(value){
          self.chargroup.push(value.id);
        })
      }else{
        this.chargroup = [];
      }
      this.$store.commit("getChargroupState", this.chargroupValue);
    },
    updateOptions(value) {
      this.chargroupOptions = value;
    },
  },
  watch: {
    "$store.state.chargroupSelectedState": {
      deep: true,
      handler(){
        this.updateSelected(this.$store.state.chargroupSelectedState);
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
