<template>
</template>

<script>
/* global Option */

import dialogTemplate from './hbTemplates/identifyDialog.hbs';


// Only show this many features in the dialog. Also use alternative download based on the bounding box of the
// features that are shown.
const FEATURE_LIMIT = 50;

const SITE_ID_PARAMETER = 'siteid';
const NORTH_ID = '#north';
const SOUTH_ID = '#south';
const WEST_ID = '#west';
const EAST_ID = '#east';

/*
 * Update popup identify contents to contain features.
 *
 * @param {L.Popup} popup
 * @param {Object} features - response from a GetFeature request
 */

export default {
  name: "IdentifyDialog",
  methods: {
    showIdentifyPopup  = function({map, popup, atLatLng, features}) {

        if (features.features.length) {
            const exceedsFeatureLimit = features.features.length > FEATURE_LIMIT;
            const context = {
                features: features.features,
                FEATURE_LIMIT: FEATURE_LIMIT,
                exceedsFeatureLimit: exceedsFeatureLimit
            };
            popup.setContent(dialogTemplate(context)).setLatLng(atLatLng);
            map.openPopup(popup);
            document.getElementById('identify-populate-button').onclick = function() {
                if (exceedsFeatureLimit) {
                    document.getElementById(SOUTH_ID).value = features.bbox[0];
                    document.getElementById(WEST_ID).value = features.bbox[1];
                    document.getElementById(NORTH_ID).value = features.bbox[2];
                    let element = document.getElementById(EAST_ID).value = features.bbox[3];
                    element.dispatchEvent(new Event('change'));
                } else {
                    let siteIdSelect = document.querySelector(`select[name="${SITE_ID_PARAMETER}"]`);
                    siteIdSelect.value = '';
                    features.features.forEach((f) => {
                        let option = new Option(f.properties.name, f.properties.name, true, true);

                        siteIdSelect.appendChild(option).dispatchEvent(new Event('change'));
                        siteIdSelect.dispatchEvent(new Event(('select2:select')));
                    });

                }
            });
        } else {
            map.closePopup(popup);
        }
    },
  }
}
</script>