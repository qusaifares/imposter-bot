import { GuildChannel } from 'discord.js'
import { CommandoClient, Command, CommandoMessage } from 'discord.js-commando'
import { CategoryChannel, Message } from 'discord.js'
import Guild from '../../db/models/Guild'
import { Color, Region } from '../../libs/amongUs'
import { createGameChannel } from '../../utils/createGameChannel'
import { emojisInfo, emojiString } from '../../utils/emojis'

const colors: Color[] = ['red', 'blue', 'green', 'pink', 'orange', 'yellow', 'black', 'white', 'purple', 'brown', 'cyan', 'lime']

const regions: Region[] = ['NA', 'EU', 'ASIA']

const regionNames = {
    na: 'North America',
    eu: 'Europe',
    asia: 'Asia'
}

const isCategory = (chan: GuildChannel): chan is CategoryChannel => {
    return chan.type === 'category';
}

export default class NewGameCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'newgame',
            group: 'games',
            memberName: 'newgame',
            description: 'Creates a new Among Us lobby.',
            args: [
                {key: 'code', prompt: 'What is the game code?', type: 'string'},
                {key: 'region', prompt: 'Which region? [NA/EU/ASIA]', type: 'string', validate: (arg: string) => regions.includes(arg.toLocaleUpperCase())}
            ]
        })
    }

    async run(message: CommandoMessage, args: object|string|string[], fromPattern: boolean) {
        try {
        const guildInfo = await Guild.findByIdAndUpdate({
            _id: message.guild.id
        }, {
            $set: {
                _id: message.guild.id
            }
        }, {
            upsert: true
        })

        // If no specified category
        if (!guildInfo?.amongUsCategory) {
            return message.reply(`Specify a category to create the game in using the command \`${message.guild.commandPrefix}setcollection <Collection ID>\``)
        }
        
        const category = message.guild.channels.cache.find(cat => cat.id === guildInfo.amongUsCategory)
        
        // If no category exists
        if (!category) {
            return message.reply(`Specify a category to create the game in using the command \`${message.guild.commandPrefix}setcollection <Collection ID>\``)
        }

        if (isCategory(category)) {
            const { code, region } = args as Args
            const channelName = `${region.toLocaleLowerCase()}-${code.toLocaleUpperCase()}`
            // const voiceChannel = await message.guild.channels.create(channelName, {
            //     parent: guildInfo.amongUsCategory,
            //     type: 'voice',
            //     userLimit: 10
            // })
            const voiceChannel = await createGameChannel(channelName, message.guild, guildInfo.amongUsCategory)
            // @ts-ignore
            let msgString = `Region: ${regionNames[region.toLowerCase()]}\n`
            msgString += `Code: ${code.toLocaleUpperCase()}\n`
            msgString += `Voice Channel: ${channelName}`
            const msgConfirmation = await message.channel.send(msgString) as Message;
            
            emojisInfo.forEach(emoji => {
                msgConfirmation.react(emojiString(emoji))
            })
        }
        return null;
        } catch (error) {
            console.log(error)
            return message.reply('Error')
        }
    }

}

interface Args {
    code: string;
    region: Region;
}