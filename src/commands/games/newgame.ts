import { GameInfo } from './../../libs/amongUs';
import { GuildChannel, MessageReaction, User } from 'discord.js'
import { CommandoClient, Command, CommandoMessage } from 'discord.js-commando'
import { CategoryChannel, Message } from 'discord.js'
import Guild from '../../db/models/Guild'
import { Color, Region } from '../../libs/amongUs'
import { createGameChannel } from '../../utils/createGameChannel'
import { emojisInfo, emojiString } from '../../utils/emojis'
import Game from '../../libs/game'
import Player from '../../libs/player'
import { games } from '../../utils/gameData'
const emojiIds = emojisInfo.map(e => e.id)

const colors: Color[] = ['red', 'blue', 'green', 'pink', 'orange', 'yellow', 'black', 'white', 'purple', 'brown', 'cyan', 'lime']

const regions: Region[] = ['NA', 'EU', 'ASIA']


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
                {key: 'code', prompt: 'What is the game code?', type: 'string', validate: (arg: string) => {
                    const onlyLetters = /^[A-Za-z]+$/
                    return onlyLetters.test(arg)
                }},
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

        message.guild.members.fetch().catch(console.error)

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
            const { code, region } = args as GameInfo
            const channelName = `${region.toLocaleLowerCase()}-${code.toLocaleUpperCase()}`
            
            const voiceChannel = await createGameChannel(channelName, message.guild, guildInfo.amongUsCategory)

            const game = new Game(message.client, message.guild, voiceChannel, {code, region})

            games[game.id] = game

            const msgConfirmation = await message.channel.send(game.getMessageString()) as Message;

            msgConfirmation.fetch()

            game.setInfoMessage(msgConfirmation)
            
            emojisInfo.forEach(emoji => {
                msgConfirmation.react(emojiString(emoji))
            })

            const reactionCollector = msgConfirmation.createReactionCollector((reaction: MessageReaction, user: User) => !!emojisInfo.find((e) => e.id === reaction.emoji.id) && !user.bot, {dispose: true})


            reactionCollector.on('collect', (reaction, user) => {
                // only 1 user is allowed to react (user and bot)
                console.log('collect')
                if (reaction.count && reaction.count > 2) {
                    reaction.users.remove(user)
                } else {
                    const player = new Player(message.client, voiceChannel, user, reaction.emoji.name as Color)
                    const isAdded = game.addPlayer(player)
                    if (!isAdded) reaction.users.remove(user)
                }
            })
            reactionCollector.on('remove', (reaction, user) => {
                const playerToRemove = game.getPlayerById(user.id)
                if (playerToRemove?.color === reaction.emoji.name) {
                    game.removePlayer(playerToRemove)
                }
            })
        }
        return null;
        } catch (error) {
            console.log(error)
            return message.reply('Error')
        }
    }

}

