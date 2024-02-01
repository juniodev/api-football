class MongoException extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'MongoException'
  }
}

export default MongoException
