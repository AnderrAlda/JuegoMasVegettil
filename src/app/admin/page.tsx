
import { checkRole } from "@/utils/roles";
import { redirect } from "next/navigation";

import { connectDB } from "@/libs/mongodb";
import games from "@/models/games";
import DashboardContent from "@/app/_components/dashBoardContent";
import Link from "next/link";
import { ChevronLeft } from 'lucide-react';


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
            <div className="absolute top-20 left-72">
                <Link href={"/"}>

                    <div className="flex gap-2 items-center">
                        <ChevronLeft width={40} height={40} /><p>Volver</p>
                    </div>
                </Link>
            </div>
            <DashboardContent initialGames={initialGames} />
        </div>
    );
}


