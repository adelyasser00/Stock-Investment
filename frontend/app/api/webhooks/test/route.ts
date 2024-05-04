// app/api/webhooks/test.ts

import { NextResponse } from "next/server";

export async function POST(request) {
  console.log('inside test file');
  return NextResponse.json({ message: 'The route is working' }, { status: 200 });
}
