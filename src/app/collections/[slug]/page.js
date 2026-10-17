import { redirect } from "next/navigation";

export default async function CollectionsRedirect({ params }) {
  const { slug } = await params;
  redirect(`/collection/${slug}`);
}
