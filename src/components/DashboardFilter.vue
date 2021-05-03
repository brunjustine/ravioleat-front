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
              <v-slider color="amber" v-model="delay" thumb-label="always" :min="minDelay" :max="maxDelay" step="5" ></v-slider>
            </v-col>
          </v-row>
        </v-card-text>
        <!--Frais de livraison-->
        <v-subheader class="search-title">Frais de livraison</v-subheader>
        <v-slider color="amber" v-model="deliveryCostFilter" thumb-label="always" :min="minCost" :max="maxCost" step="0.5"></v-slider>
        <!--Notes-->
        <v-subheader class="search-title">Notes</v-subheader>
        <v-rating v-model="grade" background-color="orange lighten-3" color="orange" large></v-rating>
        <br>
        <v-row align="center" justify="space-around">
          <v-btn depressed color="amber" v-on:click="filterRestaurants()" >Filtrer</v-btn>
          <v-btn depressed color="amber" v-on:click="resetFilter()" outlined>Réinitialiser</v-btn>
        </v-row>
        <br>
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
        deliveryCostFilter:100,
        foodFilter:[],
        foodFilterEnglish:[],
        foodTypes: ['Fast Food','Burgers','Pizza','Asiatique','Sushi','Healthy', 'Halal', 'Indien','Petit déjeuner'],
        grade:0,
        maxDelay: 120,
        minDelay: 0,
        maxCost: 7,
        minCost: 0,
        filteredRestaurants: this.allRestaurants
      }
    },
    methods: {
        filterRestaurants() {
          localStorage.setItem('expiration', Date.now())
          let tmpRestaurants = this.allRestaurants
          this.traductionFoodFilter()
          this.filteredRestaurants = tmpRestaurants.filter(restaurant =>
          {
            let plateformes = this.filterByOffer(restaurant)
            plateformes = this.filterByFoodTypes(plateformes)
            plateformes = this.filterByDeliveryDelay(plateformes)
            plateformes = this.filterByDeliveryCost(plateformes)
            plateformes = this.filterByGrade(plateformes)
            return plateformes.length > 0
          })
          this.$emit('filterRestaurants', this.filteredRestaurants)
          this.initStorage()
        },
        filterByFoodTypes(restaurant){
          if (this.foodFilter.length>0) {
            return restaurant.filter(plateforme => plateforme.CuisineTypes.find(type => this.foodFilterEnglish.includes(type.Name)))
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
          return restaurant.filter(plateforme => 
            this.delay == this.maxDelay || ((plateforme.DeliveryEtaMinutes !== null) ? (parseInt(plateforme.DeliveryEtaMinutes.RangeUpper) <= this.delay) : false)
          )
          
        },
        filterByDeliveryCost(restaurant){
          return restaurant.filter(plateforme => 
            this.deliveryCostFilter == this.maxCost || ((plateforme.DeliveryCost !== null) ? (parseFloat(plateforme.DeliveryCost) <= this.deliveryCostFilter) : false)
          )
        },
        filterByGrade(restaurant){
           return restaurant.filter(plateforme => 
            this.grade == 0 || ((plateforme.Rating !== null) ? (parseFloat(plateforme.Rating.StarRating) >= this.grade) : false)
          )
        },
        getDelays(e, range){
          if (e.DeliveryEtaMinutes !== null) {
            range.push(e.DeliveryEtaMinutes.RangeUpper)
            range.push(e.DeliveryEtaMinutes.RangeLower)
          }
          return range
        },
        getCosts(e, range){
          if (e.DeliveryCost !== null) {
            range.push(e.DeliveryCost)
          }
          return range
        },
        getSlidersRange(){
          let rangeDelay =[]
          let rangeCost = []
          if (this.filteredRestaurants.length > 0 && this.filteredRestaurants.filter(resto => resto[0].IsOpenNow).length > 0) {
            this.filteredRestaurants.forEach(restaurant => 
              restaurant.forEach(e => {
                rangeDelay = this.getDelays(e,rangeDelay)
                rangeCost = this.getCosts(e,rangeCost)
              }))
            this.minDelay = Math.min.apply(Math, rangeDelay)
            this.maxDelay = Math.max.apply(Math, rangeDelay)
            this.minCost = Math.min.apply(Math, rangeCost)
            this.maxCost = Math.round(Math.max.apply(Math, rangeCost))
          } else {
            this.minDelay = 0
            this.maxDelay = 120
            this.minCost = 0
            this.maxCost = 7
          }
        },
        resetFilter(){
          localStorage.setItem('expiration', Date.now())
          this.$emit('filterRestaurants', this.allRestaurants)
          this.offer = false
          this.foodFilter = []
          this.grade = 0
          this.delay = this.maxDelay
          this.deliveryCostFilter = this.maxCost
          this.initStorage()
        },
        traductionFoodFilter(){
          this.foodFilterEnglish = []
          for (var food in this.foodFilter) {
            switch (this.foodFilter[food]) {
              case 'Asiatique': {
                this.foodFilterEnglish.push('Asian')
                this.foodFilterEnglish.push('AsianFusion')
                break
              }
              case 'Indien': {
                this.foodFilterEnglish.push('Indian')
                break
              }
              case 'Petit déjeuner': {
                this.foodFilterEnglish.push('Breakfast')
                this.foodFilterEnglish.push('Breakfast and Brunch')
                break
              }
              default: {
                this.foodFilterEnglish.push(this.foodFilter[food])
                break
              }
            }
          }
        },
        initStorage() {
          this.offer ? localStorage.setItem('offer',1) : localStorage.setItem('offer',0)
          localStorage.setItem('foodFilter', this.foodFilter)
          localStorage.setItem('delay', this.delay)
          localStorage.setItem('deliveryCostFilter', this.deliveryCostFilter)
          localStorage.setItem('grade', this.grade)
        },
        rechercheFiltresStockés(){
          this.offer = (localStorage.getItem('offer')=="1")
          this.foodFilter = localStorage.getItem('foodFilter')=="" ? [] : localStorage.getItem('foodFilter').split(",")
          this.delay = localStorage.getItem('delay')
          this.deliveryCostFilter = localStorage.getItem('deliveryCostFilter')
          this.grade = +localStorage.getItem('grade')
          this.filterRestaurants()
        }
    },
    beforeMount() {
      this.getSlidersRange()
    }, 
    mounted() {
      if (localStorage.getItem('alreadySearch') === "true") {
        this.rechercheFiltresStockés()
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

.v-btn {
  color: white!important;;
}
</style>


