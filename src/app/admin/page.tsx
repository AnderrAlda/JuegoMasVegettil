
import { checkRole } from "@/utils/roles";
import { redirect } from "next/navigation";

import { connectDB } from "@/libs/mongodb";
import games from "@/models/games";
import DashboardContent from "@/app/_components/dashBoardContent";


async function loadGames() {
    await connectDB();
    const recivedGames = await games.find();
    return recivedGames;
}



export default async function AdminDashboard() {
    // If the user does not have the admin role, redirect them to the home page
    if (!checkRole("admin")) {
        redirect("/");
    }

    const initialGames = await loadGames();

    return (
        <div className="flex min-h-screen flex-col items-center justify-between p-24">

            <DashboardContent initialGames={initialGames} />
        </div>
    );
}


