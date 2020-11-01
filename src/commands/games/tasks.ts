import { CommandoClient, Command, CommandoMessage } from 'discord.js-commando'

export default class TasksCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'tasks',
            group: 'misc',
            memberName: 'tasks',
            description: 'Enters tasks mode in given game.',
            argsType: 'single'
        })
    }

    async run(message: CommandoMessage, args: object|string|string[], fromPattern: boolean) {
      
      return null;
    }
}