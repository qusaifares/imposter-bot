import Game from '../libs/game'

interface GamesCollection {
  [key: string]: Game;
}

export let games: GamesCollection = {}