import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import type {Db, Document }  from 'mongodb';

const uri: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/mui';
if (!uri) {
    throw new Error('Please add your Mongo URI to .env.local');
}

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

const getClient = async (): Promise<Db> => {
    const clientDone = await clientPromise;
    return clientDone.db('mui');
  };

  export async function GET(): Promise<NextResponse> {
    const db = await getClient();
    const customers = await db.collection('customers').find({}).toArray();
    // Преобразование _id в id
    const transformedCustomers = customers.map((customer) => ({
      ...customer,
      id: customer._id,
    }));
    return NextResponse.json(transformedCustomers);
  }

export async function POST(request: Request): Promise<NextResponse> {
    const db = await getClient();
    const newCustomer: Document = await request.json();
    const result = await db.collection('customers').insertOne(newCustomer);
    return NextResponse.json(result.insertedId);
}
