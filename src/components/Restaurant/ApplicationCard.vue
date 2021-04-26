<template>
  <div>
    <v-card elevation="4" class="text-center" style="margin: 5px">
      <v-card-title class="justify-center" style="font-size: xx-large; font-weight: bold">
        <span class="title">
<!--          {{ beautyAppliName(appliName) }}-->
          <img width="6%" height="6%" :alt="appliName" :src="require('/src/assets/logos/'+appliName+'.png')">
        </span>
      </v-card-title>
      <v-row>
        <v-col>
          <v-card-text class="amount darken-2">
            Temps de livraison :
            <v-chip>
              {{ deliveryETA['RangeLower'] }} - {{ deliveryETA['RangeUpper'] }} min
            </v-chip>
          </v-card-text>
        </v-col>
        <v-col>
          <v-card-text class="amount darken-2">
            Coût de livraison :
            <v-chip>
              {{ deliveryCost }} {{ this.devise }}
            </v-chip>
          </v-card-text>
        </v-col>
        <v-col>
          <v-card-text>
            <div>
              <v-rating v-model="rating['StarRating']" background-color="orange lighten-3" color="orange" half-icon="mdi-star-half" half-increments large readonly></v-rating>
              {{ Math.round(rating['StarRating'] * 100) / 100}}
            </div>
            {{ rating['Count'] }}
          </v-card-text>
        </v-col>
        <v-col>
          <v-card-actions>
            <v-btn @click="goToStore()" :disabled="urlLink === null">Voir le restaurant</v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: "ApplicationCard",
    props: {
      appliName: String,
      deliveryETA: Object,
      deliveryCost: Number,
      urlLink: String,
      rating: Object,
      devise: String,
    },
    methods: {
      beautyAppliName(appliName) {
        return (appliName.charAt(0).toUpperCase() + appliName.slice(1)).replace('_', ' ');
      },
      goToStore() {
        window.open(this.urlLink, '_blank')
      }
    },
  }
</script>

<style scoped>

</style>
