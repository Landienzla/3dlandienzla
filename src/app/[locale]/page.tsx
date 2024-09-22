import STLViewer from "@/components/dev/stl";
import { getDictionary } from "./dictionaries";

export default async function Home({
  params: { locale },
}: {
  params: {
    locale: string;
  };
}) {
  const locale_dictionary = await getDictionary(locale);
  return (
    <div
      className="gridgrid-rows-[20px_1fr_20px]items-centerjustify-items-centermin-h-screenp-8pb-20gap-16sm:p-20font-[family-name:var(--font-geist-sans)]
      px-8 py-4
    "
    >
      <main className="">
        <div className="w-[30vw] h-[30vw]">
          <STLViewer />
        </div>
      </main>
    </div>
  );
}
