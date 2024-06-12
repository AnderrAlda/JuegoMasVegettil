
import { connectDB } from "@/libs/mongodb";
import games from "@/models/games";
import { SignedOut } from "@clerk/nextjs";



async function loadUsers() {
  await connectDB()
  const users = await games.find()
  return users

}


export default async function Home() {

  const users = await loadUsers();


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <SignedOut>
        <div>Porfavor inicia sesion </div>
      </SignedOut>


      <pre>{JSON.stringify(users, null, 2)}</pre>
    </main>
  );
}
