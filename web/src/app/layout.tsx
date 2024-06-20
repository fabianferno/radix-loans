"use client";

import Providers from "@/components/Providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useSigningClient } from "../contexts/cosmwasm";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "radix-loans",
  description: "Privacy enabled Prediction Market",
  icons: ["/logo/logo-dark.png"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { walletAddress, connectWallet, disconnect } = useSigningClient();
  const handleConnect = () => {
    if (walletAddress.length === 0) {
      console.log("Connecting Wallet");
      connectWallet();
    } else {
      disconnect();
    }
  };

  return (
    <html lang="en">
      <body className={`${inter.className} dark:bg-black`}>
        <Providers>
          <section>
            <Button
              className="block btn btn-outline btn-primary w-full max-w-full truncate"
              onClick={handleConnect}
            >
              {walletAddress || "Connect Wallet"}
            </Button>
            <main className="container flex min-h-screen flex-col items-center justify-between p-10">
              <div className="absolute top-5 right-5">
                <ModeToggle />
              </div>
              <div className="relative flex flex-col place-items-center">
                <Image
                  className="relative dark:filter dark:invert"
                  src="/logo/logo-dark.png"
                  alt="Karma Logo"
                  width={130}
                  height={130}
                  priority
                />
                <div className="text-center">
                  <div className="text-3xl font-bold">radix-loans</div>
                  <div className="text-lg ">Borrow with Privacy</div>
                </div>
              </div>

              <section className="lg:max-w-5xl lg:w-full ">
                <div className="text-zinc-400 text-center mb-2">
                  {" "}
                  &quot;radix-loans&quot; is a decentralized lending platform
                  built
                </div>{" "}
                <div className="ring-1 ring-zinc-700 rounded-xl p-8 w-full">
                  {children}
                </div>
                <p className="text-md mt-3 text-center text-zinc-600">
                  Powered by{" "}
                  <a
                    className="font-bold"
                    target="_blank"
                    href="https://scrt.network/"
                  >
                    Archway Network
                  </a>
                </p>
              </section>

              <section className="mt-10 ">
                <h3 className="text-md ml-5 text-zinc-600 mb-1">Howdy</h3>
              </section>
            </main>
          </section>
        </Providers>
      </body>
    </html>
  );
}
