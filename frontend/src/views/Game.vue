<template>
  <v-container
    fill-height
  >
    <v-row
      v-if="!joined"
      class="text-center"
    >
      <v-col cols="12">
        <v-text-field
          label="Name"
          v-model="name"
        />
        <v-text-field
          label="Code"
          v-model="gameID"
        />   
        <v-btn
          :disabled="!name || !gameID"
          @click="joinGame"
        >
          Join
        </v-btn>     
      </v-col>
    </v-row>
    <v-row
      v-else-if="!judge"
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
      <template v-if="!submissions.length">
        <v-col cols="12">
          <h2>Waiting for submissions</h2>
        </v-col>
      </template>
      <template v-else>
        <v-col cols="12">
          <h2>Pick the winning caption:</h2>
        </v-col>
        <v-col cols="12">
          <v-card
            v-for="caption, index in submissions"
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
            @click="chooseWinner"
          >
            Submit
          </v-btn>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'Game',

    destroyed () {
      if (this.connection) {
        this.connection.close()
      }
    },

    data () {
      return {
        connection: null,
        name: '',
        playerID: 123,
        gameID: '',
        judge: false,
        captions: [],
        submissions: [],
        caption: 'New Caption',
        selectedIndex: -1
      }
    },

    computed: {
      joined () {
        return this.gameID && this.connection && this.captions.length
      }
    },

    watch: {
      caption (val) {
        this.captions.append(val)
      },
    },

    methods: {
      joinGame () {
        this.connection = new WebSocket(`ws://localhost:8080?action=connect&gameID=${this.gameID}&name=${this.name}`)

        this.connection.onopen = event => {
          console.log(event)
          console.log('Successfully connected to server')
        }
        
        this.connection.onmessage = event => {
          this.onMessage(JSON.parse(event.data))
        }
      },

      submitCaption () {
        const data = {
          action: 'submitcaption',
          playerID: this.playerID,
          caption: this.captions[this.selectedIndex]
        }
        this.captions.splice(this.selectedIndex, 1)
        this.selectedIndex = -1
        console.log(data)
        this.sendMessage(JSON.stringify(data))
      },

      chooseWinner () {
        const data = {
          action: 'choosewinner',
          caption: this.captions[this.selectedIndex]
        }
        console.log(data)
        this.sendMessage(JSON.stringify(data))
        this.submissions = []
        this.selectedIndex = -1
        this.judge = false
      },

      sendMessage (message) {
        this.connection.send(JSON.stringify(message))
      },

      onMessage (message) {
        console.log(message)
        if (typeof message === 'object' && message !== null) {
          for (const prop in message) {
            this[prop] = message[prop]
          }
        }
      }
    }
  }
</script>