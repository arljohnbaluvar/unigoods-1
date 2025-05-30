import { MongoClient, Db } from 'mongodb';

let dbConnection: Db | null = null;
const uri = process.env.MONGODB_URI || 'mongodb+srv://hufflepuffcorn:cP9tUdcQRMMdkYhj@unigoods.vmuxq8x.mongodb.net/?retryWrites=true&w=majority&appName=unigoods';

export const connectToDB = async (cb: (err?: Error) => void): Promise<void> => {
  try {
    const client = await MongoClient.connect(uri);
    dbConnection = client.db();
    cb();
  } catch (err) {
    cb(err as Error);
  }
};

export const getDB = (): Db | null => {
  return dbConnection;
};
