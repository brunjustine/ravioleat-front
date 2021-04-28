<template>
    <div>
        <v-card class="listeCards" v-on:click="moveToDetail()">
            <a class="card1" href="#">
            <div v-bind:class="{ open: !restaurant[0].IsOpenNow}">
                <v-list-item-content class="contenuCards" >
                    <v-row rows="2" class="premiereLigne">
                        <v-col cols="5">
                            <v-list-item class="nomRestaurant"><h1>{{restaurant[0].Name}}</h1></v-list-item> 
                        </v-col>
                        <v-col cols="3" class="colCards">
                            <v-list-item class="notes"><v-rating background-color="orange lighten-3" color="orange" :value="starAverage(restaurant)" half-icon="mdi-star-half" half-increments readonly ></v-rating></v-list-item>
                        </v-col>
                        <v-col cols="4" class="photo">
                            <v-list-item ><v-img max-height="300" max-width="500" :src="restaurant[0].LogoUrl"></v-img></v-list-item> 
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="3" class="colCards">
                            <v-list-item class="nomTypes" > <h4>{{calculTypes(restaurant)}}</h4></v-list-item>
                            <v-list-item  v-if="offresBoolean(restaurant)"><h5 class="offres">Il y a des offres ICI <v-icon color="green darken-2">mdi-piggy-bank</v-icon></h5></v-list-item>
                        </v-col>
                        <v-col cols="5" class="colDifLivreurs">
                            <v-row>
                                <v-col>
                                    <v-card-title>Délais  </v-card-title>
                                    <v-card-text>
                                        <v-chip class="livraison"  v-for="resto in restaurant" :key="resto.id"><span><img width="30px" height="30px" :src="require('/src/assets/logos/'+resto.Api+'.png')"> </span>  <font v-bind:class="{ best: resto.DeliveryEtaMinutes.RangeLower==bestTimeLivraison(restaurant)}" v-if="resto.DeliveryEtaMinutes!=null"> {{resto.DeliveryEtaMinutes.RangeLower}} - {{resto.DeliveryEtaMinutes.RangeUpper}} min  <v-icon v-if="resto.DeliveryEtaMinutes.RangeLower==bestTimeLivraison(restaurant)" color="red darken-2"> mdi-run-fast</v-icon>  </font> </v-chip>
                                    </v-card-text>
                                </v-col>
                                <v-col>
                                    <v-card-title>Frais de livraison  </v-card-title>
                                    <v-card-text>
                                        <v-chip class="livraison" v-for="resto in restaurant" :key="resto.id"><span><img width="30px" height="30px"  :src="require('/src/assets/logos/'+resto.Api+'.png')"></span>  <font v-bind:class="{ best: resto.DeliveryCost==bestPriceLivraison(restaurant)}">  {{resto.DeliveryCost}}{{devise}} <v-icon v-if="resto.DeliveryCost==bestPriceLivraison(restaurant)" color="green darken-4"> mdi-cash-multiple</v-icon></font></v-chip>
                                    </v-card-text>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col  cols="3">
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </div>
            <div class="go-corner" href="#">
                <div class="go-arrow">
                    →
                </div>
            </div>
        </a>
        </v-card> 
        
    </div>
</template>

