import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import type { Db, Document } from 'mongodb';
import { env } from 'node:process';

const uri: string = env.MONGODB_URI;//|| 'mongodb://localhost:27017/mui';
if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// declare global {
//   var _mongoClientPromise: Promise<MongoClient>;
// }

if (env.NODE_ENV === 'development') {
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
  try {
    const clientDone = await clientPromise;
    console.log('connected to DB');
    return clientDone.db('mui');
  } catch (error) {
    console.error('no connection to DB', error)
    return null;
  }
};

export async function GET(): Promise<NextResponse> {
  const db = await getClient();
  const customers = await db.collection('customers').find({}).toArray();
  // Преобразование _id в id
  const transformedCustomers = customers.map((customer) => ({
    ...customer,
    id: customer._id,
  }));
  console.log('customers', transformedCustomers.length);
  return NextResponse.json(transformedCustomers);
}

export async function POST(request: Request): Promise<NextResponse> {
  const db = await getClient();
  const newCustomer: Document = await request.json();
  const result = await db.collection('customers').insertOne(newCustomer);
  const insertedCustomer = { ...newCustomer, id: result.insertedId.toString() };
  return NextResponse.json(insertedCustomer);
}

export async function PUT(request: Request): Promise<NextResponse> {
  console.log('PUT request received');
  try {
    const db = await getClient();
    const updatedCustomer: Document = await request.json();
    const { id, _id, ...updateData } = updatedCustomer;

    console.log('Received data for update:', updatedCustomer);

    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      console.error('Invalid ObjectId:', id);
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const objectId = new ObjectId(id);
    const result = await db.collection('customers').updateOne(
      { _id: objectId },
      { $set: updateData }
    );

    console.log('Update result:', result);

    if (result.modifiedCount === 0) {
      console.error('No documents were modified with ID:', id);
      return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
    }

    const updatedDoc = await db.collection('customers').findOne({ _id: objectId });

    if (!updatedDoc) {
      console.error('Document not found with ID:', id);
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ ...updatedDoc, id: updatedDoc._id.toString() });
  } catch (error) {
    console.error('An error occurred during update:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    await deleteCustomer(id);
    return NextResponse.json({ message: 'Customer deleted successfully' });
  }
  return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });

}