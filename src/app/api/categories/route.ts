import { connectDB } from "@/libs/mongodb";
import categories from "@/models/categories";
 
 
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
    await connectDB();

    const users = await categories.find();
    return NextResponse.json(users);
}



export async function POST(request:NextRequest) {
    await connectDB();

    const data = await request.json();

    const users = await categories.create(data);
    return NextResponse.json(users);
}


