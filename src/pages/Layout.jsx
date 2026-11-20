import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccessGate } from "@/components/common/AccessGate";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AccessGate />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
