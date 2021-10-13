<template>
  <div>
    <select :multiple="true" class="hidden-input" name="sampleMedia">
      <option v-for="option in sampleMedia" :value="option" selected></option>
    </select>
    <multiselect v-model="sampleMediaValue" @input="onchange" tag-placeholder="All Sample Media" placeholder="All Sample Media" aria-label="Input box for sample media parameter" label="text" track-by="id" select-label="" :max-height="200" :options="sampleMediaOptions" :multiple="true" :taggable="true">
      <span slot="noOptions">Type to search</span>
      <span slot="noResult">No results found</span>
    </multiselect>
  </div>
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
      sampleMedia: [],
    }
  },
  methods: {
    updateSelected(value) {
      this.sampleMediaValue = value;
      let self = this;
      this.sampleMedia = [];
      if(this.sampleMediaValue[0] !== undefined){
        this.sampleMediaValue.forEach(function(value){
          self.sampleMedia.push(value.id);
        })
      }else{
        this.sampleMedia = [];
      }
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
