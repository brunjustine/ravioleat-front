<template>
  <div id="restaurant-details">
    <v-container>
      <v-row>
        <v-col>
          <h1>
            {{ name }}
          </h1>
          <h4 v-if="!(isLoading == endLoading)">
            <v-icon dark >
              mdi-map-marker
            </v-icon>{{ address }}
          </h4>
        </v-col>
        <v-col>
          <v-chip
            v-for="categorie in categories" :key="categorie.Id" style="color: gray"
            link
            outlined
          >
            {{ categorie.Name }}
          </v-chip>
        </v-col>
      </v-row>     
    </v-container>
    <div v-if="isLoading == endLoading" class="gif-center">
      <!--<div id="chargement" class="gif-center">-->
      <img 
        src="@/assets/ravioli2.gif"
        alt="gif de ravioli qui marche"
        width="5%"
      />
    </div>

    <div v-if="applications.length > 1">
      <v-toolbar>
        <v-tabs
          dark
          background-color="#000000"
          grow
        >
        <v-tabs-slider color="#FFC107"></v-tabs-slider>
          <v-tab @click="priceSort()">
              Le moins cher
          </v-tab>

          <v-tab @click="fastSort()">
              Le plus rapide
          </v-tab>

          <v-tab @click="bestSort()">
              Le meilleur
          </v-tab>
        </v-tabs>
      </v-toolbar>
    </div>
    <div>
      <v-expansion-panels
        multiple
        v-model="panel">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <v-spacer></v-spacer>
              <h2>Livreurs</h2>
            <v-spacer></v-spacer>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-container>
              <v-row>
                <v-col v-for="(application,index) in applications" :key="application.name">
                  <application-card 
                              :appli-name="application.name"
                              :delivery-e-t-a="application.deliveryETA"
                              :delivery-cost="application.deliveryCost"
                              :url-link="application.urlLink"
                              :rating="application.rating"
                              :devise="devise"
                              :offers="application.offers"
                              :isBest="index==0"
                              style="margin: 20px">
                  </application-card>
                </v-col>
              </v-row>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel v-if="has_menus">
          <v-expansion-panel-header>
            <v-spacer></v-spacer>
            <h2>Menus</h2>
            <v-spacer></v-spacer>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="item">
              <item-card v-for="item in filteredItems(items)"
                         :key="item.Id"
                         :item-name="item.Name"
                         :item-description="item.Description"
                         :item-price="Number(item.Price)"
                         :devise="devise"
                         style="margin: 5px auto;">
              </item-card>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        </v-expansion-panels>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import ApplicationCard from "./ApplicationCard";
  import ItemCard from "./ItemCard";
  export default {
    name: "Restaurant",
    components: {ItemCard, ApplicationCard},
    data() {
      return {
        name: '',
        address: '',
        categories: [],
        details: [],
        restaurant_id: '',
        restaurant: {},
        applications: [],
        items: [],
        devise: '',
        panel: [0,1],
        has_menus: false,
        activeClass: 'show-gif',
        hideClass: 'hide-gif',
        isBest: false,
        isLoading:0 ,
        endLoading:-1    
      }
    },
    created() {
      if (localStorage.getItem('current_restaurant_details') === undefined || localStorage.getItem('current_restaurant_details') === null) {
        this.$router.push({path: '/'});
      } else {
        localStorage.setItem('expiration', Date.now())
        this.details = JSON.parse(localStorage.getItem('current_restaurant_details'))
        this.getRestaurant(this.details.restaurant_ids);
        this.devise = localStorage.getItem('devise') === undefined ? '' : localStorage.getItem('devise')
      }
    },
    methods: {
      getRestaurant(restaurant_ids) {
        var first_key;
        this.endLoading = Object.keys(restaurant_ids).filter(key=> restaurant_ids[key]!=="").length-1;
        Object.keys(restaurant_ids).forEach((key,i) =>{
          if (restaurant_ids[key] !== "") {
            if (first_key === undefined) { first_key = key }
            axios.post(`http://${process.env.VUE_APP_API_IP}:${process.env.VUE_APP_API_PORT}/restaurant/` + restaurant_ids[key].toString(),
              {
                "lat": this.details.lat,
                "lon": this.details.lon,
                "formattedAddress": this.details.formattedAddress,
                "userQuery": this.details.userQuery,
                "api": key,
              })
              .then(res => {
                this.restaurant[key] = res.data.data;
                //console.log(res.data.data);
                this.getApplications(this.restaurant[key]);
                if (this.restaurant[key]['Menus'].length !== 0 && this.items.length === 0 ) {
                  this.items = this.restaurant[key]['Menus'];
                  this.has_menus = true;
                }
                if (this.restaurant[first_key] !== undefined) {
                  this.name = this.restaurant[first_key]['Name'];
                  this.address = this.restaurant[first_key]['Address']['FirstLine'];
                  this.categories = this.restaurant[first_key]['CuisineTypes'];
                }
                this.isLoading = this.isLoading+1;
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
        
      },
      getApplications(restaurant) {
        this.applications.push(
          {
            "name": restaurant['Api'],
            "deliveryETA": restaurant['DeliveryEtaMinutes'],
            "deliveryCost": Number(restaurant['DeliveryCost']),
            "urlLink": restaurant['Url'],
            "rating": restaurant['Rating'],
            "offers": restaurant['Offers']});
      },
      filteredItems(items){
        return items.filter((v,i,a)=> a.findIndex(t=>(t.Id === v.Id))===i)
      },
      priceSort() {
        return this.applications.sort((application1, application2) =>
          application1.deliveryCost - application2.deliveryCost
        )
      },
      fastSort() {
        return this.applications.sort((application1, application2) =>
          application1.deliveryETA.RangeLower - application2.deliveryETA.RangeLower)
      },
      bestSort() {
        return this.applications.sort((application1, application2) =>
          (application1.deliveryCost + application1.deliveryETA.RangeLower/10 - application1.offers.length - application1.rating.StarRating) -
          (application2.deliveryCost + application2.deliveryETA.RangeLower/10 - application2.offers.length - application2.rating.StarRating))
      }, 
      getIsLoading(value) {
        this.isLoading =value;
      }
    },
  }

</script>

<style scoped>
  .button {
    margin: 10px;
  }
  
  .item {
    display: flex;
    flex-wrap: wrap;
  }

  #restaurant-details {
    margin-top: 50px;
  }

  .v-expansion-panel-header {
  }

  .gif-center {
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    z-index: 9999;
    position: fixed;
  }

  .gif-center img{
    margin-top: 50vh; 
    transform: translateY(-50%); 
  }

  .theme--light.v-btn.v-btn--has-bg {
    background-color:#FFC107;
  }

  .v-tabs--grow>.v-tabs-bar .v-tab {
    color:white    
  }

  #restaurant-details h1, #restaurant-details h4 {
    text-align: left;
  }

   #restaurant-details .v-ship {
     text-align:right;
   }
   .mdi-map-marker::before {
     color:#FFC107;
   }
  

</style>
