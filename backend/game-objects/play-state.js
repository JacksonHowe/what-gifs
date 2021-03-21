const PlayState = {
    Host: {
        waitingForPlayers: 'waitingForPlayers',
        awaitingGifSelection: 'awaitingGifSelection',
        awaitingSubmissions: 'awaitingSubmissions',
        selectWinnerPending: 'selectWinnerPending',
        gameFinished: 'gameFinished'
    },
    Player: {
        judge: 'judge',
        awaitingSubmissions: 'awaitingSubmissions',
        selectWinnerPending: 'selectWinnerPending'
    }
};

module.exports = PlayState;