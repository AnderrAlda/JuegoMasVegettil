
import { SignedOut } from "@clerk/nextjs";

import { checkRole } from "@/utils/roles";
import SearchComp from "@/app/_components/search";




export default async function Home() {



  const isAdmin = checkRole("admin");


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <SignedOut>
        <div>Porfavor inicia sesion </div>
      </SignedOut>


      <SearchComp />
    </main>
  );
}
