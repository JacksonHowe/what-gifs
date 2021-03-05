<template>
  <v-container fill-height>
    <v-row class="text-center" align="center">
      <v-col
        cols="12"
        class="mb-2"
      >
        <v-btn to="/game">
          Join Game
        </v-btn>
      </v-col>

      <v-col cols="12">
        <v-btn to="/host">
          Start Game
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'Home',
    title: 'What GIFs',

    data () {
      return {

      }
    },
  }
</script>