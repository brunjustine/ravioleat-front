<template>
  <div>
    <v-app>
      <v-card id="cardRecherche">
        <v-container fluid>
          <v-row align="center">
            <div class="inputPays">
            <!--Pays-->
            <!--<v-subheader class="TitreRecherche">Pays</v-subheader>-->
            <v-select
              v-model="PaysChoisit"
              :items="pays"
              label="Votre Pays"
            ></v-select>
          </div>
          <!--Localisation-->
          <!--<v-subheader class="TitreRecherche">Votre adresse</v-subheader>-->
            <v-text-field
              class="inputAdresse"
              v-model="inputCity"
              label="Inscrire votre adresse"
              v-on:keyup.native="onKeypressCity($event)"
              v-on:keydown.native="onKeypressCity($event)"
            ></v-text-field>
          <v-btn depressed color="primary" v-on:click="rechercheSansFiltre()" v-if="affichageRecherche">Rechercher</v-btn>
          </v-row>
          <div class="listeAdresse">
            <v-list>
              <v-list-item-group v-model="numAdresses" color="primary">
                <v-list-item v-for="suggestion in suggestionsHere" :key="suggestion">
                  <v-list-item-content v-on:click="changeAdresse(suggestion)">
                    <v-list-item-title v-text="suggestion"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </v-container>
      </v-card>
      <div class="filtre-CardsRestaurants">

        <!--FILTRAGE-->
        <v-card id="cardFiltre" v-if="affichageFiltre">
          <!--Type-->
          <v-subheader class="TitreRecherche">Type de Nourriture</v-subheader>
          <v-select v-model="typeChosit" :items="typeNourriture" multiple></v-select>
          <!--Offres-->
          <v-checkbox v-model="offre" label="Restaurants avec des offres"></v-checkbox>
          <!--Délais de livraison max-->
          <v-subheader class="TitreRecherche">Délais livraison max</v-subheader>
          <v-card-text>
            <v-row>
              <v-col class="px-4">
                <v-slider v-model="delais" thumb-label="always" :min="10" :max="120" step="5" ></v-slider>
              </v-col>
            </v-row>
          </v-card-text>
          <!--Frais de livraison-->
          <v-subheader class="TitreRecherche">Frais de livraison</v-subheader>
          <v-slider v-model="fraisLivraison" :tick-labels="choixFraisLivraison" step="1" ticks="always" tick-size="4" :max="3"></v-slider>
          <!--Notes-->
          <v-subheader class="TitreRecherche">Notes</v-subheader>
          <v-rating v-model="note" background-color="orange lighten-3" color="orange" large></v-rating>
          <v-btn depressed color="primary" v-on:click="filtrerRecherche()" >Filtrer</v-btn>
        </v-card>

        <!--CARTES RESTAURANTS-->
        <div id="contenantListeCards">
          <v-list-item v-for="restaurant in allRestaurants" :key="restaurant[0].Name">
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
                          <v-chip class="tempsLivraison" v-for="resto in restaurant" :key="resto.id">{{resto.Api}} : {{resto.DeliveryEtaMinutes.RangeLower}} - {{resto.DeliveryEtaMinutes.RangeUpper}} min</v-chip>
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
          </v-list-item>
        </div>
      </div>
    </v-app>
  </div>
</template>

<style scoped>
#cardRecherche {
  margin-left: 18%;
  margin-right: 5%;
  padding: 15px;
}

.inputPays{
  width:20%;
  margin-right: 20px;
}

.inputAdresse{
  margin-right: 20px;
}

#cardFiltre{
  height: min-content;
  margin:2%;
  padding: 15px;
}

.prixAffichage {
  width: 60px;
}

.TitreRecherche {
  
  font-size: 20px;
}

.listeAdresse{
  padding-left:20%;
  position:absolute;
}

.filtre-CardsRestaurants{
  margin: 0;
  display: flex;
  flex-wrap: wrap;
}

#contenantListeCards{
  padding: 15px;
  margin:15px;
  width: 75%;
}

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

<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>

<script>
import axios from 'axios';

