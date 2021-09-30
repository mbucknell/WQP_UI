import has from 'lodash/has';

import NldiModel from '../../../js/NldiModel.vue';
import { shallowMount } from '@vue/test-utils';

describe('nldiModel', function() {
    let wrapper;

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

    beforeEach(() => {
        wrapper = shallowMount(NldiModel);
        wrapper.vm.reset();
    });

    it('Expects that the modelData.getData initially returns an object containing the default properties', function() {
        var data = wrapper.vm.getData();

        expect(has(data, 'featureSource')).toBe(true);
        expect(has(data, 'featureId')).toBe(true);
        expect(has(data, 'navigation')).toBe(true);
        expect(has(data, 'distance')).toBe(true);

        expect(data.featureSource.id).toEqual('nwissite');
        expect(data.featureId).toBeFalsy();
        expect(data.navigation).toBeFalsy();
        expect(data.distance).toBeFalsy();
    });

    it('Expects that setData updates the property passed in', function() {
        wrapper.vm.setData('featureId', '1234');

        expect(wrapper.vm.getData().featureId).toEqual('1234');

        wrapper.vm.setData('navigation', NAVIGATION_MODES[1]);

        expect(wrapper.vm.getData().navigation).toEqual(NAVIGATION_MODES[1]);

        wrapper.vm.setData('newProp', 'this');

        expect(wrapper.vm.getData().newProp).toEqual('this');
    });

    it('Expects that featureSource is updated with the specified feature source id when setFeatureSource is used', function() {
        var featureSource;
        wrapper.vm.setFeatureSource('huc12pp');
        featureSource = wrapper.vm.getData().featureSource;
        expect(featureSource.id).toEqual('huc12pp');
        expect(featureSource.text).toEqual(FEATURE_SOURCES[1].text);
        expect(featureSource.mapLayer).toEqual(FEATURE_SOURCES[1].mapLayer);
        expect(featureSource.getFeatureInfoSource).toEqual(FEATURE_SOURCES[1].getFeatureInfoSource);
    });

    it('Expects that reset returns the model to it\'s initial state', function() {
        var data;
        wrapper.vm.setData('featureId', '1234');
        wrapper.vm.setData('navigation', NAVIGATION_MODES[1]);
        wrapper.vm.setData('newProp', 'this');
        wrapper.vm.reset();
        data = wrapper.vm.getData();

        expect(has(data, 'featureSource')).toBe(true);
        expect(has(data, 'featureId')).toBe(true);
        expect(has(data, 'navigation')).toBe(true);
        expect(has(data, 'distance')).toBe(true);
        expect(has(data, 'newProp')).toBe(false);

        expect(data.featureSource.id).toEqual('nwissite');
        expect(data.featureId).toBeFalsy();
        expect(data.navigation).toBeFalsy();
        expect(data.distance).toBeFalsy();
    });

    it('Expects getUrl without a data source parameter to return an NLDI query url', function() {
        wrapper.vm.setData('featureSource', FEATURE_SOURCES[0]);
        wrapper.vm.setData('featureId', 'USGS-01010101');
        wrapper.vm.setData('navigation', NAVIGATION_MODES[2]);
        wrapper.vm.setData('distance', 12);

        expect(wrapper.vm.getUrl())
            .toEqual(`${Config.NLDI_SERVICES_ENDPOINT}nwissite/USGS-01010101/navigate/UT?f=json&distance=12`);
    });

    it('Expects getUrl with a data source parameter adds that to the NLDI query url', function() {
        wrapper.vm.setData('featureSource', FEATURE_SOURCES[0]);
        wrapper.vm.setData('featureId', 'USGS-01010101');
        wrapper.vm.setData('navigation', NAVIGATION_MODES[2]);
        wrapper.vm.setData('distance', 12);

        expect(wrapper.vm.getUrl('dsSource'))
            .toEqual(`${Config.NLDI_SERVICES_ENDPOINT}nwissite/USGS-01010101/navigate/UT/dsSource?f=json&distance=12`);
    });

    it('Expects getUrl without a distance parameter contains the distance query parameter 9999', function() {
        wrapper.vm.setData('featureSource', FEATURE_SOURCES[0]);
        wrapper.vm.setData('featureId', 'USGS-01010101');
        wrapper.vm.setData('navigation', NAVIGATION_MODES[2]);

        expect(wrapper.vm.getUrl('dsSource'))
            .toEqual(`${Config.NLDI_SERVICES_ENDPOINT}nwissite/USGS-01010101/navigate/UT/dsSource?f=json&distance=9999`);
    });

    it('Expects setUrl will set the appropriate model elements', () => {
        wrapper.vm.setDataFromUrl(`${Config.NLDI_SERVICES_ENDPOINT}nwissite/USGS-01010101/navigate/UT/dsSource?f=json&distance=12`);

        let data = wrapper.vm.getData();
        expect(data.featureSource.id).toEqual('nwissite');
        expect(data.featureId).toEqual('USGS-01010101');
        expect(data.navigation.id).toEqual('UT');
        expect(data.distance).toEqual('12');

        wrapper.vm.setDataFromUrl(`${Config.NLDI_SERVICES_ENDPOINT}nwissite/USGS-01010101/navigate/UT/dsSource?f=json&distance=`);
        data = wrapper.vm.getData();
        expect(data.featureSource.id).toEqual('nwissite');
        expect(data.featureId).toEqual('USGS-01010101');
        expect(data.navigation.id).toEqual('UT');
        expect(data.distance).toEqual('');
    });

    it('Expects the model to not be updated if the URL can not be parsed', () => {
        wrapper.vm.setDataFromUrl(`${Config.NLDI_SERVICES_ENDPOINT}nwissite/navigate/UT/dsSource?f=json&distance=`);

        let data = wrapper.vm.getData();
        expect(data.featureSource.id).toEqual('nwissite');
        expect(data.featureId).toBeFalsy();
        expect(data.navigation).toBeFalsy();
        expect(data.distance).toBeFalsy();
    });
});
