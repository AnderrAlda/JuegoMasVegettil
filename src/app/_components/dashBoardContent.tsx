"use client"
import AdminForm from "@/app/_components/adminForm";
import { useState, useEffect } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";



interface Game {
    _id: string;
    title: string;
    image: string;
    votes: number;
    category: string;
}


interface DashboardContentProps {
    initialGames: Game[];
}

function getImageUrl(fileKey: string) {
    return `https://pub-0ac36a8b24eb4133942d20338a06e753.r2.dev/${fileKey}`;
}


const DashboardContent = ({ initialGames }: DashboardContentProps) => {
    const [games, setGames] = useState(initialGames);

    function handleGameCreated(newGame: Game) {
        setGames([...games, newGame]);
    }

    return (
        <div className="flex gap-40">
            <AdminForm onGameCreated={handleGameCreated} />
            <div className="grid grid-cols-2 gap-12">
                {games.map((game) => (
                    <div key={game._id} className="game-card flex gap-3">
                        <Image
                            src={getImageUrl(game.image)}
                            alt={game.title}
                            width={200}
                            height={200}
                            className="game-image rounded-xl"
                        />
                        <div>
                            <div className="game-details">
                                <h2 className="game-title">{game.title}</h2>
                                <p className="game-category">Category: {game.category}</p>
                                <p className="game-votes">Votes: {game.votes}</p>
                            </div>
                            <div className="flex flex-col gap-3 mt-4">
                                <Button variant="outline">Editar</Button>
                                <Button variant="outline">Eliminar</Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardContent;