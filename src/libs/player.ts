import { Client, GuildMember, VoiceChannel } from 'discord.js'
import { CommandoClient } from 'discord.js-commando';
import { Color } from './amongUs';

export default class Player {
    constructor(public client: Client | CommandoClient, public gameChannel: VoiceChannel, public member: GuildMember, public color: Color) {}
    public isAlive = true

    public die() {
        this.isAlive = false
    }

    public respawn() {
        this.isAlive = true
    }
    
    public mute() {
        this.gameChannel.createOverwrite(this.member, {SPEAK: false})
    }
    
    public unmute() {
        this.gameChannel.createOverwrite(this.member, {SPEAK: true})
    }
}