export default {
  name: "Dashboard",
  data: () => ({
      inputCity: "", //adresse
      numAdresses: "",
      pays: ["France", "Royaume-Unis"],
      PaysChoisit: "",
      suggestionsHere: [], // Tableau qui contiendra les suggestions Here
      suggestionSelected: "", // Adresse selectionnées
      longitude:0,
      latitude: 0 ,
      allRestaurants:[],
      affichageRecherche:false,
      affichageFiltre: false,
      offre:false,
      devise:"",
      filtrer : false,
      delais: 120,
      choixFraisLivraison: ["3","5","7","7+"],
      fraisLivraison:3,
      typeChosit:[],
      typeNourriture: ['Fast Food','Burgers','Pizza','Asiatique','Sushis','Cuisine Saine', 'Halal', 'Indienne','Petit déjeuné'],
      note:0,
  }),
  methods: {
    onKeypressCity(e) {
      var url;
      if (this.inputCity != undefined && this.inputCity.length>2) {
        // Call API Suggestions de HERE pour réécupérer les informations
        if (this.PaysChoisit == "Royaume-Unis") {
          url = "https://api.ideal-postcodes.co.uk/v1/autocomplete/addresses?api_key=iddqd&limit=10&query=".concat(
            this.inputCity
          );
        } else if ((this.PaysChoisit = "France")) {
          url = "https://api-adresse.data.gouv.fr/search/?q="
            .concat(this.inputCity)
            .concat("&autocomplete=1&limit=10");
        }
        fetch(url)
          .then((result) => result.json())
          .then(
            (result) => {
              var datas = [];
              if (this.PaysChoisit == "Royaume-Unis") {
                this.devise="$"
                if (result.result.hits && result.result.hits.length > 0) {
                  result.result.hits.map(function (sug) {
                    datas.push(sug.suggestion);
                  });
                  console.log(datas);
                  this.suggestionsHere = datas;
                }
              } else if ((this.PaysChoisit = "France")) {
                this.devise="€"
                if (result.features && result.features.length > 0) {
                  result.features.map(function (sug) {
                    datas.push(sug.properties.label);
                  });
                  this.suggestionsHere = datas;
                }
              }
            },
            (error) => {
              console.error(error);
            }
          );
      } else {
        this.suggestionsHere = [];
      }
    },
    onClickSuggestHere(suggestion) {
      // On renseigne la ville sélectionner
      this.suggestionSelected = suggestion.lib;

      // On reset la recherche
      this.inputCity = "";
      this.suggestionsHere = [];
    },
    changeAdresse(suggestion) {
      this.affichageRecherche = true;
      this.inputCity = suggestion;
      this.suggestionsHere = [];
    },
    rechercheSansFiltre(){
     this.affichageFiltre=true;
     var url;
     if (this.PaysChoisit == "Royaume-Unis") {
          url = "https://api.ideal-postcodes.co.uk/v1/addresses?api_key=iddqd&query=".concat(this.inputCity);
        } else if ((this.PaysChoisit = "France")) {
          url = "https://api-adresse.data.gouv.fr/search/?q="
            .concat(this.inputCity)
        }
        fetch(url)
          .then((result) => result.json())
          .then(
            (result) => {
              var datas = [];
              if (this.PaysChoisit == "Royaume-Unis") {
                if (result.result.hits && result.result.hits.length > 0) {
                  this.longitude=result.result.hits[0].longitude
                  this.latitude=result.result.hits[0].latitude
                }
              } else if ((this.PaysChoisit = "France")) {
                if (result.features && result.features.length > 0) {
                  this.longitude=result.features[0].geometry.coordinates[0];
                  this.latitude=result.features[0].geometry.coordinates[1];
                }
              }
            },
            (error) => {
              console.error(error);
            }
          );
       /*const path = 'http://127.0.0.1:5000/restaurants';
      axios.get(path)
        .then((res) => {

        })
        .catch((error) => {
          console.error(error);
        });
      */
      var restaurants=[
        {"Api":"deliveroo","Id": 1, "Name": "AAAA","UniqueName": "aaaa", "Rating": {"Count": "(150)","StarRating": 4.5},"Url": "urlaaa", "LogoUrl": "https://fac.img.pmdstatic.net/fit/http.3A.2F.2Fprd2-bone-image.2Es3-website-eu-west-1.2Eamazonaws.2Ecom.2Ffac.2F2018.2F07.2F30.2F509a5313-6545-4cb1-ad93-af5895dd35b6.2Ejpeg/850x478/quality/90/crop-from/center/pizza-royale.jpeg","DeliveryEtaMinutes": {"RangeLower": 15, "RangeUpper": 20}, "IsOpenNow": true,"DeliveryCost": 1.5,"Offers": [{"Description": "Offre", "OfferId": 15 }], "CuisineTypes": [{"Id": 5, "Name": "Pizza","SeoName": "pizza"}],"PriceCategory": 1,},
        {"Api":"just-eat","Id": 2, "Name": "BBBB","UniqueName": "bbbb", "Rating": {"Count": "(300)","StarRating": 3.5},"Url": "urlbbb", "LogoUrl": "https://www.mycuisine.com/wp-content/uploads/2018/12/burger-rossini.jpg","DeliveryEtaMinutes": {"RangeLower": 20, "RangeUpper": 25}, "IsOpenNow": true,"DeliveryCost": 2.8,"Offers": [], "CuisineTypes": [{"Id": 8, "Name": "Burger","SeoName": "burger"}],"PriceCategory": 2,},
        {"Api":"deliveroo","Id": 3, "Name": "CCCC","UniqueName": "cccc", "Rating": {"Count": "(800)","StarRating": 2.9},"Url": "urlccc", "LogoUrl": "https://img.grouponcdn.com/deal/2mEoAK1pYRLD99WymW3SpgkjPeVe/2m-960x576/v1/c700x420.jpg","DeliveryEtaMinutes": {"RangeLower": 20, "RangeUpper": 25}, "IsOpenNow": false,"DeliveryCost": 1.8,"Offers": [], "CuisineTypes": [{"Id": 5, "Name": "Pizza","SeoName": "pizza"},{"Id": 15, "Name": "Burger","SeoName": "burger"}],"PriceCategory": 2,},
        {"Api":"deliveroo","Id": 4, "Name": "DDDD","UniqueName": "dddd", "Rating": {"Count": "(80)","StarRating": 5},"Url": "urlddd", "LogoUrl": "https://anoonce.fr/wp-content/uploads/2018/07/Nourriture-indienne.jpg","DeliveryEtaMinutes": {"RangeLower": 20, "RangeUpper": 25}, "IsOpenNow": true,"DeliveryCost": 0.0,"Offers": [{"Description": "Super Offre", "OfferId": 12 }], "CuisineTypes": [{"Id": 5, "Name": "Indien","SeoName": "indien"}],"PriceCategory": 1,},
        {"Api":"uber-eats","Id": 5, "Name": "AAAA","UniqueName": "aaaa", "Rating": {"Count": "(300)","StarRating": 4.3},"Url": "urlaaa", "LogoUrl": "https://fac.img.pmdstatic.net/fit/http.3A.2F.2Fprd2-bone-image.2Es3-website-eu-west-1.2Eamazonaws.2Ecom.2Ffac.2F2018.2F07.2F30.2F509a5313-6545-4cb1-ad93-af5895dd35b6.2Ejpeg/850x478/quality/90/crop-from/center/pizza-royale.jpeg","DeliveryEtaMinutes": {"RangeLower": 20, "RangeUpper": 25}, "IsOpenNow": true,"DeliveryCost": 2,"Offers": [{"Description": "Offre", "OfferId": 15 }], "CuisineTypes": [{"Id": 5, "Name": "Pizza","SeoName": "pizza"},{"Id": 18, "Name": "Italie","SeoName": "italie"}],"PriceCategory": 3,},      
        ]
      var allRestaurant=[];
      for (var restaurantNum1 in restaurants){
        var restaurant= restaurants[0]
        var sameRestaurant=[]
        sameRestaurant.push(restaurant)
        for (var restaurantNum2 in restaurants){
          if(restaurant.Name==restaurants[restaurantNum2].Name && restaurantNum2!=0){
            sameRestaurant.push(restaurants[restaurantNum2])
          }
        }
        restaurants.shift()
        allRestaurant.push(sameRestaurant)
      }
      this.allRestaurants=allRestaurant
    },
    filtrerRecherche(){

    },
    calculTypes(sameRestaurants,res){
      var typesSameRestaurant=[];
      for(var restaurantNum in sameRestaurants){
        for(var typeNum in sameRestaurants[restaurantNum].CuisineTypes){
          typesSameRestaurant.push(sameRestaurants[restaurantNum].CuisineTypes[typeNum].Name)
        }
      }
      var res = typesSameRestaurant.filter(this.listeUnique)
      return res
    },
    listeUnique(value, index, self) {
      return self.indexOf(value) === index;
    },
    starAverage(sameRestaurants){
      var average=0;
      for(var restaurantNum in sameRestaurants){
        average=average+sameRestaurants[restaurantNum].Rating.StarRating
      }
      average=average/sameRestaurants.length
      console.log(average)
      return average
    }
  },
};
</script>