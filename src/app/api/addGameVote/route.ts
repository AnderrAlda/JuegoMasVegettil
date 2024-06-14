// Import necessary modules
import { connectDB } from "@/libs/mongodb";
import games from "@/models/games";
import { NextRequest, NextResponse } from "next/server";

// PATCH method to increment votes for a game
export async function PATCH(request: NextRequest) {
    try {
        await connectDB();

        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Game ID is required' }, { status: 400 });
        }

        const updatedGame = await games.findByIdAndUpdate(
            id,
            { $inc: { votes: 1 } }, // Increment votes by 1
            { new: true } // Return the updated document
        );

        if (!updatedGame) {
            return NextResponse.json({ error: 'Game not found' }, { status: 404 });
        }

        return NextResponse.json(updatedGame);
    } catch (error) {
        console.error('Error updating game:', error);
        return NextResponse.json({ error: 'Failed to update game' }, { status: 500 });
    }
}