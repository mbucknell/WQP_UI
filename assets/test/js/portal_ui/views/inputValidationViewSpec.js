import InputValidation from '../../../../js/views/InputValidationView.vue';
import { shallowMount } from '@vue/test-utils';

describe('Tests for InputValidation', function () {
    var validationFnc;
    let wrapper;
    beforeEach(function () {
        validationFnc = function (value) {
            if (value === 'Val1') {
                return {isValid: true};
            } else {
                return {
                    isValid: false,
                    errorMessage: 'Value must be Val1'
                };
            }
        };
        document.body.innerHTML = '<div id="test-div">' +
            '<div id="input-parent1"><input id="test-input1" type="text" value=""/>' +
            '<button>?</button></div>' +
            '<div id="input-parent2"><input id="test-input2" type="text" value=""/>' +
            '<button>?</button></div>' +
            '</div>'
        
        wrapper = shallowMount(InputValidation);

    });

    afterEach(function () {
        document.querySelector('#test-div').remove();
    });

    describe('Tests for InputValidation without an updateFnc', function () {
        beforeEach(function () {
            wrapper = shallowMount(InputValidation);
        });

        it('Expects a failed validation to all alert classes and display error messages', function () {
            wrapper.vm.initialize({inputEl: document.querySelectorAll('input[type="text"]'), validationFnc: validationFnc});
            document.querySelector('#test-input1').value = 'Val2';
            document.querySelector('#test-input1').dispatchEvent(new Event('change'));
            expect(document.querySelector('#input-parent1').className).toEqual('alert alert-danger');
            expect(document.querySelector('#input-parent1').querySelector('.error-message').innerText).toEqual('Value must be Val1');
            expect(document.querySelector('#input-parent2').className).toEqual('');
            expect(document.querySelector('#input-parent2').querySelectorAll('.error-message').length).toBe(0);
        });
        it('Expects a failed validation followed by a successful one to clear the error indicator', function () {
            wrapper.vm.initialize({inputEl: document.querySelectorAll('input[type="text"]'), validationFnc: validationFnc});
            document.querySelector('#test-input2').value = 'Val2';
            document.querySelector('#test-input2').dispatchEvent(new Event('change'));
            document.querySelector('#test-input2').value = 'Val1'
            document.querySelector('#test-input2').dispatchEvent(new Event('change'));
            expect(document.querySelector('#input-parent2').className).not.toContain('alert alert-danger');
            expect(document.querySelector('#input-parent2').querySelectorAll('.error-message').length).toBe(0);
        });
        it('Expects an initial successful validation to not change anything', function () {
            wrapper.vm.initialize({inputEl: document.querySelectorAll('input[type="text"]'), validationFnc: validationFnc});
            document.querySelector('#test-input1').value = 'Val1';
            document.querySelector('#test-input1').dispatchEvent(new Event('change'));
            expect(document.querySelector('#input-parent1').className).toEqual('');
            expect(document.querySelector('#input-parent1').querySelectorAll('.error-message').length).toBe(0);
        });

        it('Expects two failed validations to show only one message', function () {
            wrapper.vm.initialize({inputEl: document.querySelectorAll('input[type="text"]'), validationFnc: validationFnc});
            document.querySelector('#test-input1').value = 'Val2';
            document.querySelector('#test-input1').dispatchEvent(new Event('change'));
            document.querySelector('#test-input1').value = 'Val3';
            document.querySelector('#test-input1').dispatchEvent(new Event('change'));
            expect(document.querySelector('#input-parent1').querySelectorAll('.error-message').length).toBe(1);

        });
    });

    describe('Tests for InputValidation that specified an event other than change', function() {
        beforeEach(function () {
            wrapper = shallowMount(InputValidation);
        });

        it('Expects a failed validation to show the error message when the dummy-event is triggered, not when change is triggered', function() {
            wrapper.vm.initialize({inputEl: document.querySelectorAll('input[type="text"]'), validationFnc: validationFnc, event: 'dummy-event'});
            document.querySelector('#test-input1').value = 'Val2';
            document.querySelector('#test-input1').dispatchEvent(new Event('change'));
            expect(document.querySelector('#input-parent1').className).not.toContain('alert alert-danger');
            expect(document.querySelector('#input-parent1').querySelectorAll('.error-message').length).toBe(0);

            document.querySelector('#test-input1').dispatchEvent(new Event('dummy-event'));
            expect(document.querySelector('#input-parent1').className).toEqual('alert alert-danger');
            expect(document.querySelector('#input-parent1').querySelector('.error-message').innerText).toEqual('Value must be Val1');
        });
    });

    describe('Tests for InputValidation with an updateFnc', function () {
        var fnc;

        beforeEach(function () {
            fnc = {
                updateFnc: function (value) {
                    return value.toUpperCase();
                }
            };

            spyOn(fnc, 'updateFnc').and.callThrough();

            wrapper = shallowMount(InputValidation);
        });

        it('Expects successful validation to call updateFnc and update the value', function () {
            wrapper.vm.initialize({inputEl: document.querySelectorAll('input[type="text"]'), validationFnc: validationFnc, updateFnc: fnc.updateFnc});
            document.querySelector('#test-input1').value = 'Val1';
            document.querySelector('#test-input1').dispatchEvent(new Event('change'));
            expect(fnc.updateFnc).toHaveBeenCalledWith('Val1');
            expect(document.querySelector('#test-input1').value).toEqual('VAL1');
        });

        it('Expects invalid validation to not call updateFnc', function () {
            wrapper.vm.initialize({inputEl: document.querySelectorAll('input[type="text"]'), validationFnc: validationFnc, updateFnc: fnc.updateFnc});
            document.querySelector('#test-input1').value = 'xxx';
            document.querySelector('#test-input1').dispatchEvent(new Event('change'));
            expect(fnc.updateFnc).not.toHaveBeenCalled();
        });
    });
});