"use client";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import MobileNavbar from "@/app/components/Universal/MobileNavbar";
import ExamTrackingPage from "@/app/components/teacher/ExamTrackingPage";



function Dashboard({ params }) {
    const [session, setSession] = useState(null);
    const [redirectTime, setRedirectTime] = useState(5);
    const period = decodeURI(params.period);
    const year = decodeURI(params.year);

    useEffect(() => {
        async function getSessionData() {
            const session = await getSession();
            setSession(session);
        }
        getSessionData();
    }, []);

    const redirected = () => {
        signOut({ redirect: true, callbackUrl: "/auth/login" });
    };

    const handleRedirect = () => {
        const timer = setInterval(() => {
            if (redirectTime > 0) {
                setRedirectTime(redirectTime - 1);
            } else {
                clearInterval(timer);
                redirected(); // Redirect to login page after countdown
            }
        }, 1000);
        return () => clearInterval(timer); // Cleanup function for timer
    };

    if (!session) {
        return <p>Loading...</p>;
    } else if (session.user.role === "teacher") {
        return (
            <>
                <MobileNavbar />
                <div className="md:flex justify-between px-5 py-3 w-full items-center  shadow-2xl light-border">
                    <ExamTrackingPage session={session} period={period} year={year} />
                </div>

                <button
                    onClick={() =>
                        signOut({ redirect: true, callbackUrl: "/auth/login" })
                    }
                >
                    Logout
                </button>
            </>
        );
    } else {
        handleRedirect();
        return (
            <p className="flex items-center justify-center flex-col h-screen">
                <p className="text-lg font-bold mb-4">
                    You are not authorized to view this page. You&apos;re a {session.user.role}
                    .
                </p>
                <p>Redirecting to login in {redirectTime} seconds...</p>
                <button
                    onClick={() =>
                        signOut({ redirect: true, callbackUrl: "/auth/login" })
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
                >
                    Log Out
                </button>
            </p>
        );
    }
}

export default Dashboard;
