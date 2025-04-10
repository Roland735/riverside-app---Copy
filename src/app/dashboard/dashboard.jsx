"use client";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Loading from "../components/Universal/loader";

function Dashboard() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function getSessionData() {
      const session = await getSession();
      setSession(session);

      if (session) {
        if (session.user.role === "admin") {
          window.location.href = "/dashboard/admin"; // Redirect to admin dashboard
        } else if (session.user.role === "canteen") {
          window.location.href = "/dashboard/canteen"; // Redirect to canteen dashboard
        } else if (session.user.role === "student") {
          window.location.href = "/dashboard/student"; // Redirect to student dashboard
        } else if (session.user.role === "ItSupport") {
          window.location.href = "/dashboard/ItSupport"; // Redirect to student dashboard
        } else if (session.user.role === "TuckShop") {
          window.location.href = "/dashboard/TuckShop"; // Redirect to student dashboard
        } else {
          signOut({ redirect: true, callbackUrl: "/auth/login" }); // Redirect to unauthorized page
        }
      } else {
        window.location.href = "/auth/login"; // Redirect to login page if session is not available
      }
    }
    getSessionData();
  }, []);

  if (!session) {
    return (
      <p>
        <Loading />
      </p>
    );
  }

  return null; // Render nothing if session exists and redirection is happening
}

export default Dashboard;
