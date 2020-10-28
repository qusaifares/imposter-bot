import { Guild } from "discord.js"
import { CommandoGuild } from "discord.js-commando"

export const createGameChannel = async (channelName: string, guild: CommandoGuild | Guild, categoryId: string) => {
    const voiceChannel = await guild.channels.create(channelName, {
        parent: categoryId,
        type: 'voice',
        userLimit: 10
    })
    return voiceChannel;
}
