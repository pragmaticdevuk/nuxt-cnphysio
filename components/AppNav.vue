<template>
  <div class="nav">
    <ul>
      <li class="nav-item" v-for="item in menus" :key="item.id">
        <nuxt-link exact v-bind:to="item.url">
          {{ item.title }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    menus() {
      return this.$store.state.menus;
    }
  },
  created() {
    this.$store.dispatch("getMenus");
  }
};
</script>

<style lang="scss" scoped>
.nav {
  background: #000;
  color: #fff;
  padding: 1em 100px;

  a {
    color: #fff;
    opacity: 0.8;
    &:hover {
      opacity: 1;
    }
  }
}

div {
  align-items: center;
  display: flex;
  height: 100%;
  width: 100%;
}

ul {
  padding-left: 0;

  li {
    display: inline-block;
    margin-right: 30px;
  }
}
</style>
