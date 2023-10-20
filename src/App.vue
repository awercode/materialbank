<template>
  <router-view :key="updateKey" />
</template>

<script>
export default {
  data() {
    return {
      updateKey: 0,
    };
  },
  methods: {
    forceUpdate() {
      this.updateKey += 1;
    }
  }
}
</script>