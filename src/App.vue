<template>
  <div id="app">
    <v-card class="overflow-hidden">
      <v-app-bar
          color="teal lighten-3"
          elevate-on-scroll
      >
        <v-app-bar-nav-icon></v-app-bar-nav-icon>

        <v-toolbar-title style="font-weight: bold; font-size: x-large">Ravioleat</v-toolbar-title>

        <pre style="font-family: Avenir, Helvetica, Arial, sans-serif">   L'application qui vous dit OU commander !    </pre>

        <v-btn style="margin: 10px" @click="goHome"
               raised
        >
          <v-icon>mdi-home</v-icon>
          Home
        </v-btn>

        <v-btn style="margin: 10px" @click="goBack"
               raised
        >
          <v-icon>mdi-back</v-icon>
          Back
        </v-btn>

        <v-spacer></v-spacer>

      </v-app-bar>
    </v-card>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    methods: {
      goBack() {
        if (this.$route.path !== '/') {
          this.$router.go(-1);
        }
      },
      goHome() {
        if (this.$route.path === '/') {
          this.$router.go(0);
        }
        else {
          this.$router.push('/');
        }
      },
    }
  }
</script>

<style lang="scss">

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
