<template>
    <v-card id="card-filter" max-width="280">
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
              <v-slider v-model="delay" thumb-label="always" :min="minDelay" :max="maxDelay" step="5" ></v-slider>
            </v-col>
          </v-row>
        </v-card-text>
        <!--Frais de livraison-->
        <v-subheader class="search-title">Frais de livraison</v-subheader>
        <v-slider v-model="deliveryCostFilter" :tick-labels="deliveryCost" step="1" ticks="always" tick-size="5" :max="4"></v-slider>
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
    data: function() {
      return {  
        delay: 120,
        offer:false,
        deliveryCost: ["0","3","5","7","7+"],
        deliveryCostFilter:0,
        foodFilter:[],
        foodTypes: ['Fast Food','Burger','Pizza','Asiatique','Sushis','Cuisine Saine', 'Halal', 'Indien','Petit déjeuner'],
        grade:0,
        maxDelay: 120,
        minDelay: 0,
        filteredRestaurants: this.allRestaurants
      }
    },
    methods: {
        filterRestaurants() {
          let tmpRestaurants = this.allRestaurants
          this.filteredRestaurants = tmpRestaurants.filter(restaurant =>
          {
            let plateformes = this.filterByOffer(restaurant)
            plateformes = this.filterByFoodTypes(plateformes)
            plateformes = this.filterByDeliveryDelay(plateformes)
            //console.log(plateformes)
            return plateformes.length > 0
          })
          console.log(this.filteredRestaurants)
        },
        filterByFoodTypes(restaurant){
          if (this.foodFilter.length>0) {
            return restaurant.filter(plateforme => plateforme.CuisineTypes.find(type => this.foodFilter.includes(type.Name)))
          } else {
            return restaurant
          }
        },
        filterByOffer: function (restaurant){
          if (this.offer==true ){
            return restaurant.filter(plateforme => plateforme.Offers.length >0)
          } else {
            return restaurant
          }
        },
        filterByDeliveryDelay(restaurant){
          return restaurant.filter(plateforme => {
            return(plateforme.DeliveryEtaMinutes !== null) ? (parseInt(plateforme.DeliveryEtaMinutes.RangeUpper) <= this.delay) : false
          }
          )
          
        },
        filterByDeliveryCost(){

        },
        filterByGrade(){

        },
        getSliderRange(){
          let range =[]
          if (this.filteredRestaurants.length > 0) {
            this.filteredRestaurants.forEach(restaurant => 
              restaurant.forEach(e => {
                if (e.DeliveryEtaMinutes !== null) {
                  range.push(e.DeliveryEtaMinutes.RangeUpper)
                  range.push(e.DeliveryEtaMinutes.RangeLower)
                }
              }))
            this.minDelay = Math.min.apply(Math, range)
            this.maxDelay = Math.max.apply(Math, range)
          } else {
            this.minDelay = 0
            this.maxDelay = 120
          }
        }
    },
    watch: {
        filteredRestaurants: function () {
            this.getSliderRange()
        },
    },
    beforeMount() {
      this.getSliderRange()
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


