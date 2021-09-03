<template>
</template>

<script>

import dialogBodyTemplate from '../hbTemplates/arcGisHelp.hbs';

const HEADER = 'Using WQP Maps with ArcGIS online';

/*
 * @param {NodeList} button - Arc GIS help button
 * @param {NodeList} dialog - Arc GIS help dialog
 * @param {NodeList} siteMapViewContainer - The map view container element
 * @param {Function} getQueryParamArray -
 *      @returns {Array of Objects with name and value properties} - The form's current query parameters.
 */
export default {
  name: "ArcGisOnlineHelpView",
  props: ['button', 'dialog', 'siteMapViewContainer', 'getQueryParamArray'],
  methods: {
        /*
     * Shows the Arc GIS help dialog with the content reflecting the parameters.
     * @param {Array of Objects with name and value properties} - Represents the query parameters that
     *      will be in the dialog
     * @param {String} selectedSld - The SLD string that will be used to in the dialog
     */
    showDialog(queryParams, selectedSld) {

        var hbContext = {
            searchParams: L.WQPSitesLayer.getSearchParams(queryParams),
            style: selectedSld
        };

        this.dialog.querySelector('.modal-body').innerHTML = dialogBodyTemplate(hbContext);
        this.dialog.style.display = "block";
    },
    /*
     * Initialize the Arc GIS online view, initializing content and setting up event handlers as needed.
     */
    initialize() {
        var sldSelect = this.siteMapViewContainer.querySelector('#sld-select-input');

        this.dialog.querySelector('.modal-header h4').innerHTML = HEADER;

        this.button.click(() => {
            var queryParamArray = this.getQueryParamArray();
            var selectedSld = $sldSelect.value;
            this.showDialog(queryParamArray, selectedSld);
        });
    }
  }
}
</script>