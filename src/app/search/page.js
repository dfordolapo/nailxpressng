import { connection } from "next/server";
import { getProducts } from "@/lib/api";
import SearchClient from "./SearchClient";

export const metadata = {
  title: "Search Results — Nailexpress",
  description: "Search for your favorite press-on nails.",
};

export default async function SearchPage() {
  await connection();
  const allProducts = await getProducts();
  
  return <SearchClient allProducts={allProducts} />;
}
