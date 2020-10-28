import { CommandoClient, Command, CommandoMessage } from 'discord.js-commando'
import Guild from '../../db/models/Guild'

export default class SetCategoryCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'setcategory',
            group: 'games',
            memberName: 'setcategory',
            description: 'Sets the category where Among Us voice channels will be created.',
            argsType: 'single'
        })
    }

    async run(message: CommandoMessage, args: object|string|string[], fromPattern: boolean) {

        try {
            
        const { guild } = message
        const amongUsCategory = args as string
        
        console.log({guild: guild.id, amongUsCategory})
            
        if (!amongUsCategory) {
            message.reply('Please specify a category ID')
            return null
        }

        const category = guild.channels.cache.find((channel) => channel.id === amongUsCategory)

        if (!category || category.type !== 'category') {
            console.log(category?.type)
            message.reply('Category does not exist.')
            return null;
        }
        
        await Guild.findOneAndUpdate({
            _id: guild.id
        }, {
            $set: {
                id: guild.id,
                amongUsCategory
            }
        }, {
            upsert: true,
            new: true
        })

        message.reply(`Category set to ${category.name}`)

        } catch (error) {
            console.log(error)
            message.reply('Error')
        }
        return null;
    }
}