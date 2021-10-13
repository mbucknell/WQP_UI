<template>
  <div>
    <select :multiple="true" class="hidden-input" name="organization">
      <option v-for="option in orgID" :value="option" selected></option>
    </select>
    <multiselect v-model="orgIDValue" @input="updateSelected" tag-placeholder="All Organization IDs" placeholder="All Organization IDs" aria-label="Input box for organization ID parameter" label="text" track-by="id" select-label="" :max-height="200" :options="orgIDOptions" :multiple="true" :taggable="true">
      <span slot="noOptions">Type to search</span>
      <span slot="noResult">No results found</span>
    </multiselect>
  </div>
</template>

<script>
import Vue from 'vue';
import Multiselect from 'vue-multiselect';

export default {
  name: "MultiselectOrgID",
  components: {
    "multiselect": Multiselect.Multiselect
  },
  data () {
    return {
      orgIDValue: [],
      orgIDOptions: [],
      orgID: [],
    }
  },
  methods: {
    updateSelected(value) {
      this.orgIDValue = value;
      let self = this;
      this.orgID = [];
      if(this.orgIDValue[0] !== undefined){
        this.orgIDValue.forEach(function(value){
          self.orgID.push(value.id);
        })
      }else{
        this.orgID = [];
      }
      this.$store.commit("getOrgIDState", value);
    },
    updateOptions(value) {
      this.orgIDOptions = value;
    }
  },
  watch: {
    "$store.state.orgIDSelectedState": {
      deep: true,
      handler(){
        this.updateSelected(this.$store.state.orgIDSelectedState);
      }
    },
    "$store.state.orgIDOptionsState": {
      deep: true,
      handler(){
        this.updateOptions(this.$store.state.orgIDOptionsState);
      }
    },
  }
}
</script>
