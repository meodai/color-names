<template lang="pug">
  .container Hello {{bundler}}
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      bundler: "Parcel"
    };
  }
});

/*
const xhr = new XMLHttpRequest();
xhr.open('GET', '//color-names.herokuapp.com/v1/');
xhr.onload = e => {
  if (xhr.status === 200) {
    let resp = JSON.parse(xhr.responseText);
    app.colors = resp.colors;
    app.closestColors = new Closest(resp.colors.map(c => [c.rgb.r, c.rgb.g, c.rgb.b]), true);

    app.colorList = [...app.colors];

  } else {
    console.log(xhr.status);
  }
};
xhr.send();
*/
</script>

<style lang="scss" scoped>
.container {
  color: green;
}
</style>