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
                        style="margin: 20px" >
      </application-card>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import ApplicationCard from "./ApplicationCard";
  export default {
    name: "Restaurant",
    components: {ApplicationCard},
    data() {
      return {
        details: [],
        restaurant_id: '',
        restaurant: {},
        applications: [],
      }
    },
    created() {
      this.restaurant_id = this.$route.params['restaurant_id'];
      this.details = this.$route.query['detailsPass'];
      this.getRestaurant(this.details.restaurant_ids);
    },
    methods: {
      getRestaurant(restaurant_ids) {
        Object.keys(restaurant_ids).forEach(key => {
          console.log(restaurant_ids[key])
          if (restaurant_ids[key] !== "") {
            axios.post('http://0.0.0.0:5000/restaurant/' + restaurant_ids[key],
              {
                "lat": this.details.lat,
                "lon": this.details.lon,
                "formattedAddress": this.details.formattedAddress,
                "userQuery": "",
                "api": key,
              })
              .then(res => {
                this.restaurant[key] = res.data.data;
                console.log(res.data.data);
                this.getApplications(this.restaurant[key]);
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
      // priceSort() {
      //   console.log(this.applications);
      //   // this.applications.sort((application1, application2) => application2['DeliveryCost'] - application1['DeliveryCost']);
      //   this.applications
      //   console.log(this.applications)
      // }
    },
  }

</script>

<style scoped>
  .button {
    margin: 10px;
  }
</style>
