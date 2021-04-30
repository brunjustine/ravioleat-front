<template>
  <div v-if="itemPrice != 0">
    <v-card elevation="4" class="item-card" style="margin: 5px">
      <v-container>
        <v-row>
          <v-card-title>
              {{ itemName }}
          </v-card-title>
        </v-row>
        <v-row>
          <v-card-text class="darken-2 item-description" >
            <p>{{ itemDescription }}</p>
          </v-card-text>
        </v-row>
        <v-row>
          <v-card-title class="item-price">
            {{ itemPrice }} {{ devise }}
          </v-card-title>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: "ItemCard",
    props: {
      itemName: String,
      itemDescription: String,
      itemPrice: Number,
      devise: String,
    },
  }
</script>

<style scoped>

.v-card__title {
  font-size: initial; 
  font-weight: bold; 
  justify-content: left;
}

.item-description p{
  text-align: left;
  line-height:normal;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
}

.item-card {
  width:350px;
  height :180px;
}

.item-price {
  position:absolute;
  bottom:0;
}
/*
.v-card__text {
  text-align: left;
}*/

</style>
