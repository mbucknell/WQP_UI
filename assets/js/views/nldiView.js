import log from 'loglevel';
import partial from 'lodash/partial';

import NldiNavPopupView from './nldiNavPopupView';
import * as nldiModel from '../nldiModel';
import { getAnchorQueryValues } from '../utils';
import axios from 'axios';

/*
 * Creates the NHLD map.
 * The map is shown/hidden by clicking the Hide/Show Upstream Downstream Mapper button.
 * The map also contains the Navigation selector.
 * @param {Object} options
 *      @prop {String} mapDivId
 *      @prop {String} input
 */
export default class NldiView {
    constructor({mapDivId, input}) {
        this.mapDivId = mapDivId;
        this.input = null;
        if (document.getElementById(input) !== null){
            this.input = document.getElementById(input);
        }

        this.mapDiv = document.getElementById(mapDivId);

        /* Functions return a geoJson layer with predefined options for flowLine and site layers respectively */
        this.flowlineLayer = partial(L.geoJson);
        this.siteLayer = partial(L.geoJson, partial.placeholder, {
            pointToLayer: function (featureData, latlng) {
                return L.circleMarker(latlng, {
                    radius: 5,
                    fillColor: '#ff3300',
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }
        });

        // Add change handler for the hidden input so the NLDI can be cleared on a reset
        if (this.input !== null){
            this.input.addEventListener('change', () => {
                if (!this.input.value) {
                    this.clearHandler();
                }
            });
        }

        // Add click event to show/hide nldi map
        if (document.getElementById("showNldiMap") !== null){
            document.getElementById("showNldiMap").onclick = this.showMap.bind(this);
        }
    }

    getRetrieveMessage() {
        const nldiData = nldiModel.getData();
        return '<p>Retrieving sites ' + nldiData.navigation.text.toLowerCase() + (nldiData.distance ? ' ' + nldiData.distance + ' km' : '') + '.</p>';
    }

    cleanUpMaps() {
        if (this.nldiSiteCluster) {
            this.nldiSiteCluster.clearLayers();
            this.map.removeLayer(this.nldiSiteCluster);
        }
        if (this.nldiFlowlineLayers) {
            this.map.removeLayer(this.nldiFlowlineLayers);
        }

        this.updateNldiInput('');
    }

    updateNldiInput(url) {
        // Only trigger a change if non-null url or if the input.val is being changed from an url to null
        if (url || this.input.value) {
            this.input.value = url
            let e = new Event('change')
            this.input.dispatchEvent(e);
        }
    }

    /*
     * @param {L.Point} point - This is the containerPoint where we are looking for a feature from the pour point endpoint
     * @returns $Deferred.promise
     *      @resolve - Returns {Object} - the json data received from the request
     *      @reject - If unable to fetch the pour point
     */
    fetchFeatureId(point) {
        const mapBounds = this.map.getBounds();
        const nldiFeatureSource = nldiModel.getData().featureSource.getFeatureInfoSource;
        return axios({
            method: 'get',
            url: nldiFeatureSource.endpoint,
            params : {
                version: '1.3.0',
                request: 'GetFeatureInfo',
                service: 'wms',
                layers : nldiFeatureSource.layerName,
                srs : 'EPSG:4326',
                bbox : mapBounds.getSouth() + ',' + mapBounds.getWest() + ',' + mapBounds.getNorth() + ',' + mapBounds.getEast(),
                width : this.map.getSize().x,
                height : this.map.getSize().y,
                'info_format' : 'application/json',
                'query_layers' : nldiFeatureSource.layerName,
                i : point.x,
                j : point.y
            }
        });
    }


    /*
     * Retrieve the NLDI sites and flow lines for the current state of nldiModel and
     * display them on both the this.insetMap and map.
     */
    updateNldiSites() {
        const nldiSiteUrl = nldiModel.getUrl('wqp');
        const nldiFlowlinesUrl = nldiModel.getUrl();
        let self = this;
        let responsesArray = [];
        const nldiSiteRequest = axios.get(nldiSiteUrl);
        const nldiFlowlinesRequest = axios.get(nldiFlowlinesUrl);

        if (nldiSiteUrl) {
            this.mapDiv.style.cursor = 'progress';
            axios.all([nldiSiteRequest, nldiFlowlinesRequest])
                .then(axios.spread((...responses) => {
                    responsesArray.push(responses[0]);
                    responsesArray.push(responses[1]);
                }))
                .then(function(){
                    let flowlineBounds;
                    const sitesGeojson = responsesArray[0].data;
                    const flowlinesGeojson = responsesArray[1].data;

                    // These layers go into the siteCluster layer
                    const nldiSiteLayers = self.siteLayer(sitesGeojson);

                    log.debug('NLDI service has retrieved ' + sitesGeojson.features.length + ' sites.');
                    self.map.closePopup();

                    self.nldiFlowlineLayers = self.flowlineLayer(flowlinesGeojson);
                    self.map.addLayer(self.nldiFlowlineLayers);

                    flowlineBounds = self.nldiFlowlineLayers.getBounds();
                    self.map.fitBounds(flowlineBounds);

                    self.nldiSiteCluster = L.markerClusterGroup({
                        maxClusterRadius : 40
                    });

                    self.nldiSiteCluster.addLayer(nldiSiteLayers);
                    self.map.addLayer(self.nldiSiteCluster);

                    self.updateNldiInput(nldiModel.getUrl('wqp'));
                    // Update the api query urls
                    $('#params').trigger('change');
                })
                .catch(function (error) {
                    // handle error
                    self.map.openPopup('Unable to retrieve NLDI information', self.map.getCenter());
                    self.updateNldiInput('');
                })
                .then(function () {
                    // always executed
                    self.mapDiv.style.cursor = '';
                })
        }
    }

    /*
     * Leaflet mouse event handler to find the sites associated with the feature source at the location in the event.
     * Popups are used to tell the user if an error occurred in the process. If a feature source is located, the popup
     * displayed will allow the user to perform an NLDI navigation using parameters entered in the popup.
     *
     * @param {L.MouseEvent} ev
     */
    findSitesHandler(ev) {
        const featureIdProperty = nldiModel.getData().featureSource.getFeatureInfoSource.featureIdProperty;

        log.debug('Clicked at location: ' + ev.latlng.toString());
        this.mapDiv.style.cursor = 'progress';

        nldiModel.setData('featureId', '');
        nldiModel.setData('navigation', undefined);
        nldiModel.setData('distance', '');
        this.cleanUpMaps();
        this.map.closePopup();

        this.fetchFeatureId(ev.containerPoint.round())
            .then((result) => {
                let features = result.data.features;
                const navHandler = () => {
                    this.map.openPopup(this.getRetrieveMessage(), ev.latlng);
                    this.updateNldiSites();
                };

                if (features.length === 0) {
                    this.map.openPopup('<p>No query point has been selected. Please click on a point to query from.</p>', ev.latlng);

                } else if (features.length > 1) {
                    this.map.openPopup('<p>More than one query point has been selected. Please zoom in and try again.</p>', ev.latlng);
                } else {
                    nldiModel.setData('featureId',
                        features[0].properties[featureIdProperty]);

                    new NldiNavPopupView(this.map, features[0], ev.latlng, navHandler);
                }
            })
            .catch((error) => {
                this.map.openPopup('<p>Unable to retrieve points, service call failed</p>', ev.latlng);
            })
            .then(() => {
                this.mapDiv.style.cursor = '';
            });
    }

    /*
     * Show the full size map
     */
    showMap() {
        if (this.mapDiv.parentElement.style.display =='none' || this.mapDiv.parentElement.style.display == ""){
            this.mapDiv.parentElement.style.display = 'block';
            this.map.invalidateSize();
            document.getElementById("showNldiMap").innerText = "Hide upstream downstream mapper"
        }
        else{
            this.hideMap();
        }
        this.map.closePopup();
    }

    /*
     * Hide the map
     */
    hideMap() {
            this.mapDiv.parentElement.style.display ='none'
            document.getElementById("showNldiMap").innerText = "Show upstream downstream mapper"
    }

    featureSourceChangeHandler(ev) {
        this.cleanUpMaps();
        this.map.closePopup();
        nldiModel.setFeatureSource(ev.currentTarget.children[0].value);
    }

    clearHandler() {
        nldiModel.reset();
        this.cleanUpMaps();
        this.map.closePopup();
        // Update the api query urls
        $('#params').trigger('change');
    }

    /*
     * Initialize the map.
     */
    initialize() {
        const initValues = getAnchorQueryValues(this.input.getAttribute('name'));

        const baseLayers = {
            'World Gray' : L.esri.basemapLayer('Gray'),
            'World Topo' : L.tileLayer.provider('Esri.WorldTopoMap'),
            'World Street' : L.tileLayer.provider('Esri.WorldStreetMap'),
            'World Relief' : L.tileLayer.provider('Esri.WorldShadedRelief'),
            'World Imagery' : L.tileLayer.provider('Esri.WorldImagery')
        };
        const hydroLayer = L.esri.tiledMapLayer({
            url : Config.HYDRO_LAYER_ENDPOINT
        });
        const nhdlPlusFlowlineLayer = L.tileLayer.wms(Config.NHDPLUS_FLOWLINE_ENDPOINT,
            {
                layers : Config.NHDPLUS_FLOWLINE_LAYER_NAME,
                format : 'image/png',
                transparent : true,
                opacity : 0.5
            }
        );

        const featureSourceSelectControl = L.control.featureSourceSelectControl({
            changeHandler : this.featureSourceChangeHandler.bind(this),
            featureSourceOptions : nldiModel.FEATURE_SOURCES,
            initialFeatureSourceValue : nldiModel.getData().featureSource.id
        });

        const undoImg = Config.STATIC_ENDPOINT;

        const searchControl = L.control.searchControl(Config.GEO_SEARCH_API_ENDPOINT);
        const clearControl = L.easyButton('<img src="' + undoImg + '/img/usa-icons/undo.svg" alt="reset"/><div id="resetText">Reset</div>', this.clearHandler.bind(this), 'Clear the sites', {
            position: 'topright'
        });

        const MapWithSingleClickHandler = L.Map.extend({
            includes : L.singleClickEventMixin()
        });

        this.map = new MapWithSingleClickHandler(this.mapDivId, {
            center: [37.0, -100.0],
            zoom : 3,
            layers : [baseLayers['World Topo'], hydroLayer, nhdlPlusFlowlineLayer],
            zoomControl : false
        });

        this.map.addControl(searchControl);
        this.map.addControl(featureSourceSelectControl);
        this.map.addControl(L.control.layers(baseLayers, {
            'NHDLPlus Flowline Network' : nhdlPlusFlowlineLayer,
            'Hydro Reference' : hydroLayer
        }, {position: 'topleft'}));
        this.map.addControl(clearControl);
        this.map.addControl(L.control.zoom());

        this.map.addSingleClickHandler(this.findSitesHandler.bind(this));

        if (initValues.length === 1) {
            nldiModel.setDataFromUrl(initValues[0]);
            this.updateNldiSites();
        }
    }
}
