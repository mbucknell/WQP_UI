<template>
</template>

<script>
import filter from 'lodash/filter';

import queryService from '../queryService';
import { getQueryString, toggleShowHideSections } from '../utils';
import SiteMap from '../siteMap';


const MAP_ID = 'query-results-map';
const STATION_RESULTS = 'Station';

/*
 * Managed the Site map and its controls.
 * @param {Object} options
 *      @param {NodeList} container - contains the map and its controls
 *      @param {DownloadProgressDialog} downloadProgressDialog
 *      @param {DownloadFormView} downloadFormView
 * @return {Object}
    *   @func initialize
 */

export default {
  name: "SiteMapView",
  props: ['container', 'downloadProgressDialog', 'downloadFormView', 'providers'],
  methods: {
        /*
     * Initialize the site map and all of it's controls
     */
    initialize() {
        this.portalDataMap = new SiteMap({
            mapDivId : MAP_ID,
            loadingIndicator : this.container.querySelector('#map-loading-indicator'),
            legendDiv : this.container.querySelector('#query-map-legend-div .legend-container'),
            sldSelect : this.container.querySelector('#sld-select-input')
        });

        const mapContainer = this.container.querySelector('#query-map-container');
        const legendContainer = this.container.querySelector('#query-map-legend-div');
        const map = this.container.querySelector('#' + MAP_ID);
        const showHideBtn = this.container.querySelector('.show-hide-toggle');

        // The map div's height should always be set to the height its parent div.
        // OpenLayers will not draw the layer if the height of the map div is not set explictly.
        map.style.height = mapContainer.style.height;
        window.onresize = () => {
            const mapContainerHeight = mapContainer.style.height;

            if (mapContainerHeight !== map.style.height) {
                map.style.height = mapContainerHeight;
            }
        };

        this.portalDataMap.initialize();

        // Add click handler for map show/hide button
        showHideBtn.onclick((event) => {
            const isVisible = toggleShowHideSections(document.querySelector(event.currentTarget), mapContainer);
            if (isVisible) {
                this.portalDataMap.render();
                legendContainer.style.display = "block";
            } else {
                legendContainer.style.display = "none";
            }
        });

        // Add click handler for Show Sites button
        this.container.querySelector('#show-on-map-button').onclick(() => {
            const queryParamArray = this.downloadFormView.getQueryParamArray().filter(param => param.name !== 'csrf_token');
            const queryString = getQueryString(queryParamArray);
            const siteIds = filter(queryParamArray, (param) => {
                return param.name === 'siteid';
            });

            const showMap = (totalCount) => {
                // Show the map if it is currently hidden
                if (mapContainer.hidden) {
                    showHideBtn.dispatchEvent(new Event('click'));
                }

                window._gaq.push([
                    '_trackEvent',
                    'Portal Map',
                    'MapCreate',
                    decodeURIComponent(queryString),
                    parseInt(totalCount)
                ]);

                this.portalDataMap.updateSitesLayer(queryParamArray);
            };

            if (!this.downloadFormView.validateDownloadForm()) {
                return;
            }

            if (siteIds.length > 50) {
                this.downloadProgressDialog.show('map',
                    'Unable to map sites. The query contains too many sites to be mapped. Downloads are still available');
            } else {
                window._gaq.push([
                    '_trackEvent',
                    'Portal Map',
                    'MapCount',
                    decodeURIComponent(queryString)
                ]);


                this.downloadProgressDialog.show('map');
                queryService.fetchQueryCounts(STATION_RESULTS, queryParamArray, this.providers.getIds())
                    .then((counts) => {
                        const fileFormat = 'xml';
                        this.downloadProgressDialog.updateProgress(counts, STATION_RESULTS, fileFormat, showMap);
                    })
                    .catch((message) => {
                        this.downloadProgressDialog.cancelProgress(message);
                    });
            }
        });
    }
  },
}
</script>