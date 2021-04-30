<template>
  <div id="application-cards">
    <v-card elevation="4" class="text-center" style="margin: 5px" @click="goToStore()" :disabled="urlLink === null">
      <a>
        <v-card-title class="justify-center" style="font-size: xx-large; font-weight: bold">
          <v-flex justify-center>
            <span class="title">
              <img width="100px" height="100px" :alt="appliName" :src="require('/src/assets/logos/'+appliName+'.png')">
            </span>
          </v-flex>
        </v-card-title>
        <v-container>
          <v-row>
            <v-col>
              <v-card-text class="amount darken-2">
                <v-row>
                  <v-col>
                    Temps de livraison :
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-chip>
                      {{ deliveryETA['RangeLower'] }} - {{ deliveryETA['RangeUpper'] }} min
                    </v-chip>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-col>
            <v-col>
              <v-card-text class="amount darken-2">
                <v-row>
                  <v-col>
                    Coût de livraison :
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-chip>
                      {{ deliveryCost }} {{ this.devise }}
                    </v-chip>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-col>
          </v-row>
          <v-row>
              <v-col>
                <v-card-text class="rating">
                  <div>
                    <v-rating v-model="rating['StarRating']" background-color="#1785B3" color="#1785B3" half-icon="mdi-star-half" half-increments large readonly></v-rating>
                    {{ Math.round(rating['StarRating'] * 100) / 100}}
                  </div>
                  Avis {{ rating['Count'] }}
                </v-card-text>
              </v-col>
              <v-col v-if="offers.length !== 0">
                <v-card-text class="amount darken-2">
                  Offres du moment :
                  <v-chip v-for="offer in offers" :key="offer.OfferId">
                    {{ offer.Description }}
                  </v-chip>
                </v-card-text>
              </v-col>
          </v-row>
        </v-container>
        <div v-if="isBest" class="go-corner" href="#">
          <div class="go-arrow">
            Best
          </div>
        </div>
      </a>
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
      offers: Array,
      isBest:Boolean
    },
    methods: {
      goToStore() {
        window.open(this.urlLink, '_blank')
      }
    },
  }
</script>

<style scoped>
.theme--light.v-btn.v-btn--has-bg {
  background-color:#FFC107;
}

.theme--light.v-chip:not(.v-chip--active) {
    background-color:#daf1fb;
}

img {
  margin:0 auto;
  text-align:center;
}

.v-card__text.rating{
  color:#1785B3!important;
}

.go-corner {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 50px;
  height: 50px;
  overflow: hidden;
  top: 0;
  right: 0;
  background-color: #FFC107;
  border-radius: 0 4px 0 32px;
}

.go-arrow {
  margin-top: -4px;
  margin-right: -4px;
  color: black;
  font-family: courier, sans;
}
</style>
