import { emojiString } from './../utils/emojis';
import { GameInfo, Region, regionNames } from './amongUs';
import { Client, Guild, Message, VoiceChannel } from "discord.js";
import { CommandoClient, CommandoGuild, CommandoMessage } from "discord.js-commando";
import Player from "./player";

type GameStatus = 'lobby' | 'tasks' | 'meeting'

export default class Game {
    public code: string;
    public region: Region;
    constructor(public client: Client | CommandoClient , public guild: Guild | CommandoGuild, public channel: VoiceChannel, info: GameInfo) {
        this.code = info.code;
        this.region = info.region;
    }
    public id = this.channel.id
    public status: GameStatus = 'lobby'
    public players: Player[] = []
    private infoMessage: Message | CommandoMessage | undefined;

    public getPlayerById(playerId: string) {
        return this.players.find(player => player.id === playerId)
    }

    public addPlayer(player: Player) {
        // find if player or color exists
        const index = this.players.findIndex(p => p.id === player.id || p.color === player.color)
        
        const playerExists = index !== -1

        if (playerExists) return false;

        this.players.push(player)
        
        this.updateMessage()

        return true
    }

    public removePlayer(player: Player) {
        const index = this.players.findIndex(p => p.id === player.id)

        const playerExists = index !== -1

        if (!playerExists) return false;

        this.players.splice(index, 1)

        this.updateMessage()
        
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

    public setInfoMessage(message: Message | CommandoMessage) {
        this.infoMessage = message;
    }

    public getMessageString() {
        // @ts-ignore
        let msgString = `Region: **${regionNames[this.region.toLowerCase()]}**\n`
        msgString += `Code: **${this.code.toLocaleUpperCase()}**\n`
        msgString += `Voice Channel: ${this.channel.name}\n\n`
        msgString += 'Players:\n'
        this.players.forEach(player => {
            msgString += `${emojiString(player.color)}: <@${player.user.id}>\n`
        })
        
        return msgString
    }

    public updateMessage() {
        if (!this.infoMessage) return;
        this.infoMessage.edit(this.getMessageString())
    }
}