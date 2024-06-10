import { NextResponse, NextRequest } from "next/server";
import { cookies } from 'next/headers'

export async function POST(req) {
    const { refreshToken, userPreferences } =  await req.json();
    try {
        cookies().set("auth_token", refreshToken, { httpOnly: true, path: '/', maxAge: 2592000 });
        cookies().set("userPreferences", userPreferences, { httpOnly: true, path: '/', maxAge: 2592000 });
        return NextResponse.json({ message: "CreatCookie",  status: 200 });
    } catch (error) {
      console.error('Error checking email availability:', error);
      return NextResponse.json({ status: 500, error: 'Internal Server Error' });
    }
  }