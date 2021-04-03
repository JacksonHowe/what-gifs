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
      </template>

      <v-dialog
        transition="dialog-bottom-transition"
        max-width="600"
        v-if="winningPlayerIndex !== -1"
        v-model="displayWinner"
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
        gameID: -1,
        judge: null,
        playState: 'init',
        gifUrl: '',
        players: [],
        scores: [],
        submissions: ['Caption 1', 'Caption 2', 'Caption 3', 'Caption 4'],
        displayWinner: false,
        winningSubmission: {}
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
        this.displayWinner  = true
        setTimeout(() => {
          this.displayWinner = false
        }, 3500)
      }
    },

    methods: {
      startGame () {
        this.connection = new WebSocket(`ws://localhost:8080?action=startgame${this.theme ? '&theme=' + this.theme : ''}`)

        this.connection.onopen = event => {
          console.log(event)
          console.log('Successfully connected to server')
        }
        
        this.connection.onmessage = event => {
          this.onMessage(JSON.parse(event.data))
        }
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