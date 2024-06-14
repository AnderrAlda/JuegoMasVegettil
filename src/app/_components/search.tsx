"use client";
import { toast } from "sonner";
import axios from "axios";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignedIn } from "@clerk/nextjs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useUser } from '@clerk/clerk-react';

interface Game {
    _id: string;
    title: string;
    image: string;
    votes: number;
    category: string;
}

interface Category {
    title: string;
}

function getImageUrl(fileKey: string) {
    return `https://pub-0ac36a8b24eb4133942d20338a06e753.r2.dev/${fileKey}`;
}

export default function SearchComp() {

    const { user } = useUser();

    useEffect(() => {
        if (user) {
            console.log('User ID:', user.id);
        }
    }, [user]);

    const [receivedGames, setReceivedGames] = useState<Game[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [sortAlphabetically, setSortAlphabetically] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectKey, setSelectKey] = useState<number>(0);

    useEffect(() => {
        async function loadGames() {
            try {
                const response = await fetch("/api/games");
                if (response.ok) {
                    const gamesData = await response.json();
                    setReceivedGames(gamesData);
                } else {
                    console.error("Failed to fetch games:", response.status);
                }
            } catch (error) {
                console.error("Error fetching games:", error);
            }
        }

        loadGames();
    }, []);

    useEffect(() => {
        axios
            .get("/api/categories")
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handleVoteIncrement = async (gameId: string) => {
        if (!user) {
            console.error('User is not logged in or not available');
            return;
        }

        try {
            // Add vote to usersGamesVotes
            const voteResponse = await fetch('/api/usersGamesVotes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.id, gameId }),
            });

            if (!voteResponse.ok) {
                if (voteResponse.status === 429) {
                    toast.error("As alcanzado el número máximo de votos");
                } else {
                    toast.error("Juego ya votado");
                }
                return;
            }

            try {
                const response = await fetch('/api/addGameVote', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: gameId }),
                });

                if (response.ok) {
                    const updatedGame = await response.json();
                    // Update the received games with the updated game data
                    setReceivedGames((prevGames) =>
                        prevGames.map((game) =>
                            game._id === updatedGame._id ? updatedGame : game
                        )
                    );
                    toast.success("Juego votado correctamente");
                } else {
                    toast.error("Error votando el juego");
                }
            } catch (error) {
                toast.error("Error votando el juego");
            }
        } catch (error) {
            toast.error("Error votando el juego");
        }
    };

    let filteredGames = receivedGames
        .filter((game) => {
            if (selectedCategory) {
                return game.category === selectedCategory;
            }
            return true;
        })
        .filter((game) => game.title.toLowerCase().includes(searchTerm.toLowerCase()));

    if (sortAlphabetically) {
        filteredGames = filteredGames.sort((a, b) =>
            a.title.localeCompare(b.title)
        ); // Sort alphabetically by title
    } else {
        filteredGames = filteredGames.sort((a, b) => b.votes - a.votes); // Sort by votes in descending order by default
    }

    const handleSortToggle = () => {
        setSortAlphabetically(!sortAlphabetically);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSortAlphabetically(false);
        setSelectKey(prevKey => prevKey + 1); // Update the key to reset Select component
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <div className="mb-8 flex gap-4">
                <input
                    type="text"
                    placeholder="Buscar por título..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md"
                />

                <Select key={selectKey} onValueChange={(value) => setSelectedCategory(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Elige una categoría" />
                    </SelectTrigger>

                    <SelectContent>
                        {categories?.map((category) => (
                            <SelectItem
                                key={category.title}
                                value={category.title}
                                className="text-black"
                            >
                                {category.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button
                    variant="outline"
                    onClick={handleSortToggle}
                    className={
                        sortAlphabetically
                            ? "bg-black text-white"
                            : "bg-white text-black"
                    }
                >
                    {sortAlphabetically ? "Ordenar por Votos" : "Ordenar por orden alfabético"}
                </Button>
                <Button variant="outline" onClick={handleClearFilters}>
                    Limpiar filtro
                </Button>
            </div>
            <div className="grid grid-cols-1 gap-20 md:grid-cols-2 lg:grid-cols-3 w-full">
                {filteredGames.map((game, index) => (
                    <div key={game._id} className="mt-12 flex flex-col items-center">
                        <Image
                            src={getImageUrl(game.image)}
                            alt={game.title}
                            width={400}
                            height={200}
                            className="game-image rounded-xl w-[400px] h-[200px] object-cover"
                        />
                        <div className="text-center mt-4">
                            <h2 className="text-xl font-bold">
                                {index + 1}. {game.title}
                            </h2>
                            <p className="mt-2">Categoría: {game.category}</p>
                            <p className="mt-2">Votos: {game.votes}</p>
                            <SignedIn>
                                <Button className="mt-4" onClick={() => handleVoteIncrement(game._id)}>
                                    +1
                                </Button>
                            </SignedIn>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
