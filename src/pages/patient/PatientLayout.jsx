import { Outlet } from "react-router-dom";
import TopNav from "../../components/patient/TopNav";
import Sidebar from "../../components/patient/Sidebar";

export default function PatientLayout() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a1110]">
            <TopNav />
            <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-6 p-4 md:p-10">
                <Sidebar />
                <main className="flex-1 min-w-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
