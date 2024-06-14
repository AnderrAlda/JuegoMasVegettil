import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import usersGamesVotes from "@/models/usersGamesVotes";
import { connectDB } from "@/libs/mongodb";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { userId, gameId } = await request.json();

        if (!userId || !gameId) {
            return NextResponse.json({ error: 'User ID and Game ID are required' }, { status: 400 });
        }

        const vote = await usersGamesVotes.create({ userId, gameId });

        return NextResponse.json(vote);
    } catch (error) {
        console.error('Error creating vote:', error);
        return NextResponse.json({ error: 'Failed to create vote' }, { status: 500 });
    }
}