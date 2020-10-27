import mongoose from 'mongoose'

const mongooseConnection = async (dbURL: string) => {
  const connection = await mongoose.connect(dbURL as string, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  return connection
}

export default mongooseConnection