import Vue from "vue";
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    resultType: 'Station',
    countrySelectedState: [],
    countryOptionsState: [],
    stateSelectedState: [],
    stateOptionsState: [],
    countySelectedState: [],
    countyOptionsState: [],
    sitetypeSelectedState: [],
    sitetypeOptionsState: [],
    chargroupSelectedState: [],
    chargroupOptionsState: [],
    sampleMediaSelectedState: [],
    sampleMediaOptionsState: [],
    orgIDSelectedState: [],
    orgIDOptionsState: [],
    projIDSelectedState: [],
    projIDOptionsState: {},
    siteIDSelectedState: [],
    siteIDOptionsState: {},
    charSelectedState: [],
    charOptionsState: {},
    assemblageSelectedState: [],
    assemblageOptionsState: [],
    taxSelectedState: [],
    taxOptionsState: {},
  },
  mutations: {
    updateResultType(state, newResultType) {
      state.resultType = newResultType;
    },
    getCountryState(state, selected) {
      state.countrySelectedState = selected;
    },
    getCountryOptionsState(state, options) {
        state.countryOptionsState = options;
    },
    getStateState(state, selected) {
        state.stateSelectedState = selected;
    },
    getStateOptionsState(state, options) {
        state.stateOptionsState = options;
    },
    getCountyState(state, selected) {
    state.countySelectedState = selected;
    },
    getCountyOptionsState(state, options) {
        state.countyOptionsState = options;
    },
    getSitetypeState(state, selected) {
        state.sitetypeSelectedState = selected;
    },
    getSitetypeOptionsState(state, options) {
        state.sitetypeOptionsState = options;
    },
    getChargroupState(state, selected) {
        state.chargroupSelectedState = selected;
    },
    getChargroupOptionsState(state, options) {
        state.chargroupOptionsState = options;
    },
    getSampleMediaState(state, selected) {
        state.sampleMediaSelectedState = selected;
    },
    getSampleMediaOptionsState(state, options) {
        state.sampleMediaOptionsState = options;
    },
    getOrgIDState(state, selected) {
        state.orgIDSelectedState = selected;
    },
    getOrgIDOptionsState(state, options) {
        state.orgIDOptionsState = options;
    },
    getProjIDState(state, selected) {
        state.projIDSelectedState = selected;
    },
    getProjIDOptionsState(state, options) {
        state.projIDOptionsState = options;
    },
    getSiteIDState(state, selected) {
        state.siteIDSelectedState = selected;
    },
    getSiteIDOptionsState(state, options) {
        state.siteIDOptionsState = options;
    },
    getCharState(state, selected) {
        state.charSelectedState = selected;
    },
    getCharOptionsState(state, options) {
        state.charOptionsState = options;
    },
    getAssemblageState(state, selected) {
        state.assemblageSelectedState = selected;
    },
    getAssemblageOptionsState(state, options) {
        state.assemblageOptionsState = options;
    },
    getTaxState(state, selected) {
        state.taxSelectedState = selected;
    },
    getTaxOptionsState(state, options) {
        state.taxOptionsState = options;
    },
  },
  getters: {
    resultType: (state) => state.resultType,
    countrySelectedState: (state) => state.countrySelectedState,
    countryOptionsState: (state) => state.countryOptionsState,
    stateSelectedState: (state) => state.stateSelectedState,
    stateOptionsState: (state) => state.stateOptionsState,
    countySelectedState: (state) => state.countySelectedState,
    countyOptionsState: (state) => state.countyOptionsState,
    sitetypeSelectedState: (state) => state.sitetypeSelectedState,
    sitetypeOptionsState: (state) => state.sitetypeOptionsState,
    chargroupSelectedState: (state) => state.chargroupSelectedState,
    chargroupOptionsState: (state) => state.chargroupOptionsState,
    sampleMediaSelectedState: (state) => state.sampleMediaSelectedState,
    sampleMediaOptionsState: (state) => state.sampleMediaOptionsState,
    orgIDSelectedState: (state) => state.orgIDSelectedState,
    orgIDOptionsState: (state) => state.orgIDOptionsState,
    projIDSelectedState: (state) => state.projIDSelectedState,
    projIDOptionsState: (state) => state.projIDOptionsState,
    siteIDSelectedState: (state) => state.siteIDSelectedState,
    siteIDOptionsState: (state) => state.siteIDOptionsState,
    charSelectedState: (state) => state.charSelectedState,
    charOptionsState: (state) => state.charOptionsState,
    assemblageSelectedState: (state) => state.assemblageSelectedState,
    assemblageOptionsState: (state) => state.assemblageOptionsState,
    taxSelectedState: (state) => state.taxSelectedState,
    taxOptionsState: (state) => state.taxOptionsState
  },
})