<template>
</template>

<script>
import Vue from 'vue';
import PortalViews from './PortalViews.vue';
import { getAnchorQueryValues} from '../utils';

let portalViewClass = Vue.extend(PortalViews);
let portalViews = new portalViewClass();

/*
 * Creates a sampling parameter input view
 * @param {Object} options
 *      @prop {NodeList} container - element where the biological sampling parameter inputs are contained
 *      @prop {CachedCodes} assemblageModel
 * @return {Object}
 *      @func initialize
 */
export default {
  name: "BiologicalSamplingView",
  props: ['container', 'assemblageModel', 'providers'],
  components: {
      PortalViews
  },
  methods: {
      initialize() {
        var assemblage = this.container.querySelector('#assemblage');
        var taxonomicName = this.container.querySelector('#subject-taxonomic-name');

        var fetchAssemblageModel = this.assemblageModel.fetch();
        var fetchComplete = Promise.all([fetchAssemblageModel]);
        let initValues = getAnchorQueryValues(assemblage.getAttribute('name'));

        fetchAssemblageModel.then(() => {
            portalViews.codeSelect(
                "getAssemblageState",
                "getAssemblageOptionsState",
                assemblage,
                {
                    model : this.assemblageModel
                },
                {},
                initValues,
                this.providers
            );
        });

        return fetchComplete;
    },
    resetContainer() {
        let inputs = this.container.querySelector('input[name], select[name], textarea[name], button[name]');
        inputs.value = '';
        inputs.dispatchEvent(new Event('change'));
    }
  }
}
</script>