<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h3>Game ID: {{ gameID }}</h3>
      </v-col>
      <v-col cols="12">
        <v-simple-table dense>
          <template>
            <thead>
              <tr>
                <th style="text-align: center" colspan="2">Scores</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="player, i in players"
                :key="player.uuid"
              >
                <td>{{ player.name }}</td>
                <td>{{ scores[i] }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
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
        <h2>Judge: {{ players[judge].name }}</h2>
      </v-col>
      <v-col cols="12">
        <v-list-item
          v-for="submission in submissions"
          :key="submission"
          style="display: block"
        >
          {{ submission }}
        </v-list-item>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

  export default {
    name: 'Host',
    
    created () {
      this.connection = new WebSocket('ws://localhost:8080?action=startgame')

      this.connection.onopen = event => {
        console.log(event)
        console.log('Successfully connected to server')
      }
      
      this.connection.onmessage = event => {
        this.onMessage(JSON.parse(event.data))
      }
    },

    destroyed () {
      this.connection.close()
    },

    data () {
      return {
        connection: null,
        gameID: -1,
        judge: 3,
        gifUrl: 'https://media.giphy.com/media/10LKovKon8DENq/source.gif',
        players: [
          {
            uuid: 1,
            name: 'Player 1',
          },
          {
            uuid: 2,
            name: 'Player 2',
          },
          {
            uuid: 3,
            name: 'Player 3',
          },
          {
            uuid: 4,
            name: 'Player 4',
          },
          {
            uuid: 5,
            name: 'Player 5',
          }
        ],
        submissions: ['Caption 1', 'Caption 2', 'Caption 3', 'Caption 4'],
        scores: [2, 1, 1, 0, 3],
        winner: -1,
        winningSubmission: 'Winner winner chicken dinner'
      }
    },

    methods: {
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