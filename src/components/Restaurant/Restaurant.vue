<template>
  <div>
    <div>
      <v-btn class="button" @click="priceSort()">Le moins cher</v-btn>
      <v-btn class="button" @click="fastSort()">Le plus rapide</v-btn>
      <v-btn class="button" @click="bestSort()">Le meilleur</v-btn>
    </div>
    <div>
      <application-card v-for="application in applications"
                        :key="application.name"
                        :appli-name="application.name"
                        :delivery-e-t-a="application.deliveryETA"
                        :delivery-cost="application.deliveryCost"
                        :url-link="application.urlLink"
                        :rating="application.rating"
                        style="margin: 20px">
      </application-card>
    </div>
    <div>
        <v-toolbar>
          <v-spacer></v-spacer>
          <v-toolbar-title>Menus</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
    </div>
    <div class="item">
      <item-card v-for="item in items"
                 :key="item.Id"
                 :item-name="item.Name"
                 :item-description="item.Description"
                 :item-price="item.Price"
                 style="margin: 5px; width: 31%">
      </item-card>
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
        restaurant_ids: {
          "uber_eat": "9dc9b606-f271-4782-8466-6d08b56816fb",
          "deliveroo": "68535",
          "just_eat": "16445",
        },
        lat: '',
        lon: '',
        formattedAddress: '',
        userQuery: '',
        restaurant_id: '',
        restaurant: {},
        applications: [],
        items: []
      }
    },
    created() {
      this.restaurant_id = this.$route.params['restaurant_id'];
      this.getRestaurant(this.restaurant_ids);
    },
    methods: {
      getRestaurant(restaurant_ids) {
        Object.keys(restaurant_ids).forEach(key => {
          if (restaurant_ids[key] !== "") {
            axios.post('http://0.0.0.0:5000/restaurant/' + restaurant_ids[key],
              {
                "lat": 51.5237703,
                "lon": -0.1607497,
                "formattedAddress": "211 Baker Street, London",
                "userQuery": "",
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

  .menus{
    text-align:center;
  }
</style>
