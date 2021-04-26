<template>
  <div>
    <div>
      <v-btn class="button" @click="priceSort()">Le moins cher</v-btn>
      <v-btn class="button" @click="fastSort()">Le plus rapide</v-btn>
      <v-btn class="button" @click="bestSort()">Le meilleur</v-btn>
    </div>
    <div>
      <v-expansion-panels
        multiple
        v-model="panel">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <v-spacer></v-spacer>
              <h2>Applications</h2>
            <v-spacer></v-spacer>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <application-card v-for="application in applications"
                              :key="application.name"
                              :appli-name="application.name"
                              :delivery-e-t-a="application.deliveryETA"
                              :delivery-cost="application.deliveryCost"
                              :url-link="application.urlLink"
                              :rating="application.rating"
                              :devise="devise"
                              style="margin: 20px">
            </application-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header>
            <v-spacer></v-spacer>
            <h2>Menus</h2>
            <v-spacer></v-spacer>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="item">
              <item-card v-for="item in items"
                         :key="item.Id"
                         :item-name="item.Name"
                         :item-description="item.Description"
                         :item-price="item.Price"
                         :devise="devise"
                         style="margin: 5px; width: 31%">
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
        details: [],
        restaurant_id: '',
        restaurant: {},
        applications: [],
        items: [],
        devise: '',
        panel: [0,1]
      }
    },
    created() {
      console.log(JSON.parse(localStorage.getItem('current_restaurant_details')))
      this.details = JSON.parse(localStorage.getItem('current_restaurant_details'))
      this.getRestaurant(this.details.restaurant_ids);
      this.devise = localStorage.getItem('devise') === undefined ? '' : localStorage.getItem('devise')
    },
    methods: {
      getRestaurant(restaurant_ids) {
        Object.keys(restaurant_ids).forEach(key => {
          if (restaurant_ids[key] !== "") {
            axios.post('http://0.0.0.0:5000/restaurant/' + restaurant_ids[key],
              {
                "lat": this.details.lat,
                "lon": this.details.lon,
                "formattedAddress": this.details.formattedAddress,
                "userQuery": this.details.userQuery,
                "api": key,
              })
              .then(res => {
                this.restaurant[key] = res.data.data;
                // console.log(res.data.data);
                this.getApplications(this.restaurant[key]);
                if (this.restaurant[key]['Menus'] !== [] && this.items.length === 0 ) {
                  this.items = this.restaurant[key]['Menus']
                }
                console.log(this.items)
              })
              .catch(err => {
                console.log(err);
              });
          }
        })
      },
      getApplications(restaurant) {
        this.applications.push(
          {
            "name": restaurant['Api'],
            "deliveryETA": restaurant['DeliveryEtaMinutes'],
            "deliveryCost": restaurant['DeliveryCost'],
            "urlLink": restaurant['Url'],
            "rating": restaurant['Rating']});
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
          (application1.deliveryCost + application1.deliveryETA.RangeLower) -
          (application2.deliveryCost + application2.deliveryETA.RangeLower))
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

</style>
