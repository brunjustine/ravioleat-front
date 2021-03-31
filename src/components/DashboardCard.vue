<template>
    <div>
        <v-card class="listeCards">
            <v-list-item-content class="contenuCards" >
                <v-row  class="premiereLigne">
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
                        <v-list-item class="nomTypes"><font v-for="type in calculTypes(restaurant,[])" :key="type" class="nomType" >{{type}}</font></v-list-item>
                    </v-col>
                    <v-col cols="5" class="colDifLivreurs">
                        <v-row>
                            <v-col>
                                <v-card-title>Délais : </v-card-title>
                                <v-card-text>
                                    <v-chip class="tempsLivraison" v-for="resto in restaurant" :key="resto.id">{{resto.Api}} <font v-if="resto.DeliveryEtaMinutes!=null">: {{resto.DeliveryEtaMinutes.RangeLower}} - {{resto.DeliveryEtaMinutes.RangeUpper}} min</font></v-chip>
                                </v-card-text>
                            </v-col>
                            <v-col>
                                <v-card-title>Frais de livraison : </v-card-title>
                                <v-card-text>
                                    <v-chip class="tempsLivraison" v-for="resto in restaurant" :key="resto.id">{{resto.Api}} : {{resto.DeliveryCost}}{{devise}} </v-chip>
                                </v-card-text>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col  cols="3">
                    </v-col>
                </v-row>
            </v-list-item-content>
        </v-card>      
    </div>
</template>

<script>
    export default {
        name: "DashboardCard",
        props: {
            restaurant: Array, 
            devise: String
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
            calculTypes(sameRestaurants,res){
                var typesSameRestaurant=[];
                for(var restaurantNum in sameRestaurants){
                    for(var typeNum in sameRestaurants[restaurantNum].CuisineTypes){
                    typesSameRestaurant.push(sameRestaurants[restaurantNum].CuisineTypes[typeNum].Name)
                    }
                }
                res = typesSameRestaurant.filter(this.listeUnique)
                return res
            },
            listeUnique(value, index, self) {
                return self.indexOf(value) === index;
            },
        }
    }
</script>

<style scoped>
    .listeCards{
        text-align: left;
        margin:10px;
        width: 100%;
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

    .tempsLivraison{
        margin:5px;
    }
</style>