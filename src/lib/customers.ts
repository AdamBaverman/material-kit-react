import clientPromise from './db';

export async function getCustomers() {
  const client = await clientPromise;
  const db = client.db('mui');
  const customers = await db.collection('customers').find({}).toArray();
  return customers.map((customer) => ({ ...customer, id: customer._id.toString() }));
}

export async function getCustomer(id: string) {
  const client = await clientPromise;
  const db = client.db('mui');
  const customer = await db.collection('customers').findOne({ _id: new ObjectId(id) });
  return customer ? { ...customer, id: customer._id.toString() } : null;
}

export async function createCustomer(customer) {
  const client = await clientPromise;
  const db = client.db('mui');
  const result = await db.collection('customers').insertOne(customer);
  return { ...customer, id: result.insertedId.toString() };
}

export async function updateCustomer(id: string, updatedCustomer) {
  const client = await clientPromise;
  const db = client.db('mui');
  const result = await db.collection('customers').updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedCustomer }
  );

  if (result.modifiedCount === 1) {
    return { ...updatedCustomer, id };
  } else {
    return null;
  }
}

export async function deleteCustomer(id: string) {
  const client = await clientPromise;
  const db = client.db('mui');
  await db.collection('customers').deleteOne({ _id: new ObjectId(id) });
}
