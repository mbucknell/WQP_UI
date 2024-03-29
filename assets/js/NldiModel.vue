<template>
</template>

<script>
import find from 'lodash/find';

const huc12FeatureSource = {
    id : 'huc12pp',
    text : 'HUC 12 pour points',
    mapLayer : L.tileLayer.wms(Config.WQP_MAP_GEOSERVER_ENDPOINT + 'wms', {
        layers:'fpp',
        styles : 'pour_points',
        format : 'image/png',
        transparent : true,
        zIndex : 20
    }),
    getFeatureInfoSource : {
        endpoint : Config.WQP_MAP_GEOSERVER_ENDPOINT + 'wms',
        layerName : 'qw_portal_map:fpp',
        featureIdProperty : 'HUC_12'
    }
};

const nwisSitesFeatureSource = {
    id : 'nwissite',
    text : 'Active NWIS stream gages',
    mapLayer : L.tileLayer.wms(Config.WQP_MAP_GEOSERVER_ENDPOINT + 'wms', {
        layers: 'qw_portal_map:nwis_sites',
        styles: 'nwis_sites',
        format : 'image/png',
        transparent : true,
        zIndex : 20
    }),
    getFeatureInfoSource : {
        endpoint : Config.WQP_MAP_GEOSERVER_ENDPOINT + 'wms',
        layerName : 'qw_portal_map:nwis_sites',
        featureIdProperty : 'siteId'
    }
};

const FEATURE_SOURCES = [nwisSitesFeatureSource, huc12FeatureSource];

const NAVIGATION_MODES = [
    {id : 'UM', text : 'Upstream main'},
    {id : 'DM', text : 'Downstream main'},
    {id : 'UT', text : 'Upstream with tributaries'},
    {id : 'DD', text : 'Downstream with diversions'}
];

const DISTANCE = 'distance';

let modelData;

export default {
  name: "NldiModel",
  methods: {
    reset() {
        modelData = {
            featureSource : nwisSitesFeatureSource, // should be one of FEATURE_SOURCES
            featureId : '',
            navigation : undefined, // Should be one of NAVIGATION_MODES
            distance : ''
        };
    },
    getData () {
        return modelData;
    },
    getFeatureSource() {
        return FEATURE_SOURCES;
    },
    getNavModes(){
        return NAVIGATION_MODES;
    },
    setData(property, value) {
        modelData[property] = value;
    },
    setFeatureSource(featureSourceId) {
        modelData.featureSource = find(FEATURE_SOURCES, function(source) {
            return source.id === featureSourceId;
        });
    },
    setDataFromUrl(url) {
        if (url.indexOf(Config.NLDI_SERVICES_ENDPOINT) !== 0) {
            return;
        }
        const nldiUri = url.slice(Config.NLDI_SERVICES_ENDPOINT.length, url.indexOf('?')).split('/');
        if (nldiUri.length !== 5) {
            return;
        }
        this.setFeatureSource(nldiUri[0]);
        modelData.featureId = nldiUri[1];
        modelData.navigation = find(NAVIGATION_MODES, (mode) => mode.id === nldiUri[3]);

        const queryParams = url.slice(url.indexOf('?'));
        /* This assumes that distance is the only URL query parameter */
        modelData.distance = queryParams.slice(queryParams.indexOf(DISTANCE) + DISTANCE.length + 1);
    },
    getUrl(dataSource) {
        let result = '';

        if (modelData.featureSource && modelData.featureId && modelData.navigation) {
            const dataSourceString = dataSource ? '/' + dataSource : '';
            const distanceParameter = modelData.distance ? `distance=${modelData.distance}` : 'distance=9999';
            result = `${Config.NLDI_SERVICES_ENDPOINT}${modelData.featureSource.id}/${modelData.featureId}/` +
                `navigate/${modelData.navigation.id}${dataSourceString}?f=json&${distanceParameter}`;
        }
        return result;
    },
    initialize() {
        this.reset();
    }
  }
}
</script>