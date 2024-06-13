import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

import { checkRole } from "@/utils/roles";


export function TopNav() {

    const isAdmin = checkRole("admin");


    return (
        <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold">
            <Link href={"/"}><div>JuegoMasVegettil</div></Link>


            <div className="flex flex-row items-center gap-4">
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>

                    {isAdmin && <Link href={"/admin"}>Dashboard</Link>}



                    <UserButton />
                </SignedIn>
            </div>
        </nav>
    );
}