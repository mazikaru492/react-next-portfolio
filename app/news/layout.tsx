import Hero from "@/app/components/Menu/Hero";
import SearchField from "@/app/components/SearchField";
import Sheet from "@/app/components/sheet";

export const revalidate = 60;

type Props = {
  children: React.ReactNode;
};

export default function NewsLayout({ children }: Props) {
  return (
    <>
      <Hero title="ブログ" sub="Blog" />
      <Sheet>
        <SearchField />
        {children}
      </Sheet>
    </>
  );
}
