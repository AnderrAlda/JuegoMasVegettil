
import { connectDB } from "@/libs/mongodb";
import games from "@/models/games";



async function loadUsers() {
  await connectDB()
  const users = await games.find()
  return users

}


export default async function Home() {

  const users = await loadUsers();
  console.log(users)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">


      <pre>{JSON.stringify(users, null, 2)}</pre>
    </main>
  );
}
