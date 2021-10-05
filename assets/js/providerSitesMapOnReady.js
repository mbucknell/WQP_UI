import sitesMap from './providerSitesMap';


document.addEventListener("DOMContentLoaded", function() {
    sitesMap({mapDivId: 'sites-map', mapZoom: 3});
});
