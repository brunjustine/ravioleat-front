<template>
  <div id="app">
    <v-card class="overflow-hidden">
      <v-app-bar elevate-on-scroll>
        <v-toolbar-title>
          <v-btn @click="goHome" plain class="title-ravioleat"> Ravioleat</v-btn>
        </v-toolbar-title>

        <v-spacer></v-spacer>
        <div class="slogan-ravioleat pa-4 text-center secondary text-no-wrap rounded-xl">
            L'application qui vous dit où commander !    
        </div>
        
        <v-spacer></v-spacer>

        <v-btn style="margin: 10px" @click="goBack" raised>
          <v-icon>mdi-back</v-icon>
          Back
        </v-btn>

        
      </v-app-bar>
    </v-card>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      if (this.$route.path !== "/") {
        this.$router.go(-1);
      }
    },
    goHome() {
      if (this.$route.path === "/") {
        this.$router.go(0);
      } else {
        this.$router.push("/");
      }
    },
  },
};
</script>

<style lang="scss">

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #f3f3f3;
  //#1785B3
  //#4F17B3
  //ffc107
  //#14BAFF
  //#6914FF
  //#ebebeb
}

.v-app-bar {
  background-color : #FFC107!important;
}

.title-ravioleat span{
  font-weight: bold; 
  font-size: x-large;
  color :black!important;
}

.slogan-ravioleat {
  font-family: "Snowyy Night";
  background-color:white!important;
  border-radius:50px;
  padding :50px;
  color : #1785B3!important;
}

@font-face {
 font-family: "Snowy Night";
 src: url("/assets/fonts/snowy_night/Snowy-Night.tff") format("truetype");
}


</style>
