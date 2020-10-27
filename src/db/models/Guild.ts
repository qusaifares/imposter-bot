import { Schema, Document, model } from 'mongoose'

interface GuildDocument extends Document {
    _id: string;
    amongUsCategory?: string;
}

const GuildSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    amongUsCategory: String
})

const Guild = model<GuildDocument>('Guild', GuildSchema)

export default Guild