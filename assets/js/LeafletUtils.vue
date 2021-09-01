<template>
</template>

<script>
/*
 * @param {L.LatLngBounds} bounds
 * @returns a string representing bounds as south,west,north,east
 */

export default {
  name: "LeafletUtils",
  methods: {
    toBBoxString(bounds) {
        return bounds.getSouth() + ',' + bounds.getWest() + ',' + bounds.getNorth() + ',' + bounds.getEast();
    }
  }
}
</script>