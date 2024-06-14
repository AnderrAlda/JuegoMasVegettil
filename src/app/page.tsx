import { SignedOut } from "@clerk/nextjs";
import { checkRole } from "@/utils/roles";
import SearchComp from "@/app/_components/search";
import Image from 'next/image';

export default async function Home() {
  const isAdmin = checkRole("admin");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex justify-center mb-12">
        <div className="flex flex-col items-center">
          <Image
            src="/vegetta.jpeg"
            width={250}
            height={250}
            alt="Picture of the author"
            className="rounded-2xl"
          />
          <h1 className="text-4xl font-bold underline text-center mt-4">
            JuegoMasVegettil
          </h1>
          <h2 className="text-4xl font-semibold mt-12 text-center">
            Cuál va a ser el videojuego de 2023 que más están <br />
            esperando los seguidores de vegetta777?
          </h2>
        </div>
      </div>

      <SignedOut>
        <div>Porfavor inicia sesion para poder votar. Gracias!</div>
      </SignedOut>

      <SearchComp />
    </main>
  );
}