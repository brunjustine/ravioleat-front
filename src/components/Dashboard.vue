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
              id = "adresse"
              label="Inscrire votre adresse"
              v-on:keyup.native="onKeypressCity($event)"
              v-on:keydown.native="onKeypressCity($event)"
            ></v-text-field>
            <v-btn
              depressed
              color="primary"
              v-on:click="rechercheSansFiltre()"
              v-if="inputCity.length>0"
              >Rechercher</v-btn
            >
          </v-row>
          <div class="listeAdresse">
            <v-alert type="warning" v-if="erreurAdresse" class="alertAdresse">Votre adresse n'est pas correcte</v-alert>
            <v-list v-if="showProposition">
              <v-list-item-group v-model="numAdresses" color="primary">
                <v-list-item
                  v-for="suggestion in suggestionsHere"
                  :key="suggestion"
                >
                  <v-list-item-content v-on:click="changeAdresse(suggestion)">
                    <v-list-item-title v-text="suggestion"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </v-container>
      </v-card>
      <div class="filtre-CardsRestaurants" v-on:click="deleteProposition()">

        <!--FILTRAGE-->
        <DashboardFilter
          v-if="affichageFiltre"
          v-bind:allRestaurants="this.allRestaurants"
          @filterRestaurants="filterRestaurants"
        />
        <!--CARTES RESTAURANTS-->
        <div id="contenantListeCards">
          <v-row align="center" v-if="allRestaurants.length>1" id="rechercheNom">
            <v-text-field class="inputName" v-model="inputName" label="Entrer un nom ou un mot-clé"></v-text-field>
            <v-btn depressed color="primary" v-on:click="rechercheParNom()">Rechercher</v-btn>
          </v-row>
          <div id="chargement" v-if="chargement" class="gif-center"> 
            <img  src="@/assets/ravioli2.gif" alt="gif de ravioli qui marche" width="5%">
          </div>
          <v-list-item
            v-for="restaurant in filteredRestaurants"
            :key="restaurant[0].Name"
          >
            <DashboardCard
              v-bind:restaurant="restaurant"
              v-bind:devise="devise"
              v-bind:userQuery="inputName"
              v-bind:longitude="longitude"
              v-bind:latitude="latitude"
            ></DashboardCard>
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

.inputPays {
  width: 20%;
  margin-right: 20px;
}

.inputAdresse {
  margin-right: 20px;
}

.prixAffichage {
  width: 60px;
}

.listeAdresse {
  position: absolute;
  left:310px;
  z-index: 5;
}

.filtre-CardsRestaurants {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  height: 100%;
}

#contenantListeCards {
  padding: 15px;
  margin: 15px;
  width: 75%;
}

#chargement {
  margin-top: 5rem;
}

#rechercheNom {
  margin: 2rem;
  width: 50%;
}

.inputName {
  margin-right: 2rem;
}

.gif-center {
  margin: 0 auto;
  text-align: center;
}

.alertAdresse{
  margin-top:25px;
}
</style>

<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>

<script>
import axios from "axios";
import DashboardCard from "./DashboardCard";
import DashboardFilter from "@/components/DashboardFilter.vue";



