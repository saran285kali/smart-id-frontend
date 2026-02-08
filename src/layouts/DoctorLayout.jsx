import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import SessionTimeout from "../components/SessionTimeout";
import OfflineStatus from "../components/OfflineStatus";

export default function DoctorLayout() {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <Sidebar role="doctor" />
            <SessionTimeout />
            <OfflineStatus />
            <main className="flex-1 overflow-auto p-8 lg:p-12">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
