import { connectDB } from "@/libs/mongodb";
import games from "@/models/games";
 
 
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
    try {
        await connectDB();

        const users = await games.find();
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching games:', error);
        return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const data = await request.json();

        const users = await games.create(data);
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error creating game:', error);
        return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
    }
}


export async function DELETE(request: NextRequest) {
    try {
        await connectDB();

        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Game ID is required' }, { status: 400 });
        }

        await games.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Game deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete game' }, { status: 500 });
    }
}


