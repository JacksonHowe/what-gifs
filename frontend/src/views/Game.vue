<template>
  <v-container
    fill-height
  >
    <v-row
      class="text-center"
    >
      <template v-if="playState === 'init'">
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
      </template>

      <template
        v-else-if="playState === 'waitingForPlayers'"
      >
        <v-col cols="12">
          <h2>Waiting for Players</h2>
        </v-col>
      </template>

      <template
        v-else-if="playState === 'awaitingGifSelection'"
      >
        <template v-if="judge">
          <v-col cols="12">
            <v-btn
              class="mr-2"
              @click="getNewGif"
            >
              Select new GIF
            </v-btn>
            <v-btn @click="selectGif">
              Use this GIF
            </v-btn>
          </v-col>
        </template>
        <template v-else>
          <v-col cols="12">
            <h2>Waiting for judge to choose a GIF</h2>
          </v-col>
        </template>
      </template>

      <template
        v-else-if="playState === 'awaitingSubmissions'"
      >
        <template v-if="judge">
          <v-col cols="12">
            <h2>You are the judge!</h2>
            <h2>Waiting for submissions</h2>
          </v-col>
        </template>
        <template v-else>
          <v-col cols="12">
            <h2>Pick a Caption:</h2>
          </v-col>
          <v-col cols="12">
            <v-card
              v-for="caption, index in captions"
              class="ma-3"
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
        </template>
      </template>

      <template
        v-else-if="playState === 'selectWinnerPending'"
      >
        <template v-if="judge">
          <v-col cols="12">
            <h2>Pick the winning caption:</h2>
          </v-col>
          <v-col cols="12">
            <v-card
              v-for="submission, index in submissions"
              class="ma-3"
              :key="submission.playerID"
              :disabled="submission.disabled"
              :color="selectedIndex === index ? 'light-blue lighten-3' : ''"
              @click="selectedIndex = index"
            >
              <v-card-text class="black--text">
                {{ submission.caption }}
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-btn
              class="mr-2"
              :disabled="selectedIndex === -1"
              @click="eliminateCaption"
            >
              Eliminate
            </v-btn>
            <v-btn
              :disabled="selectedIndex === -1"
              @click="chooseWinner"
            >
              Submit
            </v-btn>
          </v-col>
        </template>

        <template v-else>
          <v-col cols="12">
            <h2>Waiting for judge to select a winner</h2>
          </v-col>
        </template>
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
        playerID: null,
        gameID: '',
        playState: 'init',
        judge: false,
        captions: [],
        submissions: [],
        caption: 'New Caption',
        selectedIndex: -1
      }
    },

    watch: {
      caption (val) {
        this.captions.push(val)
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
          caption: this.captions[this.selectedIndex],
          gameID: this.gameID
        }
        this.captions.splice(this.selectedIndex, 1)
        this.selectedIndex = -1
        console.log(data)
        this.sendMessage(data)
      },

      eliminateCaption () {
        const data = {
          action: 'eliminatecaption',
          submission: this.submissions[this.selectedIndex],
          gameID: this.gameID
        }
        this.sendMessage(data)
        this.submissions[this.selectedIndex].disabled = true
        this.selectedIndex = -1
      },

      chooseWinner () {
        const data = {
          action: 'choosewinner',
          winningSubmission: this.submissions[this.selectedIndex],
          gameID: this.gameID
        }
        this.sendMessage(data)
        this.submissions = []
        this.selectedIndex = -1
        this.judge = false
      },

      getNewGif () {
        const data = {
          action: 'getgif',
          gameID: this.gameID,
          playerID: this.playerID
        }
        this.sendMessage(data)
      },

      selectGif () {
        const data = {
          action: 'setgif',
          gameID: this.gameID,
          playerID: this.playerID
        }
        this.sendMessage(data)
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