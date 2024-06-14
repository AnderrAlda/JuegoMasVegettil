"use client"

import axios from "axios";

import { useState, useEffect } from "react";
import Image from "next/image";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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
    const [recivedGames, setRecivedGames] = useState<Game[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>(""); // Add this state

    useEffect(() => {
        async function loadGames() {
            try {
                const response = await fetch("/api/games");
                if (response.ok) {
                    const gamesData = await response.json();
                    setRecivedGames(gamesData);
                } else {
                    console.error("Failed to fetch games:", response.status);
                }
            } catch (error) {
                console.error("Error fetching games:", error);
            }
        }

        loadGames();
    }, []);

    const [categories, setCategories] = useState<Category[]>();
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

    const filteredGames = recivedGames
        .filter((game) => {
            if (selectedCategory) {
                return game.category === selectedCategory;
            }
            return true;
        })
        .filter((game) => game.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => b.votes - a.votes); // Sort by votes in descending order

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="mb-8 flex gap-4">
                <input
                    type="text"
                    placeholder="Buscar por título..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md"
                />

                <Select onValueChange={(value) => setSelectedCategory(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Elige una categoria" />
                    </SelectTrigger>

                    <SelectContent>
                        {categories?.map((category) => (
                            <SelectItem key={category.title} value={category.title}>
                                {category.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
                {filteredGames.map((game, index) => (
                    <div key={game._id} className="mt-12 flex flex-col items-center">
                        <Image
                            src={getImageUrl(game.image)}
                            alt={game.title}
                            width={200}
                            height={200}
                            className="game-image rounded-2xl"
                        />
                        <div className="text-center mt-4">
                            <h2 className="text-xl font-bold">{index + 1}. {game.title}</h2>
                            <p className="mt-2">Categoría: {game.category}</p>
                            <p className="mt-2">Votos: {game.votes}</p>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}