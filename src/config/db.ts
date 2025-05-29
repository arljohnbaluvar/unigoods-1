const { MongoClient } = require('mongodb')

let dbConnection: any
let uri = 'mongodb+srv://hufflepuffcorn:cP9tUdcQRMMdkYhj@unigoods.vmuxq8x.mongodb.net/?retryWrites=true&w=majority&appName=unigoods'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://hufflepuffcorn:cP9tUdcQRMMdkYhj@unigoods.vmuxq8x.mongodb.net/?retryWrites=true&w=majority&appName=unigoods';

module.exports = {
  connectToDB: (cb: any) => {
    MongoClient.connect(uri)
      .then((client: any) => {
        dbConnection = client.db()
        return cb()
      })
      .catch((err: any) => {
        return cb(err)
      })
  },
  getDB: () => {
    return dbConnection
  }
}
