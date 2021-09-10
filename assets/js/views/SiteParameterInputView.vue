<template>
</template>

<script>
import Vue from 'vue'
import InputValidationView from './InputValidationView.vue';
import PortalViews from './PortalViews.vue';
import HucValidator from '../HucValidator.vue';
import { getAnchorQueryValues, initializeInput } from '../utils';

/*
 * Creates a site parameter input view object
 * @param {Object} options
 *      @prop {NodeList} container - element where the site parameter inputs are contained
 *      @prop {CachedCodes} siteTypeModel
 *      @prop {CachedCodes} organizationModel
 * @returns {Object}
 *      @func initialize;
 */

let hucValidatorClass = Vue.extend(HucValidator);
const hucValidator = new hucValidatorClass();

let portalViewClass = Vue.extend(PortalViews);
let portalViews = new portalViewClass();

export default {
  name: "SiteParameterInputView",
  props: ['container', 'siteTypeModel', 'organizationModel'],
  components: {
      HucValidator,
      InputValidationView,
      PortalViews
  },
  methods: {
      /*
     * Initialize the widgets and DOM event handlers
     * @return promise
     *      @resolve - when all models have been fetched successfully
     *      @reject - if any model's fetch failed.
     */
    initialize() {
        const initializeOrganizationSelect = function(select, model) {
            var formatData = function(data) {
                return {
                    id : data.id,
                    text : data.id + ' - ' + data.desc
                };
            };
            var isMatch = function(searchTerm, data) {
                var termMatcher;
                if (searchTerm) {
                    termMatcher = new RegExp(searchTerm, 'i');
                    return termMatcher.test(data.id) || termMatcher.test(data.desc);
                } else {
                    return true;
                }
            };

            portalViews.codeSelect(
                "getOrgIDOptionsState",
                select,
                {
                    model : model,
                    formatData : formatData,
                    isMatch : isMatch
                }, {
                    minimumInputLength: 2,
                    closeOnSelect : false
                },
                getAnchorQueryValues(select.getAttribute('name'))
            );
        };

        const initializeSiteIdSelect = function(select, orgsel) {
            var formatData = function(data) {
                return data.value + ' - ' + data.desc;
            };

            var parametername = 'organizationid';

            portalViews.pagedCodeSelect(
                "getSiteIDOptionsState",
                select,
                {
                    codes: 'monitoringlocation',
                    formatData: formatData
                },
                {
                    minimumInputLength: 2
                },
                orgsel,
                parametername,
                getAnchorQueryValues(select.getAttribute('name'))
            );
        };

        var siteTypeSelect = this.container.querySelector('#siteType');
        var siteTypeSelectBasic = document.querySelector('#siteTypeBasic');
        var organizationSelect = this.container.querySelector('#organization');
        var siteIdSelect = this.container.querySelector('#siteid');
        var hucInput = this.container.querySelector('#huc');

        var fetchSiteType = this.siteTypeModel.fetch();
        var fetchOrganization = this.organizationModel.fetch();
        var fetchComplete = Promise.all([fetchSiteType, fetchOrganization]);

        initializeSiteIdSelect(siteIdSelect, organizationSelect);

        fetchSiteType.then(() => {
            portalViews.codeSelect(
                "getSitetypeOptionsState",
                siteTypeSelect,
                {
                    model : this.siteTypeModel
                },
                {},
                getAnchorQueryValues(siteTypeSelect.getAttribute('name'))
            );
            portalViews.codeSelect(
                "getSitetypeOptionsState",
                siteTypeSelectBasic,
                {
                    model : this.siteTypeModel
                },
                {},
                getAnchorQueryValues(siteTypeSelectBasic.getAttribute('name'))
            );
        });

        fetchOrganization.then(() => {
            initializeOrganizationSelect(organizationSelect, this.organizationModel);
        });

        initializeInput(hucInput);

        let inputValidationClass = Vue.extend(InputValidationView);
        // Add event handlers
        let hucInputVal = new inputValidationClass();
        hucInputVal.initialize({
            inputEl: hucInput,
            validationFnc: hucValidator.validate,
            updateFnc: hucValidator.format
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