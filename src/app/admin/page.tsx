import AdminForm from "@/app/_components/adminForm";
import { checkRole } from "@/utils/roles";
import { redirect } from "next/navigation";

export default function AdminDashboard() {

    // If the user does not have the admin role, redirect them to the home page
    if (!checkRole("admin")) {
        redirect("/");
    }




    return (
        <div className="flex min-h-screen flex-col items-center justify-between p-24">
            <AdminForm />
        </div>
    );
}