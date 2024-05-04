import mongoose, {Mongoose } from 'mongoose'

const MONGODB_URL = process.env.MONGODB_URL

interface MongooseConnection {
	conn: Mongoose | null
	promise: Promise<Mongoose> | null;

}

let cached:MongooseConnection = (global as any).mongoose

if(!cached){
	cached = (global as any ).mongoose ={
		conn : null,promise:null
	}
}

export const connectToDatabase=async () =>{
	if(cached.conn) return cached.conn;

	if(!MONGODB_URL) throw new Error('missing mongodb_url');

	cached.promise = 
	 cached.promise ||
	 mongoose.connect(MONGODB_URL, {
	 	dbName:'stock-investment',bufferCommands:false
	 })

	 cached.conn = await cached.promise
	 console.log("--- connected to db")
	 return cached.conn

}