<template>
  <v-container>
    <v-row class="text-center">
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
                v-for="player in players"
                :key="player.uuid"
              >
                <td>{{ player.name }}</td>
                <td>{{ player.score }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>

      <v-col cols="12">
        <v-img
          max-height="500"
          max-width="400"
          src="https://media.giphy.com/media/10LKovKon8DENq/source.gif"
        />
      </v-col>

      <v-col cols="12">
        <h2>Judge: {{ players[judge].name }}</h2>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'Host',

    data () {
      return {
        judge: 3,
        players: [
          {
            uuid: 1,
            name: "Player 1",
            score: 2
          },
          {
            uuid: 2,
            name: "Player 2",
            score: 1
          },
          {
            uuid: 3,
            name: "Player 3",
            score: 1
          },
          {
            uuid: 4,
            name: "Player 4",
            score: 0
          },
          {
            uuid: 5,
            name: "Player 5",
            score: 3
          }
        ]
      }
    },
  }
</script>