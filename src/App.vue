<template>
  <div id="app">
    <v-card class="overflow-hidden">
      <v-app-bar elevate-on-scroll fixed>

        <v-row>
          <v-col>
            <v-toolbar-title>
              <v-btn @click="goHome" plain class="title-ravioleat"> Ravioleat</v-btn>
            </v-toolbar-title>
          </v-col>
          
          <v-col class="slogan-ravioleat">
            <div class="container">
                <span @click="easterEgg">Vos bons plans au plus vite</span> 
            </div>
          </v-col>

          <v-col>
            <v-btn style="margin: 10px" @click="goUp" raised>
              <v-icon>mdi-back</v-icon>
              Aller en haut
            </v-btn>
          </v-col>

        </v-row>
      </v-app-bar>
    </v-card>
    <v-spacer></v-spacer>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
    methods: {
      goUp() {
        window.scrollTo(0,0)
      },
      goHome() {
        if (this.$route.path === '/') {
          this.$router.go(0);
        }
        else {
          this.$router.push('/');
        }
      },
      easterEgg(){
        if (this.$route.path === '/easterEgg') {
          this.$router.go(0);
        }
        else {
          this.$router.push('/easterEgg');
        }
      }
    }
  }
</script>

<style lang="scss">

#app {
  padding: 30px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #f8f8f8;
  //#1785B3
  //#4F17B3
  //ffc107
  //#14BAFF
  //#6914FF
  //#ebebeb
}

.v-app-bar {
  background-color : #FFC107!important;
  vertical-align:middle;
  .v-col {
    margin:0 auto;
  }
}

.title-ravioleat span{
  font-weight: bold; 
  font-size: x-large;
  color :black!important;
}

.slogan-ravioleat {
  font-family: "Snowyy Night",sans-serif;
  background-color:white!important;
  border-radius:40px;
  color : #1785B3!important;
  font-size: x-large;
}


@font-face {
 font-family: "Snowy Night";
 src: url("/assets/fonts/snowy_night/Snowy-Night.tff") format("truetype");
}


</style>
