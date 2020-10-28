import { Client, Guild, VoiceChannel } from "discord.js";
import { CommandoClient, CommandoGuild } from "discord.js-commando";
import Player from "./player";

type GameStatus = 'lobby' | 'tasks' | 'meeting'

export default class Game {
    constructor(public client: Client | CommandoClient , public guild: Guild | CommandoGuild, public channel: VoiceChannel) {}
    public status: GameStatus = 'lobby'
    public players: Player[] = []

    public addPlayer(player: Player) {
        // find if player or color exists
        const index = this.players.findIndex(p => p.member.id === player.member.id || p.color === player.color)
        
        const playerExists = index !== -1

        if (playerExists) return false;

        this.players.push(player)

        return true
    }

    public removePlayer(player: Player) {
        const index = this.players.findIndex(p => p.member.id === player.member.id)

        const playerExists = index !== -1

        if (!playerExists) return false;

        this.players.splice(index, 1)
        
        return true
    }

    public killPlayer(player: Player) {
        player.die()
    }

    public enterLobby() {
        this.players.forEach(player => player.unmute())
        this.status = 'lobby'
    }

    public enterMeeting() {
        this.players.forEach(player => {
            if (player.isAlive) {
                player.unmute()
            }
        })
        this.status = 'meeting'
    }

    public enterTasks() {
        this.players.forEach(player => player.mute())
        this.status = 'tasks'
    }

    public endRound() {
        this.players.forEach(player => player.respawn())
        this.enterLobby()
    }

    public endLobby() {
        this.channel.delete()
    }
}