<script>
    export default {
        name: "DashboardCard",
        data: () => ({
            chargement: true,
        }),
        props: {
            restaurant: Array, 
            devise: String,
            userQuery: String,
            longitude: Number,
            latitude: Number
        },
        methods : {
            starAverage(sameRestaurants){
                var average=0;
                for(var restaurantNum in sameRestaurants){
                    average=average+sameRestaurants[restaurantNum].Rating.StarRating
                }
                average=average/sameRestaurants.length
                return average
            },
            calculTypes(sameRestaurants){
                var typesSameRestaurant=[];
                for(var restaurantNum in sameRestaurants){
                    for(var typeNum in sameRestaurants[restaurantNum].CuisineTypes){
                    typesSameRestaurant.push(sameRestaurants[restaurantNum].CuisineTypes[typeNum].Name)
                    }
                }
                var tabRes = typesSameRestaurant.filter(this.listeUnique)
                var res =  tabRes.join(", ")
                return res
            },
            listeUnique(value, index, self) {
                return self.indexOf(value) === index;
            },
            offresBoolean(restaurant){
                var res= false
                for(var i in restaurant){
                    if(restaurant[i].Offers.length>0){
                        res=true
                    }
                }
                return res
            },
            bestTimeLivraison(restaurant){
                var min = restaurant[0].DeliveryEtaMinutes.RangeLower
                for( var i in restaurant){
                    if(restaurant[i].DeliveryEtaMinutes.RangeLower<min){
                        min=restaurant[i].DeliveryEtaMinutes.RangeLower
                    }
                }
                return min
            },
            bestPriceLivraison(restaurant){
                var min = restaurant[0].DeliveryCost
                for( var i in restaurant){
                    if(restaurant[i].DeliveryCost<min){
                        min=restaurant[i].DeliveryCost
                    }
                }
                return min
            },
            setDetail(api,details,restaurant) {
                details.restaurant_ids[api]= restaurant.Id
                if (api=="uber_eat") {
                    details.formattedAddress = restaurant.Address.FirstLine
                    details.userQuery = this.userQuery
                }
                return details
            },
            moveToDetail(){
                let details = {
                    restaurant_ids: {
                        "uber_eat": '',
                        "deliveroo": '',
                        "just_eat": '',
                    },
                    lat: this.latitude,
                    lon: this.longitude,
                    formattedAddress: '',
                    userQuery: ''
                }
                this.restaurant.forEach(restaurant => details = this.setDetail(restaurant.Api,details,restaurant))
                console.log(details)
                this.$router.push({path: `/restaurant/4`, query: {detailsPass:details}})
            }
        }
    }
</script>

<style scoped>
    .listeCards{
        text-align: left;
        margin:10px;
        width: 100%;
        display: inline-block;
    }

    .nomRestaurant{
        margin:20px;
        margin-left: 40px;
    }

    .nomTypes{
        margin-top:20%;
        margin-left: 60px;
        color:gray;
    }

    .nomType{
        margin-right: 5px;
    }

    .colCards{
        width:20%;
    }

    .notes{
        margin-top: 20px;
    }

    .premiereLigne{
        height: 30px;
        width:100%;
    }

    .photo{
        text-align: right;
        padding:0px;
        margin:0px;
    }

    .colDifLivreurs{
        margin-top:40px;
    }

    .livraison{
        padding:20px;
        margin:5px;
    }

    .open{
        filter: opacity(20%)
    }

    .offres{
        color:green;
        margin-left: 60px;
    }

    .best{
        font-weight: bold;
    }


.go-corner {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 32px;
  height: 32px;
  overflow: hidden;
  top: 0;
  right: 0;
  background-color: #FFC107;
  border-radius: 0 4px 0 32px;
}

.go-arrow {
  margin-top: -4px;
  margin-right: -4px;
  color: white;
  font-family: courier, sans;
}

.card1 {
  display: block;
  position: relative;
  border-radius: 4px;
  text-decoration: none;
  z-index: 0;
  overflow: hidden;
  text-decoration: none;
  color: black; 
}
  .card1:before {
    content: "";
    position: absolute;
    z-index: -1;
    top: -16px;
    right: -16px;
    background: #FFC107;
    height: 32px;
    width: 32px;
    border-radius: 32px;
    transform: scale(1);
    transform-origin: 50% 50%;
    transition: transform 0.5s ease-out;
  }

  .card1:hover:before {
    transform: scale(100);
  }

.card1:hover{
    transition: all 0.5s ease-out;
    color: #ffffff;
}

.card1:hover h1, .card1:hover h4, .card1:hover .v-card__title {
    color:white;
    transition: all 0.5s ease-out;
}

.card1:hover .v-image {
    filter: opacity(20%);
}
</style>