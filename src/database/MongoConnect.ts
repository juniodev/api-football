import mongoose from 'mongoose'
import MongoException from '../exception/MongoException'
mongoose.set('strictQuery', true)

const connectDBMongo = async () => {
  if (!process.env.MONGO_URL) {
    throw new MongoException(
      'Missing MONGO_URL env variable'
    )
  }

  await mongoose.connect(process.env.MONGO_URL, {
    dbName: 'football'
  })
}

export { connectDBMongo }
