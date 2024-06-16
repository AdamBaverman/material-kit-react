import { NextResponse } from 'next/server';
import connectDB from '../../../db/db';
import Row from '../../../db/models/character/row';

export async function GET() {
  try {
    await connectDB();
    const rows = await Row.find();
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching rows:', error);
    return NextResponse.json({ error: 'Error fetching rows' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const row = await Row.create(data);
    return NextResponse.json(row);
  } catch (error) {
    console.error('Error creating row:', error);
    return NextResponse.json({ error: 'Error creating row' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const data = await request.json();
    const { cid } = data;
    const row = await Row.findOne({ cid });
    if (row) {
      await row.updateOne(data);
      return NextResponse.json(row);
    }
    return NextResponse.json({ error: 'Row not found' }, { status: 404 });
  } catch (error) {
    console.error('Error updating row:', error);
    return NextResponse.json({ error: 'Error updating row' }, { status: 500 });
  }
}
