import find from 'lodash/find';


/*
 * @constructs
 * @param {Object} options
 *      @prop {String} position - optional defaults to topright
 *      @prop {Function} changeHandler - function which will be passed the change event. The context will
 *          be the context of the control.
 *      @prop {Array of Object} featureSourceOptions - each object in the array represents a NLDI feature source option.
 *          Each object should have three properties:
 *          @prop {String} id - the string to be used as the featureSource in the NLDI query
 *          @prop {String} text - The text to be shown in the selection menu for this featureSource
 *          @prop {String} mapLayer - The layer to be shown on the map when this featureSource is selected.
 *      @prop {String} initialFeatureSourceValue - optional. If set, the control's initial value will be set to this
 *          if it matches one of the featureSourceOptions object's id property.
 */

L.control.FeatureSourceSelectControl = L.Control.extend({
    options: {
        position: 'topright',
        changeHandler : null,
        featureSourceOptions : [],
        initialFeatureSourceValue : ''
    },
    initialize : function(options) {
        var isInitialValueInFeatureSourceOption = function(featureSourceOption) {
            return options.initialFeatureSourceValue === featureSourceOption.id;
        };

        L.setOptions(this, options);
        L.Control.prototype.initialize.apply(this, options);

        this._initialFeatureSourceOption = find(options.featureSourceOptions, isInitialValueInFeatureSourceOption);
        this._featureSourceLayer = undefined;
        this._selectEl = undefined;
        this.selectedArray = [];
    },

    onAdd : function() {
        var container = L.DomUtil.create('div', 'leaflet-nldi-feature-source-control-div');
        container.innerHTML = '<p id="nldi-selector-title">Feature Source</p>';
        var self = this;

        var addOption = function(option) {
            var selected = self._initialFeatureSourceOption && self._initialFeatureSourceOption.id === option.id ? 'checked' : '';
            return '<input class="usa-radio__input" id="' + option.id + '" name= "nldi-selector" type="radio" value="' + option.id + '" ' + selected + '></input><label class="usa-radio__label" for="' + option.id + '">' + option.text +'</label>';
        };

        this.options.featureSourceOptions.forEach((option) => {
            this._selectEl = L.DomUtil.create('div', 'usa-radio', container);
            this._selectEl.innerHTML = addOption(option);

            if (this._initialFeatureSourceOption) {
                this._featureSourceLayer = this._initialFeatureSourceOption.mapLayer;
                this._map.addLayer(this._featureSourceLayer);
            }

            L.DomEvent.addListener(this._selectEl, 'change', this._changeFeatureSourceLayer, this);
            L.DomEvent.disableClickPropagation(this._selectEl);
        })

        container.title = 'Pick a NLDI feature source';

        return container;
    },

    onRemove : function(map) {
        if (this._selectEl) {
            if (this._featureSourceLayer) {
                map.removeLayer(this._featureSourceLayer);
                this._featureSourceLayer = undefined;
            }
            L.DomEvent.removeListener(this._selectEl, 'change', this._changeFeatureSourceLayer);
            this._selectEl = undefined;
        }
    },

    /*
     * @returns {String} - the current value of the select query value
     */
    getValue : function() {
        var result = '';
        if (this._selectEl.children[0].checked) {
            result = this._selectEl.children[0].value;
        }
        return result;
    },

    _changeFeatureSourceLayer : function(ev) {
        var getLayer = function(featureSourceId, featureSourceOptions) {
            var layer;
            for (var i = 0; i < featureSourceOptions.length; i++) {
                if (featureSourceId === featureSourceOptions[i].id) {
                    layer = featureSourceOptions[i].mapLayer;
                    break;
                }
            }
            return layer;
        };

        var newFeatureSourceLayer = getLayer(ev.currentTarget.children[0].value, this.options.featureSourceOptions);
        if (this._featureSourceLayer) {
            this._map.removeLayer(this._featureSourceLayer);
        }
        this._featureSourceLayer = newFeatureSourceLayer;
        if (this._featureSourceLayer) {
            this._map.addLayer(this._featureSourceLayer);
        }

        if (this.options.changeHandler) {
            this.options.changeHandler(ev);
        }
    }
});

L.control.featureSourceSelectControl = function(options) {
    return new L.control.FeatureSourceSelectControl(options);
};
