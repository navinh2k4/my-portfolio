import DynamicBlogViewer from "@/components/blog/DynamicBlogViewer";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function ExternalPostPage({ params }: PageProps) {
  // Safely await params for Next.js async compatibility matrix
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return <DynamicBlogViewer id={id} />;
}
