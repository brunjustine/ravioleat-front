<template>
  <div>
    <v-app>
      <DashboardLocation
      @inputCity="SetInputCity"
      @PaysChoisit="SetPaysChoisit"
      v-on:filter="rechercheSansFiltre"
      v-bind:erreur="erreurAdresse"
      v-on:show="turnToShowProposition"
      v-on:showErreur="turnErreurOff"
      v-bind:show="showProposition"

      ></DashboardLocation>

      <div id="chargement" v-if="chargement" class="gif-center">
        <!--<div id="chargement" class="gif-center">-->
          <img
            src="@/assets/ravioli2.gif"
            alt="gif de ravioli qui marche"
            width="5%"
          />
      </div>

      <div class="filtre-CardsRestaurants" v-on:click="deleteProposition()">
        <!--FILTRAGE-->
        <DashboardFilter
          v-if="affichageFiltre"
          v-bind:allRestaurants="this.allRestaurants"
          @filterRestaurants="filterRestaurants"
        />

        <!--CARTES RESTAURANTS-->
        <div id="contenantListeCards">
          <DashboardSearch
            v-if="allRestaurants.length > 1"
            v-bind:allRestaurants="this.filteredRestaurants"
            @searchRestaurants="rechercheParNom"
          ></DashboardSearch>

          <div v-if="chargementSearch" class="gif-center">
          <!--<div id="chargement" class="gif-center">-->
            <img
              src="@/assets/ravioli2.gif"
              alt="gif de ravioli qui marche"
              width="5%"
            />
          </div>
          <div>
            <jw-pagination :pageSize="50" :items="filteredRestaurants" @changePage="onChangePage"></jw-pagination>
          </div>
          <v-list-item
              v-for="restaurant in pageOfRestaurants"
              :key="restaurant[0].Id"
          >
            <DashboardCard
                v-bind:restaurant="restaurant"
                v-bind:devise="devise"
                v-bind:userQuery="inputName"
                v-bind:longitude="longitude"
                v-bind:latitude="latitude"
            ></DashboardCard>
          </v-list-item>
          <div>
            <jw-pagination :pageSize="50" :items="filteredRestaurants" @changePage="onChangePage"></jw-pagination>
          </div>
        </div>
      </div>
    </v-app>
  </div>
</template>

<style scoped>

.prixAffichage {
  width: 60px;
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
}

</style>

<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>

<script>
import axios from "axios";
import { partial_ratio } from "fuzzball";
import DashboardCard from "./DashboardCard";
import DashboardFilter from "@/components/DashboardFilter.vue";
import DashboardSearch from "@/components/DashboardSearch.vue";
import DashboardLocation from "@/components/DashboardLocation.vue";

export default {
  name: "Dashboard",
  components: {
    DashboardCard,
    DashboardFilter,
    DashboardSearch,
    DashboardLocation,
  },
  data: () => ({
    inputCity: "", //adresse
    PaysChoisit: "",
    longitude: 0,
    latitude: 0,
    allRestaurants: [],
    filteredRestaurants: [],
    affichageFiltre: false,
    devise: "",
    chargement: false,
    chargementSearch:false,
    inputName : "",
    showProposition: false,
    erreurAdresse : false,
    pageOfRestaurants: []
    }),
  created() {
    if (localStorage.getItem('alreadySearch') === "true") {
      this.devise = localStorage.getItem('devise')
    }
  },
  methods: {
    onChangePage(pageOfRestaurants) {
      this.pageOfRestaurants = pageOfRestaurants;
      document.getElementById('contenantListeCards').scrollIntoView()
    },
    SetInputCity(value) {
      this.inputCity = value;
    },
    SetPaysChoisit(value) {
      this.PaysChoisit =value;
    },
    rechercheSansFiltre() {
      this.suggestionsHere = [];
      this.chargement = true;
      var url;
      if (this.PaysChoisit == "Royaume-Uni") {
        url = "https://api.ideal-postcodes.co.uk/v1/addresses?api_key=iddqd&query=".concat(
          this.inputCity
        );
      } else if ((this.PaysChoisit = "France")) {
        url = "https://api-adresse.data.gouv.fr/search/?q=".concat(
          this.inputCity
        );
      } else {
        console.log('Pas de pays choisi ..')
      }
      fetch(url)
        .then((result) => result.json())
        .then(
          (result) => {
            var datas = [];
            if (this.PaysChoisit == "Royaume-Uni") {
              if (result.result.hits && result.result.hits.length==1) {
                this.longitude = result.result.hits[0].longitude;
                this.latitude = result.result.hits[0].latitude;
                this.chargement = true;
                this.initRestaurants();
              }else{
                this.erreurAdresse =  true
                this.chargement = false;
              }
            } else if ((this.PaysChoisit == "France")) {
              if (result.features && result.features.length >0  && result.features[0].properties.score>0.9) {
                this.longitude = result.features[0].geometry.coordinates[0];
                this.latitude = result.features[0].geometry.coordinates[1];
                this.chargement = true;
                this.initRestaurants();
              }else{
                this.erreurAdresse =  true;
                this.chargement = false;
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
      restaurants.forEach(restaurant => {
        var sameRestaurant = [];
        sameRestaurant.push(restaurant);
        for (var restaurantNum2 in restaurants) {
          if (
            restaurant.Api != restaurants[restaurantNum2].Api &&
            partial_ratio(restaurant.UniqueName,restaurants[restaurantNum2].Name, {full_process: true})>90 &&
            partial_ratio(restaurant.Address.FirstLine.toLowerCase(),restaurants[restaurantNum2].Address.FirstLine.toLowerCase(), {full_process: true})>90
          ) {
            sameRestaurant.push(restaurants[restaurantNum2]);
            restaurants.splice(restaurantNum2, 1)
          }
        }
        allRestaurant.push(sameRestaurant);
      })
      allRestaurant.sort(restaurant => { return restaurant[0].IsOpenNow ? -1 : 1 })
      this.allRestaurants = allRestaurant;
      this.filteredRestaurants = this.allRestaurants;
      this.affichageFiltre = true;
      this.chargement = false;
      this.chargementSearch = false;
    },
    async filterRestaurants(value){
      this.filteredRestaurants = value
    },
    rechercheParNom(inputName) {
      this.chargementSearch = true;
      this.inputName = inputName
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
      this.showProposition = false;
    },
    turnToShowProposition(){
      this.showProposition = true;
    },
    turnErreurOff() {
      this.erreurAdresse =false;
    }
  },
};
</script>
