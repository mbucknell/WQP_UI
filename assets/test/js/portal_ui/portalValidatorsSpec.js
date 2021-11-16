import PortalValidators from '../../../js/PortalValidators.vue';
import { shallowMount } from '@vue/test-utils';

describe('Tests for portalValidators', function () {
    'use strict';

    describe('Tests for validators.realNumberValidator', function () {
        let wrapper;

        beforeEach(() => {
            wrapper = shallowMount(PortalValidators);
        });

        it('Expects a null value to be valid', function () {
            expect(wrapper.vm.realNumberValidator('')).toEqual({isValid: true});
        });
        it('Expects a value containing digits to be valid or ', function () {
            expect(wrapper.vm.realNumberValidator('30')).toEqual({isValid: true});
        });
        it('Expects valid floating points numbers to be valid', function () {
            expect(wrapper.vm.realNumberValidator('30.')).toEqual({isValid: true});
            expect(wrapper.vm.realNumberValidator('-30.1')).toEqual({isValid: true});
            expect(wrapper.vm.realNumberValidator('.31')).toEqual({isValid: true});
            expect(wrapper.vm.realNumberValidator('-0.31')).toEqual({isValid: true});
        });
        it('Expects value containing anything other the numbers, a single optional dash and a single decimal to be invalid', function () {
            var valid = wrapper.vm.realNumberValidator('12A');
            expect(valid.isValid).toBe(false);
            expect(valid.errorMessage).toBeDefined();

            valid = wrapper.vm.realNumberValidator('12:30');
            expect(valid.isValid).toBe(false);
            expect(valid.errorMessage).toBeDefined();

            valid = wrapper.vm.realNumberValidator('12.30.60');
            expect(valid.isValid).toBe(false);
            expect(valid.errorMessage).toBeDefined();
        });
    });

    describe('Tests for validators.positiveIntValidator', function() {
        let wrapper;

        beforeEach(() => {
            wrapper = shallowMount(PortalValidators);
        })

        it('Expects a null value to be valid', function() {
            expect(wrapper.vm.positiveIntValidator('').isValid).toBe(true);
        });

        it('Expects a zero value to be invalid', function() {
            expect(wrapper.vm.positiveIntValidator('0').isValid).toBe(false);
        });

        it('Expects a negative value to be invalid', function() {
            expect(wrapper.vm.positiveIntValidator('-12').isValid).toBe(false);
        });

        it('Expects real numbers to be invalid', function() {
            expect(wrapper.vm.positiveIntValidator('23.3').isValid).toBe(false);
        });

        it('Expects that strings containing anything other the numbers is invalid', function() {
            expect(wrapper.vm.positiveIntValidator('A123').isValid).toBe(false);
        });

        it('Expects positive integers to be valid', function() {
            expect(wrapper.vm.positiveIntValidator('435681690').isValid).toBe(true);
        });
    });

});
