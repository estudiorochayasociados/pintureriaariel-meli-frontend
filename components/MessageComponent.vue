<template>
  <div>
    <div v-bind:class="`notification is-` + status" v-if="text">{{ text }}</div>
  </div>
</template>

<script>
export default {
  props: {
    text: String,
    status: String
  },
  mounted() {
    console.log(this.status);
  }
};
</script>