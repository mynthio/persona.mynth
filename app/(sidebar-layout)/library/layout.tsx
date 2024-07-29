import LibraryNavigation from "./_components/library-navigation.client";

export default async function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <div className="flex justify-center">
        <LibraryNavigation />
      </div> */}

      {/* <hr className="border-foreground-100 mt-6 mb-12" /> */}
      <hr className="border-none mt-10" />
      {children}
    </>
  );
}
