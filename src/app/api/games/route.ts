import { connectDB } from "@/libs/mongodb";
import games from "@/models/games";
 
 
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
    await connectDB();

    const users = await games.find();
    return NextResponse.json(users);
}



export async function POST(request:NextRequest) {
    await connectDB();

    const data = await request.json();

    const users = await games.create(data);
    return NextResponse.json(users);
}


