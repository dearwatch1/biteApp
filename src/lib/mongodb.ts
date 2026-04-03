import { MongoClient } from "mongodb";
const url = process.env.MONGODB_URL!;
if (!url) {
  throw new Error(
    "Missing MongoDB connection string. Set MONGODB_URL or MONGODB_URI in .env.local",
  );
}
const options = { maxPoolSize: 10 };

let client: MongoClient;
let clientPromise: Promise<MongoClient>; //成功后返回MongoClient实例

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

//单例模式，确保全局只有一个MongoClient实例
if (!global._mongoClientPromise) {
  client = new MongoClient(url, options);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
