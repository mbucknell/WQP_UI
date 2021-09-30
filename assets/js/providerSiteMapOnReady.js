import NldiMapping from './NldiMapping.vue';
import siteMap from './providerSiteMap';
import Vue from 'vue';

document.addEventListener("DOMContentLoaded", function() {
    var site = Config.site;
    var latitude = site.LatitudeMeasure;
    var longitude = site.LongitudeMeasure;
    var map = siteMap(latitude, longitude, {mapDivId : 'site-map', mapZoom: 10});
    
    let nldiMappingClass = Vue.extend(NldiMapping);
    let nldiMapping = new nldiMappingClass();
    nldiMapping.addOverlays(map);
});
