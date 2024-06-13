import { NextResponse } from 'next/server';
import { getCustomers, createCustomer } from '@/lib/customers';

export async function GET(): Promise<Response> {
  const customers = await getCustomers();
  return NextResponse.json(customers);
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  const newCustomer: Record<string, any> = body;
  const createdCustomer = await createCustomer(newCustomer);
  return NextResponse.json(createdCustomer);
}
