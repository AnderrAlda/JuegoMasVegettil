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

        // Check if the user has already voted for this game
        const existingVote = await usersGamesVotes.findOne({ userId, gameId });
        if (existingVote) {
            return NextResponse.json({ error: 'User has already voted for this game' }, { status: 400 });
        }

        // Check if the user has voted five times
        const userVotes = await usersGamesVotes.countDocuments({ userId });
        if (userVotes >= 5) {
            return NextResponse.json({ error: 'User has reached the maximum number of votes' }, { status: 429 });
        }

        // If no existing vote, proceed to add the vote
        const filter = { userId, gameId };
        const update = { userId, gameId };
        const options = { upsert: true, new: true };

        const vote = await usersGamesVotes.findOneAndUpdate(filter, update, options);

        return NextResponse.json(vote);
    } catch (error) {
        console.error('Error creating vote:', error);
        return NextResponse.json({ error: 'Failed to create vote' }, { status: 500 });
    }
}