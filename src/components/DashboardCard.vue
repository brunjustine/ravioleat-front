<template>
    <div>
        <v-card class="listeCards" v-on="restaurant[0].IsOpenNow ? {click: () => moveToDetail()} : {}">
            <a v-bind:class="{ card1: restaurant[0].IsOpenNow}" href="#">
            <div v-bind:class="{ open: !restaurant[0].IsOpenNow}">
                <v-list-item-content class="contenuCards" >
                    <v-row rows="2" class="premiereLigne">
                        <v-col cols="5">
                            <v-list-item class="nomRestaurant"><h1>{{restaurant[0].Name}}</h1></v-list-item> 
                        </v-col>
                        <v-col cols="3" class="colCards">
                            <v-list-item class="notes"><v-rating background-color="#1785B3" color="#1785B3" :value="starAverage(restaurant)" half-icon="mdi-star-half" half-increments readonly ></v-rating></v-list-item>
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
                        <v-col v-if="restaurant[0].IsOpenNow" cols="5" class="colDifLivreurs">
                            <v-row>
                                <v-col>
                                    <v-card-title>Délais  </v-card-title>
                                    <v-card-text v-for="resto in restaurant" :key="resto.id">
                                         <v-container>
                                            <v-row>
                                                <v-col cols="2">
                                                    <span>
                                                        <img width="30px" height="30px" :src="require('/src/assets/logos/'+resto.Api+'.png')"> 
                                                    </span>
                                                </v-col>
                                                <v-col cols="8">
                                                    <v-chip >  
                                                        <font v-bind:class="{ best: bestTimeLivraison(restaurant,resto)}" v-if="resto.DeliveryEtaMinutes!=null"> {{resto.DeliveryEtaMinutes.RangeLower}} - {{resto.DeliveryEtaMinutes.RangeUpper}} min  
                                                            <v-icon v-if=" bestTimeLivraison(restaurant,resto)" color="red darken-2"> mdi-run-fast</v-icon>  
                                                        </font> 
                                                    </v-chip>
                                                </v-col>
                                            </v-row>
                                         </v-container>
                                    </v-card-text>
                                </v-col>
                                <v-col>
                                    <v-card-title>Frais de livraison  </v-card-title>
                                    <v-card-text  v-for="resto in restaurant" :key="resto.id" class="delivery-fees">
                                        <v-container>
                                            <v-row>
                                                <v-col cols="2">
                                                    <span>
                                                        <img width="30px" height="30px"  :src="require('/src/assets/logos/'+resto.Api+'.png')">
                                                    </span>
                                                </v-col>
                                                <v-col cols="10">
                                                    <v-chip> 
                                                        <font v-bind:class="{ best: resto.DeliveryCost==bestPriceLivraison(restaurant)}">  {{resto.DeliveryCost}}{{devise}} 
                                                            <v-icon v-if="resto.DeliveryCost==bestPriceLivraison(restaurant)" color="green darken-4"> mdi-cash-multiple</v-icon>
                                                        </font>
                                                    </v-chip>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col  cols="3">
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </div>
            <div v-if="restaurant[0].IsOpenNow" class="go-corner" href="#">
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
            latitude: Number,
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
            bestTimeLivraison(restaurant, resto){
                var min = restaurant[0]
                var tabMin =[min]
                var i =1
                for( i in restaurant){
                    if(parseInt(restaurant[i].DeliveryEtaMinutes.RangeLower)<parseInt(min.DeliveryEtaMinutes.RangeLower)){
                        min=restaurant[i]
                        tabMin=[]
                        tabMin.push(min)
                    }else if(parseInt(restaurant[i].DeliveryEtaMinutes.RangeLower)==parseInt(min.DeliveryEtaMinutes.RangeLower )){
                        if(parseInt(restaurant[i].DeliveryEtaMinutes.RangeUpper)<parseInt(min.DeliveryEtaMinutes.RangeUpper)){
                            min=restaurant[i]
                            tabMin=[]
                            tabMin.push(restaurant[i])
                        } else if(parseInt(restaurant[i].DeliveryEtaMinutes.RangeUpper)==parseInt(min.DeliveryEtaMinutes.RangeUpper)){
                            tabMin.push(restaurant[i])
                        }
                    }
                }
                return this.restoInTabMin(tabMin,resto)
            },
            restoInTabMin(tabMin,resto){
                var res = false;
                for(var i in tabMin){
                    if(tabMin[i]==resto){
                        res = true;
                    }
                }
                return res
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
                if (api==="uber_eat") {
                    details.formattedAddress = restaurant.Address.FirstLine
                    details.userQuery = this.userQuery
                }
                return details
            },
            moveToDetail(){
                localStorage.removeItem('current_restaurant_details')
                var details = {
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
                this.restaurant.forEach(restaurant => details = this.setDetail(restaurant.Api,details,restaurant));
                localStorage.setItem('current_restaurant_details', JSON.stringify(details));
                this.$router.push({path: `/restaurant/details`})
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

    .nomTypes h4{
        margin-top:20%;
        margin-left: 60px;
        font-weight:normal;
        color:#969a9c;
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

    
    .v-card__title {
        color:#1785B3;
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

.listeCards a {
    text-decoration: none;
    color: black; 
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
  color: black;
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
.card1:hover  h4{
    color:white;
    transition: all 0.5s ease-out;
}

 .card1:hover h1, .card1:hover .v-card__title {
    color:#1785B3;
    transition: all 0.5s ease-out;
}

.card1:hover .v-image {
    filter: opacity(20%);
}

.card1:hover .theme--light.v-chip:not(.v-chip--active) {
    background-color:#f8d878;
}

.theme--light.v-chip:not(.v-chip--active) {
    background-color:#daf1fb;
}

.delivery-fees .v-card__text{
    padding:0;
}
</style>
