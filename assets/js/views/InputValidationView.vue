<template>
</template>

<script>
//
// @params spec has the following properties
//      inputEl - Inputs whose value needs to be validated
//      validationFnc - function takes value. Returns an object with two properties
//          isValid property indicates whether the validation passed and errorMessage
//          contains the errorMessage is the validation did not pass.
//      updateFnc - optional function takes value and returns the formated value. This function
//          can assume that isValid has already been called and value is a valid entry.
//      event - optional. The event that this validation should be triggered on. Defaults to 'change'

export default {
  name: "InputValidationView",
  methods: {
      initialize(spec) {
        var event = spec.event || 'change';

        if(spec.inputEl.length > 1){
            spec.inputEl.forEach(function(el) {
                el.addEventListener(event, function (ev) {
                    var inputValue = el.value;
                    var result = spec.validationFnc(inputValue, ev);
                    var parent = el.parentNode;

                    if(parent.querySelector('.error-message') !== null){
                        parent.removeChild(parent.querySelector('.error-message'));
                    }
                    if (result.isValid) {
                        parent.classList.remove('alert', 'alert-danger');
                        if (spec.updateFnc) {
                            el.value = spec.updateFnc(inputValue);
                        }
                    } else {
                        parent.classList.add('alert', 'alert-danger');
                        let errorMessageDiv = document.createElement('div');
                        errorMessageDiv.classList.add('error-message');
                        parent.appendChild(errorMessageDiv);
                        errorMessageDiv.innerText = result.errorMessage;
                    }
                })
            })
        }
        else {
            spec.inputEl.addEventListener(event, function (ev) {
                var inputValue = spec.inputEl.value;
                var result = spec.validationFnc(inputValue, ev);
                var parent = spec.inputEl.parentNode;

                if(parent.querySelector('.error-message') !== null){
                    parent.removeChild(parent.querySelector('.error-message'));
                }
                if (result.isValid) {
                    parent.classList.remove('alert', 'alert-danger');
                    if (spec.updateFnc) {
                        spec.inputEl.value = spec.updateFnc(inputValue);
                    }
                } else {
                    parent.classList.add('alert', 'alert-danger');
                    let errorMessageDiv = document.createElement('div');
                    errorMessageDiv.classList.add('error-message');
                    parent.appendChild(errorMessageDiv);
                    errorMessageDiv.innerText = result.errorMessage;
                }
            });
        }
      }
  },
}
</script>