export default {
  name: "Dashboard",
  components: {
    DashboardCard,
    DashboardFilter,
  },
  data: () => ({
    inputCity: "", //adresse
    numAdresses: "",
    pays: ["France", "Royaume-Uni"],
    PaysChoisit: "",
    suggestionsHere: [], // Tableau qui contiendra les suggestions Here
    suggestionSelected: "", // Adresse selectionnées
    longitude: 0,
    latitude: 0,
    allRestaurants: [],
    filteredRestaurants: [],
    affichageRecherche: false,
    affichageFiltre: false,
    devise: "",
    chargement: false,
    inputName:"",
    erreurAdresse: false,
    showProposition: false
  }),
  methods: {
    onKeypressCity(e) {
      this.showProposition=true;
      this.erreurAdresse =  false;
      var url;
      if (this.inputCity != undefined && this.inputCity.length > 2) {
        // Call API Suggestions de HERE pour réécupérer les informations
        if (this.PaysChoisit == "Royaume-Uni") {
            url = "https://api.ideal-postcodes.co.uk/v1/autocomplete/addresses?api_key=iddqd&limit=10&query=".concat(
            this.inputCity
          );
        } else if ((this.PaysChoisit == "France")) {
          url = "https://api-adresse.data.gouv.fr/search/?q="
            .concat(this.inputCity)
            .concat("&autocomplete=1&limit=10");
        }
        fetch(url)
          .then((result) => result.json())
          .then(
            (result) => {
              var datas = [];
              if (this.PaysChoisit == "Royaume-Uni") {
                this.devise = "£";
                if (result.result.hits && result.result.hits.length > 0) {
                  result.result.hits.map(function (sug) {
                    datas.push(sug.suggestion);
                  });
                  this.suggestionsHere = datas;
                }
              } else if ((this.PaysChoisit == "France")) {
                this.devise = "€";
                if (result.features && result.features.length > 0) {
                  result.features.map(function (sug) {
                    datas.push(sug.properties.label);
                  });
                  this.suggestionsHere = datas;
                }
              }
              localStorage.setItem("devise",this.devise)
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
    rechercheSansFiltre() {
      this.suggestionsHere = [];
      var url;
      if (this.PaysChoisit == "Royaume-Uni") {
        url = "https://api.ideal-postcodes.co.uk/v1/addresses?api_key=iddqd&query=".concat(
          this.inputCity
        );
      } else if ((this.PaysChoisit = "France")) {
        url = "https://api-adresse.data.gouv.fr/search/?q=".concat(
          this.inputCity
        );
      }
      fetch(url)
        .then((result) => result.json())
        .then(
          (result) => {
            var datas = [];
            if (this.PaysChoisit == "Royaume-Uni") {
              if (result.result.hits && result.result.hits.length == 1) {
                this.longitude = result.result.hits[0].longitude;
                this.latitude = result.result.hits[0].latitude;
                this.chargement = true;
                this.initRestaurants();
              }else{
              this.erreurAdresse =  true
              }
            } else if ((this.PaysChoisit == "France")) {
              if (result.features && result.features.length == 1) {
                this.longitude = result.features[0].geometry.coordinates[0];
                this.latitude = result.features[0].geometry.coordinates[1];
                this.chargement = true;
                this.initRestaurants();
              }else{
              this.erreurAdresse =  true
              }
            }
            
          },
          (error) => {
            console.error(error);
          }
        );
    },
    initRestaurants() {
      const path = "http://127.0.0.1:5000/restaurants";
      var params = {
        lat: this.latitude.toString(),
        lon: this.longitude.toString(),
        formattedAddress: this.inputCity,
        userQuery: "",
      };
      axios.post(path, params).then((res) => {
        var restaurants = res["data"]["data"];
        this.regroupement(restaurants);
      });
    },
    regroupement(restaurants) {
      var allRestaurant = [];
      restaurants.forEach(function (restaurant) {
        var sameRestaurant = [];
        sameRestaurant.push(restaurant);
        for (var restaurantNum2 in restaurants) {
          if (
            restaurant.Api != restaurants[restaurantNum2].Api &&
            restaurant.Name == restaurants[restaurantNum2].Name 
          ) {
            sameRestaurant.push(restaurants[restaurantNum2]);
            restaurants.splice(restaurantNum2, 1)
          }
        }
        restaurants.shift();
        allRestaurant.push(sameRestaurant);
      })
      this.allRestaurants = allRestaurant;
      this.filteredRestaurants = this.allRestaurants;
      this.affichageFiltre = true;
      this.chargement = false;
    },
    async filterRestaurants(value){
      this.filteredRestaurants = value
    },
    rechercheParNom(inputName) {
      this.inputName = inputName
      this.chargement = true;
      const path = "http://127.0.0.1:5000/restaurants/search";
      var params = {
        lat: this.latitude.toString(),
        lon: this.longitude.toString(),
        formattedAddress: this.inputCity,
        searchTerm: this.inputName,
      };
      axios.post(path, params).then((res) => {
        var restaurants = res["data"]["data"];
        this.regroupement(restaurants);
      });
    },
    deleteProposition(){
      console.log("salut")
      this.showProposition=false
    }
  },
};
</script>
