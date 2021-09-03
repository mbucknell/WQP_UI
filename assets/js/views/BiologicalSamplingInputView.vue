<template>
</template>

<script>
import { CodeSelect, PagedCodeSelect } from './portalViews';
import { getAnchorQueryValues} from '../utils';

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
  props: ['container', 'assemblageModel'],
  methods: {
      initialize() {
        var assemblage = this.container.querySelector('#assemblage');
        var taxonomicName = this.container.querySelector('#subject-taxonomic-name');

        var fetchAssemblageModel = this.assemblageModel.fetch();
        var fetchComplete = Promise.all([fetchAssemblageModel]);

        fetchAssemblageModel.done(() => {
            new CodeSelect(
                assemblage,
                {
                    model : this.assemblageModel
                },
                {},
                getAnchorQueryValues(assemblage.getAttribute('name'))
            );
        });
        new PagedCodeSelect(
            taxonomicName,
            {
                codes: 'subjecttaxonomicname'
            },
            {
                closeOnSelect : false
            },
            null,
            null,
            getAnchorQueryValues(taxonomicName.getAttribute('name'))
        );

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