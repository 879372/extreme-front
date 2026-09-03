"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dashboard } from "../page";

export default function PainelPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("extreme_auth_token")) {
      router.replace("/login");
      return;
    }
    setAuthorized(true);
  }, [router]);

  function logout() {
    sessionStorage.removeItem("extreme_auth_token");
    router.replace("/login");
  }

  if (!authorized) return <main className="route-loading"><span>EXTREME</span><i /></main>;
  return <Dashboard onExit={logout} />;
}
