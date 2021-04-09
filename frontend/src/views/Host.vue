<template>
  <v-container fill-height>
    <v-row
      class="text-center"
    >
      <v-col
        v-if="playState !== 'init'"
        cols="12"
      >
        <h3>Game ID: {{ gameID }}</h3>
        <h3 v-if="theme">Theme: {{ theme }}</h3>
      </v-col>

      <template v-if="playState === 'init'">
        <v-col cols="12">
          <v-text-field
            label="Theme (Optional)"
            v-model="theme"
          />
          <v-subheader class="pa-0">Score Limit</v-subheader>
          <v-slider
            v-model="maxPoints"
            class="ma-0"
            thumb-label="always"
            :min="1"
            :max="10"
          />
          <v-select
            v-model="rating"
            :items="ratings"
            label="Rating"
          />
          <v-btn
            @click="startGame"
          >
            Start
          </v-btn>
        </v-col>
      </template>

      <template v-else-if="playState === 'waitingForPlayers'">
        <v-col
          cols="12"
        >
          <h2>Waiting for Players</h2>
        </v-col>
        <v-col cols="12">
          <v-list-item
            v-for="player in players"
            :key="player.name"
            style="display: block"
          >
            {{ player.name }}
          </v-list-item>
        </v-col>
        <v-col cols="12">
          <v-btn
            :disabled="players.length < 2"
            @click="confirmPlayersReady"
          >
            Ready to Play!
          </v-btn>
        </v-col>
      </template>

      <template v-else-if="playState === 'awaitingGifSelection'">
        <v-col
          v-if="players.length"
          cols="12"
        >
          <v-simple-table dense>
            <template>
              <thead>
                <tr>
                  <th style="text-align: center" colspan="2">Scores</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="player in players"
                  :key="player.name"
                >
                  <td>{{ player.name }}</td>
                  <td>{{ player.score }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>

        <v-col
          v-if="judge"
          cols="12"
        >
          <h2>Judge: {{ judge.name }}</h2>
        </v-col>

        <v-col
          cols="12"
          align="center"
        >
          <v-img
            max-height="500"
            max-width="400"
            :src="gifUrl"
          />
        </v-col>
      </template>

      <template v-else-if="playState === 'awaitingSubmissions'">
        <v-col
          v-if="players.length"
          cols="12"
        >
          <v-simple-table dense>
            <template>
              <thead>
                <tr>
                  <th style="text-align: center" colspan="2">Scores</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="player in players"
                  :key="player.name"
                >
                  <td>{{ player.name }}</td>
                  <td>{{ player.score }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>

        <v-col
          v-if="judge"
          cols="12"
        >
          <h2>Judge: {{ judge.name }}</h2>
        </v-col>

        <v-col
          cols="12"
          align="center"
        >
          <v-img
            max-height="500"
            max-width="400"
            :src="gifUrl"
          />
        </v-col>

        <v-col cols="12">
          <h2>Waiting for Submissions</h2>
        </v-col>
      </template>

      <template v-else-if="playState === 'selectWinnerPending'">
        <v-col
          v-if="judge"
          cols="12"
        >
          <h2>Judge: {{ judge.name }}</h2>
        </v-col>

        <v-col
          cols="12"
          align="center"
        >
          <v-img
            max-height="500"
            max-width="400"
            :src="gifUrl"
          />
        </v-col>

        <v-col cols="12">
          <v-list-item
            v-for="submission in submissions"
            :key="submission.playerID"
            style="display: block"
          >
            {{ submission.caption }}
          </v-list-item>
        </v-col>
      </template>

      <template v-else-if="playState === 'gameFinished'">
        <v-col
          v-if="players.length"
          cols="12"
        >
          <v-simple-table dense>
            <template>
              <thead>
                <tr>
                  <th style="text-align: center" colspan="2">Scores</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="player in players"
                  :key="player.name"
                >
                  <td>{{ player.name }}</td>
                  <td>{{ player.score }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>

        <v-col cols="12">
          <v-dialog
            v-model="newGameDialog"
            persistent
            max-width="600px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
              >
                Start New Game
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Game Settings</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="theme"
                        label="Theme (Optional)"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-subheader class="pa-0">Score Limit</v-subheader>
                      <v-slider
                        v-model="maxPoints"
                        thumb-label="always"
                        :min="1"
                        :max="10"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        v-model="rating"
                        :items="ratings"
                        label="Rating"
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="newGameDialog = false"
                >
                  Close
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="newGame"
                >
                  Start
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </template>

      <v-dialog
        transition="dialog-bottom-transition"
        max-width="600"
        v-if="winningPlayerIndex !== -1"
        v-model="displayWinningSubmission"
      >
        <v-card>
          <v-toolbar
            color="primary"
            dark
          >Winning Caption</v-toolbar>
          <v-card-text>
            <div class="pa-1">"{{ winningSubmission.caption }}"</div>
            <div class="pa-1">- {{ players[winningPlayerIndex].name }}</div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
  import settings from '../config'

  export default {
    name: 'Host',

    destroyed () {
      if (this.connection) {
        this.connection.close()
      }
    },

    data () {
      return {
        connection: null,
        theme: '',
        maxPoints: 5,
        rating: 'g',
        ratings: [
          { text: 'G', value: 'g' },
          { text: 'PG', value: 'pg' },
          { text: 'PG-13', value: 'pg13' },
          { text: 'R', value: 'r' }
        ],
        gameID: -1,
        judge: null,
        playState: 'init',
        gifUrl: '',
        players: [],
        scores: [],
        submissions: [],
        displayWinningSubmission: false,
        winningSubmission: {},
        newGameDialog: false
      }
    },

    computed: {
      winningPlayerIndex () {
        return this.getPlayerIndex(this.winningSubmission.playerID)
      }
    },

    watch: {
      scores (vals) {
        for (const id in vals) {
          const i = this.getPlayerIndex(id)
          this.players[i].score = vals[id]
        }
      },
      winningSubmission () {
        this.displayWinningSubmission  = true
        setTimeout(() => {
          this.displayWinningSubmission = false
        }, 3500)
      }
    },

    methods: {
      startGame () {
        let paramsString = '?action=startgame'
        if (this.theme) {
          paramsString += '&theme=' + this.theme
        }
        if (this.maxPoints) {
          paramsString += '&maxPoints=' + this.maxPoints
        }
        if (this.rating) {
          paramsString += '&rating=' + this.rating
        }
        this.connection = new WebSocket(`ws://${settings.hostname}${paramsString}`)

        this.connection.onopen = event => {
          console.log(event)
          console.log('Successfully connected to server')
        }
        
        this.connection.onmessage = event => {
          this.onMessage(JSON.parse(event.data))
        }
      },

      newGame () {
        const data = {
          action: 'newgame',
          gameID: this.gameID,
          theme: this.theme,
          maxPoints: this.maxPoints,
          rating: this.rating
        }
        this.sendMessage(data)
        this.newGameDialog = false
      },

      confirmPlayersReady () {
        const data = {
          action: 'playersready',
          gameID: this.gameID
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
      },

      getPlayerIndex(id) {
        return this.players.findIndex(player => player.id === id)
      }
    }
  }
</script>