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