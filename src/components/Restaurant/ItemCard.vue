<template>
  <div v-if="itemPrice != 0">
    <v-card elevation="4" class="text-center" style="margin: 5px">
      <v-card-title class="justify-center" style="font-size: small; font-weight: bold; justify-content: center">
          {{ itemName }}
      </v-card-title>
      <v-card-title class="justify-center" style="font-size: small; font-weight: bold; justify-content: center">
        {{ itemPrice }} {{ devise }}
      </v-card-title>
      <v-card-text class="amount darken-2" style="font-size: x-small; justify-content: center">
        {{ itemDescription }}
      </v-card-text>
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

</style>
