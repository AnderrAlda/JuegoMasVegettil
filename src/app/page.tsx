
import { connectDB } from "@/libs/mongodb";
import games from "@/models/games";
import { SignedOut } from "@clerk/nextjs";

import { checkRole } from "@/utils/roles";
import { redirect } from "next/navigation";
import Image from "next/image";


async function loadUsers() {
  await connectDB()
  const recivedGames = await games.find()
  return recivedGames

}


function getImageUrl(fileKey: string) {
  return `https://pub-0ac36a8b24eb4133942d20338a06e753.r2.dev/${fileKey}`
}

export default async function Home() {

  const recivedGames = await loadUsers();

  const isAdmin = checkRole("admin");


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <SignedOut>
        <div>Porfavor inicia sesion </div>
      </SignedOut>


      <div className="games-list">
        {recivedGames.map((game) => (
          <div key={game._id} className="game-card">
            <Image src={getImageUrl(game.image)} alt={game.title}
              width={200}
              height={200}
              className="game-image" />
            <div className="game-details">
              <h2 className="game-title">{game.title}</h2>
              <p className="game-category">Category: {game.category}</p>
              <p className="game-votes">Votes: {game.votes}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
