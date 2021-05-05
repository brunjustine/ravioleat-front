<template>
  <div id="app">
    <v-card>
      <v-app-bar elevate-on-scroll fixed class="overflow-hidden">
        <v-container fill-height fluid>
        <v-row>
          <v-col justify="center" align="left">
            <v-btn @click="goHome"  text class="title-ravioleat" color="black">
              <v-toolbar-title>
                Ravioleat
              </v-toolbar-title>
            </v-btn>
          </v-col>
          <div class="arrow-right-right"></div>
          <v-col justify="center" align="center" class="slogan-ravioleat">
            <h4 @click="easterEgg">Vos bons plans au plus vite</h4> 
          </v-col>
          <div class="arrow-right"></div>
          <v-spacer>
            
          </v-spacer>

        </v-row>
        </v-container>
      </v-app-bar>
    </v-card>
    <v-spacer></v-spacer>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
    methods: {
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
  .v-col {
    margin:0 auto;
  }
}

.v-toolbar__content{
  padding:0px!important;
}

.v-toolbar__title {
  font-weight: bold; 
  font-size: x-large;
  color :black!important;
}

.slogan-ravioleat {
  
  background-color:white!important;
  /*border-radius:40px;*/
  h4 {
    font-family: 'Amatic SC', cursive;
    color : black!important;
    font-size: xx-large;
  }
}

.arrow-right {
    width: 0;
    height: 0;
    padding:0;
    border-top: 32px solid transparent;
    border-bottom: 32px solid transparent;
    border-left: 32px solid #ffffff;
}

.arrow-right-right{
    width: 0;
    height: 0;
    padding:0;
    border-top: 32px solid #ffffff;
    border-bottom: 32px solid #ffffff;
    border-left: 32px solid transparent;
    border-right: 32px solid #ffffff;
}

@import url('https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&display=swap');


</style>
