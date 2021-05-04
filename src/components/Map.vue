<template>
  <v-row align="center" v-if="showRestaurant">
    <gmap-map :center="{lat:this.latitude,lng: this.longitude}" :zoom="13" style="width:100%;  height: 600px;">
        <gmap-marker :position="{lat:latitude, lng:longitude, label:'moi'}" style="width:50px;" :icon="require('/src/assets/mapMaison.png')"></gmap-marker>
        <gmap-marker 
            :key="restaurant[0].Id" 
            v-for="restaurant in restaurants" 
                :position="{lat:restaurant[0].Address.Latitude, lng:restaurant[0].Address.Longitude, label:restaurant[0].Name}" 
                @click="moveToDetail(restaurant)" 
                @mouseover="previewRestaurant(restaurant)"></gmap-marker>
            <gmap-info-window
                v-if="currentRestaurant"
                :options="infoOptions"
                :opened="showInfoBulle"
                :position="{lat:currentRestaurant[0].Address.Latitude, lng:currentRestaurant[0].Address.Longitude, label:currentRestaurant[0].Name}"
                @closeclick="showInfoBulle=false"
            >
                <div v-html="infoContent"></div>
            </gmap-info-window> 
    </gmap-map>
  </v-row>
  
</template>

<style scoped>

</style>


<script>
export default {
  name: "Map",
  props: {
      latitude: Number,
      longitude: Number,
      userQuery: String,
      restaurants: Array,
      devise:String,
      
  },
  data: () => ({
      infoOptions: {
          pixelOffset: {
            width: 0,
            height: -35
          }
        },  
      showInfoBulle: false,
      infoContent: "",
      currentRestaurant :"",
      allRestaurantsOuverts:[],
      showRestaurant: false,
  }),
  created() {
      this.showRestaurant=true
  },
  methods: {
      setDetail(api,details,restaurant) {
                details.restaurant_ids[api]= restaurant.Id
                if (api==="uber_eat") {
                    details.formattedAddress = restaurant.Address.FirstLine
                    details.userQuery = this.userQuery
                }
                return details
            },
      moveToDetail(restaurants){
                localStorage.removeItem('current_restaurant_details')
                var details = {
                    restaurant_ids: {
                        "uber_eat": '',
                        "deliveroo": '',
                        "just_eat": '',
                    },
                    lat: restaurants[0].Address.Latitude,
                    lon: restaurants[0].Address.Longitude,
                    formattedAddress: '',
                    userQuery: ''
                }
                restaurants.forEach(restaurant => details = this.setDetail(restaurant.Api,details,restaurant));
                localStorage.setItem('current_restaurant_details', JSON.stringify(details));
                this.$router.push({path: `/restaurant/details`})
        },
      previewRestaurant(restaurant){
          this.infoContent = this.getInfoWindowContent(restaurant);
          this.showInfoBulle= true;
            this.currentRestaurant=restaurant
      },
      getInfoWindowContent(restaurant) {
          var logoUrl= restaurant[0].LogoUrl
          var res =  `
            <div>
                <div>
                    <img style="height:120px;width:200px ;" src="${logoUrl}"></img>
                </div>
                <div class="m-2">
                    <span style="font-weight: bold;" > ${restaurant[0].Name} </span>
                </div>
                <div>
                    <div>
                        <v-card-title> Frais de livraison </v-card-title>
                    </div>
                    <div>
                        <v-row>
                            `

            for(var i in restaurant){
                res= res + ` <v-col cols="2">
                                <span>
                                    <img width="30px" height="30px"  src="`+require('/src/assets/logos/'+restaurant[i].Api+'.png')+`">
                                </span>
                            </v-col>
                            <v-col cols="10">
                                <v-chip> 
                                    <font>`+ restaurant[i].DeliveryCost+` `+this.devise+`</font>
                                </v-chip>
                            </v-col> `
            }
            res= res+ `</v-row></div></div></div>`
        return res
      },
  }
};
</script>
