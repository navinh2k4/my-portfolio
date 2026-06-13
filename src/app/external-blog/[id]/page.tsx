import { DynamicBlogViewer } from "@/components/blog/DynamicBlogViewer";

export default async function ExternalBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const routeParams = await params;
  return <DynamicBlogViewer id={routeParams.id} />;
}
