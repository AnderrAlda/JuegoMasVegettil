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




export async function PATCH(request: NextRequest) {
    try {
        await connectDB();
        const { id, ...updateData } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Game ID is required' }, { status: 400 });
        }

        const updatedGame = await games.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedGame) {
            return NextResponse.json({ error: 'Game not found' }, { status: 404 });
        }

        return NextResponse.json(updatedGame);
    } catch (error) {
        console.error('Error updating game:', error);
        return NextResponse.json({ error: 'Failed to update game' }, { status: 500 });
    }
}