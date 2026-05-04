import Hero from "@/components/Hero/Hero";
import Categories from "@/components/Categories/Categories";
import MenuSection from "@/components/MenuSection/MenuSection";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

import { getMenu } from "@/lib/api/clientApi";
import type { MenuCategory } from "@/types/menu";

export default async function Home() {
  const data: MenuCategory[] = await getMenu();

  return (
    <>
      <Header />
      <Hero />

      {/* <Categories data={data} />
      <MenuSection data={data} /> */}

      <Footer />
    </>
  );
}