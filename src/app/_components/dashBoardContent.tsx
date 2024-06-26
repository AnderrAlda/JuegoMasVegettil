"use client"
import { toast } from "sonner";
import AdminForm from "@/app/_components/adminForm";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import EditForm from "@/app/_components/editForm";

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
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    function handleGameCreated(newGame: Game) {
        setGames([...games, newGame]);
    }

    async function handleDelete(id: string) {
        try {
            await fetch('/api/games', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });
            setGames(games.filter(game => game._id !== id));
            toast.success("Juego eliminado correctamente");
        } catch (error) {
            console.error('Error deleting game:', error);
            toast.error("Error eliminando el juego");
        }
    }

    const handleEdit = (game: Game) => {
        setSelectedGame(game);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleUpdateGame = (updatedGame: Game) => {
        setGames(games.map(game => game._id === updatedGame._id ? updatedGame : game));
        setIsOpen(false);
        setSelectedGame(null); // Reset the selected game
    };

    return (
        <div className="flex gap-40">
            <AdminForm onGameCreated={handleGameCreated} />
            <div className="grid grid-cols-2 gap-12">
                {games.map((game) => (
                    <div key={game._id} className="game-card flex gap-3">
                        <Image
                            src={getImageUrl(game.image)}
                            alt={game.title}
                            width={400}
                            height={200}
                            className="game-image rounded-xl w-[400px] h-[200px] object-cover"
                        />
                        <div>
                            <div className="game-details">
                                <h2 className="game-title">Titulo: {game.title}</h2>
                                <p className="game-category">Categoria: {game.category}</p>

                            </div>
                            <div className="flex flex-col gap-3 mt-4">
                                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" onClick={() => handleEdit(game)}>
                                            Editar
                                        </Button>
                                    </DialogTrigger>
                                    {selectedGame && (
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Editar juego</DialogTitle>
                                                <DialogDescription>
                                                    Cambiar los datos del juego aqui. Clic guardar cuando termines.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <EditForm game={selectedGame} onClose={handleClose} onUpdate={handleUpdateGame} />
                                        </DialogContent>
                                    )}
                                </Dialog>
                                <Button variant="outline" onClick={() => handleDelete(game._id)}>Eliminar</Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardContent;