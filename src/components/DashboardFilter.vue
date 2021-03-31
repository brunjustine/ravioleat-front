<template>
    <v-card id="card-filter">
        <!--Type-->
        <v-subheader class="TitreRecherche">Type de Nourriture</v-subheader>
        <v-select v-model="foodFilter" :items="foodTypes" multiple></v-select>
        <!--Offres-->
        <v-checkbox v-model="offre" label="Restaurants avec des offres"></v-checkbox>
        <!--Délais de livraison max-->
        <v-subheader class="TitreRecherche">Délais livraison max</v-subheader>
        <v-card-text>
          <v-row>
            <v-col class="px-4">
              <v-slider v-model="delay" thumb-label="always" :min="10" :max="120" step="5" ></v-slider>
            </v-col>
          </v-row>
        </v-card-text>
        <!--Frais de livraison-->
        <v-subheader class="TitreRecherche">Frais de livraison</v-subheader>
        <v-slider v-model="deliveryFilter" :tick-labels="deliveryCost" step="1" ticks="always" tick-size="4" :max="3"></v-slider>
        <!--Notes-->
        <v-subheader class="TitreRecherche">Notes</v-subheader>
        <v-rating v-model="grade" background-color="orange lighten-3" color="orange" large></v-rating>
        <v-btn depressed color="primary" v-on:click="filterRestaurants()" >Filtrer</v-btn>
    </v-card>
</template>

<script>
export default {
    name: "DashboardFilter",
    props: {
      allRestaurants: [],
    },
    data: () => ({
        delay: 120,
        deliveryCost: ["0","3","5","7","7+"],
        deliveryCostFilter:0,
        foodFilter:[],
        foodTypes: ['Fast Food','Burgers','Pizza','Asiatique','Sushis','Cuisine Saine', 'Halal', 'Indienne','Petit déjeuné'],
        grade:0,
    }),
    methods: {
        filterRestaurants() {
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
</style>


