import Hero from "@/components/Hero/Hero";
import Categories from "@/components/Categories/Categories";
import MenuSection from "@/components/MenuSection/MenuSection";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

async function getMenu() {
  const res = await fetch(
    "https://sushi-blended-express.onrender.com/api/menu",
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch");

  return res.json();
}

export default async function Home() {
  const data = await getMenu();

  return (
    <>
      <Header />
      <Hero />
      {/* <Categories data={data} /> */}
      {/* <MenuSection data={data} /> */}
      <Footer/>
    </>
  );
}