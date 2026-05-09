'use client';

import { useEffect, useState } from 'react';

import Hero from "@/components/Hero/Hero";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

import { getMenu } from "@/lib/api/clientApi";
import type { MenuCategory } from "@/types/menu";

export default function Home() {
  const [data, setData] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMenu()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
        <Hero />
      <Footer />
    </>
  );
}