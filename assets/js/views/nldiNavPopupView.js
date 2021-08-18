import popupTemplate from '../hbTemplates/nldiFeatureSourcePopup.hbs';
import * as nldiModel from '../nldiModel';


export default class NldiNavPopupView {
    /*
     * Creates a nldi navigation popup onMap. The popup will contain information about the feature
     * and two inputs, a select and distance. When these are changed the nldiModel is updated.
     * when the Navigate button in clicked the navHandler will be called.
     *
     * @param {L.Map} onMap - The map where the popup will be created
     * @param {Object} feature - contains properties that will be displayed on the popup
     * @param {L.LatLng} atLatLng - The popup will be opened at this lat lng
     * #param {Function} navHandler - This event handler will get called when the Navigate button is clicked in the popup.
     */
    constructor(onMap, feature, atLatLng, navHandler) {
        var nldiData = nldiModel.getData();
        var context = {
            nwisSite: nldiData.featureSource.id === 'nwissite',
            pourPoint: nldiData.featureSource.id === 'huc12pp',
            navigationModes: nldiModel.NAVIGATION_MODES,
            feature : feature
        };
        var navButton;

        onMap.openPopup(popupTemplate(context), atLatLng);
        navButton = document.querySelector('.navigation-selection-div button');
        document.querySelector('.navigation-selection-div select').addEventListener('change', function (ev) {
            var selectedValue = ev.target.selectedOptions[0].value;
            var navValue = {
                id: selectedValue,
                text: ev.target.selectedOptions[0].innerText
            };

            nldiModel.setData('navigation', navValue);
            navButton.disabled = !navValue.id;
        });
        document.querySelector('.navigation-selection-div input[type="text"]').addEventListener('change', function (ev) {
            nldiModel.setData('distance', ev.target.value);
        });
        navButton.onclick = navHandler;
    }
}
