<template>
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
        <v-btn
          depressed
          color="amber"
          v-on:click="rechercheSansFiltre()"
          v-if="affichageRecherche"
          >Rechercher</v-btn
        >
      </v-row>
      <div class="listeAdresse">
        <v-list>
          <v-list-item-group v-model="numAdresses" color="amber">
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
</template>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
<script>
export default {
  name: "DashboardLocation",
  data: function () {
    return {
      inputCity: "", //adresse
      numAdresses: "",
      pays: ["France", "Royaume-Uni"],
      PaysChoisit: "",
      suggestionsHere: [], // Tableau qui contiendra les suggestions Here
      suggestionSelected: "", // Adresse selectionnées
      longitude: 0,
      latitude: 0,
      affichageRecherche: false,
    };
  },
  methods: {
    onKeypressCity(e) {
      var url;
      if (this.inputCity != undefined && this.inputCity.length > 2) {
        // Call API Suggestions de HERE pour réécupérer les informations
        if (this.PaysChoisit == "Royaume-Uni") {
          url = "https://api.ideal-postcodes.co.uk/v1/autocomplete/addresses?api_key=iddqd&limit=10&query=".concat(
            this.inputCity
          );
        } else if (this.PaysChoisit == "France") {
          url = "https://api-adresse.data.gouv.fr/search/?q="
            .concat(this.inputCity)
            .concat("&autocomplete=1&limit=10");
        }
        fetch(url)
          .then((result) => result.json())
          .then(
            (result) => {
              var datas = [];
              let devise= "";
              if (this.PaysChoisit == "Royaume-Uni") {
                devise = "£";
                if (result.result.hits && result.result.hits.length > 0) {
                  result.result.hits.map(function (sug) {
                    datas.push(sug.suggestion);
                  });
                  this.suggestionsHere = datas;
                }
              } else if (this.PaysChoisit == "France") {
                devise = "€";
                if (result.features && result.features.length > 0) {
                  result.features.map(function (sug) {
                    datas.push(sug.properties.label);
                  });
                  this.suggestionsHere = datas;
                }
              }
              localStorage.setItem("devise", devise);
            },
            (error) => {
              console.error(error);
            }
          );
      } else {
        this.suggestionsHere = [];
      }
      this.$emit('inputCity', this.inputCity);
      this.$emit('PaysChoisit', this.PaysChoisit);
      
    },
    onClickSuggestHere(suggestion) {
      // On renseigne la ville sélectionner
      this.suggestionSelected = suggestion.lib;

      // On reset la recherche
      this.inputCity = "";
      this.suggestionsHere = [];
      this.$emit('inputCity', this.inputCity)
    },
    changeAdresse(suggestion) {
      this.affichageRecherche =true
      this.inputCity = suggestion;
      this.suggestionsHere = [];
      this.$emit('inputCity', this.inputCity)
    },
    rechercheSansFiltre(){
        this.$emit('filter')
    }
  },
};
</script>

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
</style>