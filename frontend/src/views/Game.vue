<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-card
          v-for="caption in captions"
          :key="caption"
        >
          {{ caption }}
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'Game',

    data () {
      return {
        judge: false,
        captions: ['Caption 1', 'Caption 2', 'Caption 3', 'Caption 4', 'Caption 5']
      }
    },
  }
</script>