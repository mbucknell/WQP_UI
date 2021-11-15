<template>
</template>

<script>

export default {
  name: 'PortalValidators',
  methods: {
    realNumberValidator(value) {
        if (value) {
            if (isNaN(value)) {
                return {
                    isValid: false,
                    errorMessage: 'Enter a floating point number.'
                };
            } else {
                return {isValid: true};
            }
        } else {
            return {isValid: true};
        }
    },

    positiveIntValidator(value) {
        var result;
        var MSG = 'Enter a positive number';
        if (!value) {
            result = {
                isValid : true
            };
        } else if (value.match(/^[1-9]\d*$/g)) {
            result = {
                isValid : true
            };
        } else {
            result = {
                isValid : false,
                errorMessage : MSG
            };
        }
        return result;
    }
  }
};
</script>