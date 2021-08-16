import '../../../../js/leafletControls/FeatureSourceSelectControl'; // Needed in order to include in the bundle for the test

describe('leafletControl/FeatureSourceSelectControl', function() {
    var map;
    var testControl;
    var layer1, layer2;
    var changeHandlerSpy;

    beforeEach(function() {
        document.body.innerHTML = '<div id="test-div" style="height: 30px; width: 30px;"></div>';
        map = L.map('test-div', {
            center : [43.0, -100.0],
            zoom: 4
        });

        layer1 = L.circleMarker([43.1, -100.1]);
        layer2 = L.circleMarker([43.2, -100.2]);
        changeHandlerSpy = jasmine.createSpy('changeHandlerSpy');
    });

    afterEach(function() {
        document.body.innerHTML = '';
    });

    describe('Tests without an initialFeatureSourceValue', function() {
        beforeEach(function() {
            testControl = L.control.featureSourceSelectControl({
                changeHandler: changeHandlerSpy,
                featureSourceOptions: [
                    {id: 'source1', text: 'Text1', mapLayer: layer1},
                    {id: 'source2', text: 'Text2', mapLayer: layer2}
                ]
            });
            map.addControl(testControl);
        });

        afterEach(function() {
            if (testControl._map) {
                map.removeControl(testControl);
            }
        });

        it('Expects that the map contains a select control containing the feature source options', function() {
            var select = document.getElementsByClassName('leaflet-nldi-feature-source-control-div')[0].children;

            expect(select.length).toBe(3);
            expect(select[0].id).toBe('nldi-selector-title');
            expect(select[1].className).toBe('usa-radio');
            expect(select[2].className).toBe('usa-radio');

            var radio1 = select[1].children[0].value;
            var radio2 = select[2].children[0].value;
            expect(radio1).toEqual('source1');
            expect(radio2).toEqual('source2');
        });

        it('Expects that the getValue method returns the current value selected', function() {
            var select = document.getElementsByClassName('leaflet-nldi-feature-source-control-div')[0].children;
            expect(testControl.getValue()).toEqual('');

            select[2].children[0].checked = true;
            expect(testControl.getValue()).toEqual('source2');
        });

        it('Expects that a change event calls the changeHandler', function() {
            var selectContainer = document.getElementsByClassName('leaflet-nldi-feature-source-control-div')[0].children[2];
            var select = document.getElementsByClassName('leaflet-nldi-feature-source-control-div')[0].children;
            var event = document.createEvent('HTMLEvents');
            select[2].children[0].checked=true;
            event.initEvent('change', true, false);
            selectContainer.dispatchEvent(event);

            expect(changeHandlerSpy).toHaveBeenCalled();
        });

        it('Expects that the change handler adds the selected layer to the map', function() {
            var selectContainer = document.getElementsByClassName('leaflet-nldi-feature-source-control-div')[0].children[1];
            var select = document.getElementsByClassName('leaflet-nldi-feature-source-control-div')[0].children;
            var event = document.createEvent('HTMLEvents');

            select[1].children[0].checked=true;
            event.initEvent('change', true, false);
            selectContainer.dispatchEvent(event);

            expect(map.hasLayer(layer1)).toBe(true);
            expect(map.hasLayer(layer2)).toBe(false);
        });

        it('Expects that the second call to the change handler removes the first layer and adds the second to the map', function() {
            var selectContainer1 = document.getElementsByClassName('leaflet-nldi-feature-source-control-div')[0].children[1];
            var selectContainer2 = document.getElementsByClassName('leaflet-nldi-feature-source-control-div')[0].children[2];
            var select = document.getElementsByClassName('leaflet-nldi-feature-source-control-div')[0].children;
            var event = document.createEvent('HTMLEvents');

            select[1].children[0].checked=true;
            event.initEvent('change', true, false);
            selectContainer1.dispatchEvent(event);

            select[1].children[0].checked=false;
            select[2].children[0].checked=true;
            event.initEvent('change', true, false);
            selectContainer2.dispatchEvent(event);

            expect(map.hasLayer(layer1)).toBe(false);
            expect(map.hasLayer(layer2)).toBe(true);
        });

        it('Expects that removing the control removes the change event listener', function() {
            spyOn(L.DomEvent, 'removeListener').and.callThrough();

            map.removeControl(testControl);

            expect(L.DomEvent.removeListener).toHaveBeenCalled();
        });

        it('Expects that removing the control removes the displayed feature source layer', function() {
            var selectContainer = document.getElementsByClassName('leaflet-nldi-feature-source-control-div')[0].children[1];
            var select = document.getElementsByClassName('leaflet-nldi-feature-source-control-div')[0].children;
            var event = document.createEvent('HTMLEvents');

            select[1].children[0].checked=true;
            event.initEvent('change', true, false);
            selectContainer.dispatchEvent(event);
            map.removeControl(testControl);

            expect(map.hasLayer(layer1)).toBe(false);
        });
    });

    describe('Tests with an initialFeatureSourceValue', function() {
        beforeEach(function () {
            testControl = L.control.featureSourceSelectControl({
                changeHandler: changeHandlerSpy,
                featureSourceOptions: [
                    {id: 'source1', text: 'Text1', mapLayer: layer1},
                    {id: 'source2', text: 'Text2', mapLayer: layer2}
                ],
                initialFeatureSourceValue: 'source1'
            });
            map.addControl(testControl);
        });

        afterEach(function () {
            if (testControl._map) {
                map.removeControl(testControl);
            }
        });

        it('Expects that the map contains the initial feature source map layer', function() {
            expect(map.hasLayer(layer1)).toBe(true);
        });
    });
});
