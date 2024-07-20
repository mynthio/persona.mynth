import LibraryNavigation from "./_components/library-navigation.client";

export default async function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LibraryNavigation />

      <hr className="border-none my-2" />

      {children}
    </>
  );
}
