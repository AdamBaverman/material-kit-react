import { NextResponse } from 'next/server';
import connectDB from '../../../../db/db';
import Column from '../../../../db/models/character/column';

/**
 * Fetches all character columns from the database and returns them as a JSON response.
 *
 * @returns {Promise<NextResponse>} A JSON response containing the character columns.
 */

export async function GET() {
  try {
    await connectDB();
    const columns = await Column.find();
    return NextResponse.json(columns);
  } catch (error) {
    console.error('Error fetching columns:', error);
    return NextResponse.json({ error: 'Error fetching columns' }, { status: 500 });
  }
}
