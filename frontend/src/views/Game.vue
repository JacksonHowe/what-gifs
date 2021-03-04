<template>
  <v-container
    fill-height
  >
    <v-row
      v-if="!judge"
      class="text-center"
    >
      <v-col cols="12">
        <h2>Pick a Caption:</h2>
      </v-col>
      <v-col cols="12">
        <v-card
          v-for="caption, index in captions"
          class="ma-3"
          style="height: 50px;"
          :key="caption"
          :color="selectedIndex === index ? 'light-blue lighten-3' : ''"
          @click="selectedIndex = index"
        >
          <v-card-text class="black--text">
            {{ caption }}
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-btn
          :disabled="selectedIndex === -1"
          @click="submitCaption"
        >
          Submit
        </v-btn>
      </v-col>
    </v-row>
    <v-row
      v-else
      class="text-center"
    >
      <v-col cols="12">
        <h2>Pick the winning caption:</h2>
      </v-col>
      <v-col cols="12">
        <v-card
          v-for="caption, index in captions"
          class="ma-3"
          style="height: 50px;"
          :key="caption"
          :color="selectedIndex === index ? 'light-blue lighten-3' : ''"
          @click="selectedIndex = index"
        >
          <v-card-text class="black--text">
            {{ caption }}
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-btn
          :disabled="selectedIndex === -1"
          @click="submitCaption"
        >
          Submit
        </v-btn>
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
        captions: ['Caption 1', 'Caption 2', 'Caption 3', 'Caption 4', 'Caption 5'],
        selectedIndex: -1
      }
    },
    methods: {
      submitCaption () {
        const data = {
          name: "Player Name",
          caption: this.captions[this.selectedIndex]
        }
        console.log(data)
      }
    }
  }
</script>