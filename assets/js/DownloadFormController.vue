<template>
</template>

<script>
export default {
  name: "DownloadFormController",
  methods: {
      validatePointLocation(spec) {
        // spec has the following properties
        //      withinEl, latEl, lonEl : input elements
        // Returns object. The object has a required property isValid. If isValid is false, the
        // object will also contain errorMessage property.
        // Assumes that individual input validation has already been done
        var within = spec.withinEl.value;
        var lat = spec.latEl.value;
        var lon = spec.lonEl.value;

        if (within && lat && lon) {
            return {isValid: true};
        } else if (within || lat || lon) {
            return {
                isValid: false,
                errorMessage: 'In Point Location all parameters must be blank or all parameters must have a non-blank value'
            };
        } else {
            return {isValid: true};
        }
      },
      validateBoundingBox(spec) {
        // spec has the following properites
        //      northEl, southEl, eastEl, westEl : input elements
        // Returns object. The object has a required property isValid. If isValid is false, the
        // object will also contain errorMessage property.
        // Assumes that individual input validation has already been done

        var north = spec.northEl.value;
        var south = spec.southEl.value;
        var east = spec.eastEl.value;
        var west = spec.westEl.value;

        if (north && south && east && west) {
            if (parseFloat(south) >= parseFloat(north)) {
                return {
                    isValid: false,
                    errorMessage: 'In Bounding Box, north must be greater than south'
                };
            } else if (parseFloat(west) >= parseFloat(east)) {
                return {
                    isValid: false,
                    errorMessage: 'In Bounding Box, east must be greater than west'
                };
            } else {
                return {isValid: true};
            }
        } else if (north || south || east || west) {
            return {
                isValid: false,
                errorMessage: 'In Bounding Box, all parameters must be blank or all must have a non-blank value.'
            };
        } else {
            return {isValid: true};
        }
      },
      validateDateRange(spec) {
        // spec has the following properties:
        //      fromDateEl, toDateEl - Input elements
        // Returns object. The object has a required property isValid. If isValid is false, the
        // object will also contain errorMessage property.
        // Assumes that individual input validation has already been done.

        var getDate = function (value) {
            var dateArray = value.split('-');
            return new Date(dateArray[2], dateArray[0] - 1, dateArray[1], 0, 0, 0, 0);
        };

        var fromDateStr = spec.fromDateEl.value;
        var toDateStr = spec.toDateEl.value;

        if (fromDateStr && toDateStr) {
            if (getDate(fromDateStr) < getDate(toDateStr)) {
                return {isValid: true};
            } else {
                return {
                    isValid: false,
                    errorMessage: 'From date must be before to date'
                };
            }
        } else {
            return {isValid: true};
        }
      },
      validateDownloadForm(form, formType) {
        // Validate download form. If invalid show validate dialog with error message and return false.
        // Otherwise return true

        var validateModalEl = document.querySelector('#validate-download-dialog');
        var showModal = function (message) {
            validateModalEl.querySelector('.modal-body').innerHTML = message;
            validateModalEl.style.display = "block";
        };

        // Check to see if any input validation error messages exist
        if (form.querySelector('.error-message') !== null && form.querySelector('.error-message').length > 0) {
            showModal('Need to correct input validation errors on form');
            return false;
        }

        var result;
        //  Advanced form validation
        if(formType == "advanced"){
            result = this.validatePointLocation({
                withinEl: form.querySelector('#within'),
                latEl: form.querySelector('#lat'),
                lonEl: form.querySelector('#long')
            });
            if (!result.isValid) {
                showModal(result.errorMessage);
                return false;
            }

            result = this.validateBoundingBox({
                northEl: form.querySelector('#north'),
                southEl: form.querySelector('#south'),
                eastEl: form.querySelector('#east'),
                westEl: form.querySelector('#west')
            });
            if (!result.isValid) {
                showModal(result.errorMessage);
                return false;
            }

            result = this.validateDateRange({
                fromDateEl: form.querySelector('#startDateLo'),
                toDateEl: form.querySelector('#startDateHi')
            });
            if (!result.isValid) {
                showModal(result.errorMessage);
                return false;
            }

            return true;
        }
        // Basic form validation
        else{
            result = this.validatePointLocation({
                withinEl: form.querySelector('#withinBasic'),
                latEl: form.querySelector('#latBasic'),
                lonEl: form.querySelector('#longBasic')
            });
            if (!result.isValid) {
                showModal(result.errorMessage);
                return false;
            }

            result = this.validateDateRange({
                fromDateEl: form.querySelector('#startDateLoBasic'),
                toDateEl: form.querySelector('#startDateHiBasic')
            });
            if (!result.isValid) {
                showModal(result.errorMessage);
                return false;
            }

            return true;
        }
      }
    }
}
</script>