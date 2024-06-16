import { NextResponse } from 'next/server';
import connectDB from '../../../../db/db';
import Template from '../../../../db/models/character/template';

export async function GET() {
  try {
    await connectDB();
    const templates = await Template.find();
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Error fetching templates' }, { status: 500 });
  }
}