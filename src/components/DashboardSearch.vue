<template>
  <v-row align="center" id="rechercheNom">
    <v-text-field
      class="inputName"
      v-model="inputName"
      label="Entrer un nom ou un mot-clé"
    ></v-text-field>
    <v-btn depressed color="primary" v-on:click="sendInput()">Rechercher</v-btn>
  <!--<v-select v-model="sortBy" :items="items" label="Trier par"></v-select>-->
  </v-row>
</template>

<script>
export default {
  name: "DashboardSearch",
  props: {
      filteredRestaurants: Array,
    },
  data: function () {
    return {
      inputName: "",
      /*sortBy: "",
      items: [
        "Prix croissant",
        "Prix décroissant",
        "Par popularité",
        "Temps de livraison croissant",
        "Temps de livraison décroissant",
      ],*/
    };
  },
  methods: {
    sendInput() {
      this.$emit("searchRestaurants", this.inputName);
    },
    /*sortByDecreasingPrice(){

    },
    sortByIncreasingPrice(){

    },
    sortByPopularity() {

    },
    sortByDecreasingDeliveryTime() {

    },
    sortByIncreasingDeliveryTime() {

    }

  },
  watch: {
    sortBy: function (expr) {
      console.log(expr);
      switch (expr) {
        case "Prix croissant":
          console.log("");
          break;
        case "Prix décroissant":
          console.log("");
          break;
        case "Par popularité":
          console.log("");
          break;
        case "Temps de livraison croissant":
          console.log("");
          break;
        case "Temps de livraison décroissant":
          break;
        default:
          console.log(`Sorry, we are out of ${expr}.`);
      }
    },*/
  },
};
</script>

<style scoped>
</style>

