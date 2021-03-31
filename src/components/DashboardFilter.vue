<template>
    <v-card id="card-filter">
        <!--Type-->
        <v-subheader class="search-title">Types de Nourriture</v-subheader>
        <v-select v-model="foodFilter" :items="foodTypes" multiple></v-select>
        <!--Offres-->
        <v-checkbox v-model="offer" label="Restaurants avec des offres"></v-checkbox>
        <!--Délais de livraison max-->
        <v-subheader class="search-title">Délais de livraison max</v-subheader>
        <v-card-text>
          <v-row>
            <v-col class="px-4">
              <v-slider v-model="delay" thumb-label="always" :min="10" :max="120" step="5" ></v-slider>
            </v-col>
          </v-row>
        </v-card-text>
        <!--Frais de livraison-->
        <v-subheader class="search-title">Frais de livraison</v-subheader>
        <v-slider v-model="deliveryCostFilter" :tick-labels="deliveryCost" step="1" ticks="always" tick-size="4" :max="3"></v-slider>
        <!--Notes-->
        <v-subheader class="search-title">Notes</v-subheader>
        <v-rating v-model="grade" background-color="orange lighten-3" color="orange" large></v-rating>
        <v-btn depressed color="primary" v-on:click="filterRestaurants()" >Filtrer</v-btn>
    </v-card>
</template>

<script>
export default {
    name: "DashboardFilter",
    props: {
      allRestaurants: Array,
    },
    data: () => ({
        delay: 120,
        offer:false,
        deliveryCost: ["0","3","5","7","7+"],
        deliveryCostFilter:0,
        foodFilter:[],
        foodTypes: ['Fast Food','Burgers','Pizzas','Asiatique','Sushis','Cuisine Saine', 'Halal', 'Indienne','Petit déjeuner'],
        grade:0,
    }),
    methods: {
        filterRestaurants() {
          console.log(this.allRestaurants)
        }
    }
}
</script>

<style scoped>

#card-filter {
    height: min-content;
    margin:2%;
    padding: 15px;
}

.search-title {
  font-size: 20px;
}
</style>


