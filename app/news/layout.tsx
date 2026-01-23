import Hero from "@/app/components/Hero";
import SearchField from "@/app/components/SearchField";
import Sheet from "@/app/components/sheet";

export const revalidate = 60;

type Props = {
  children: React.ReactNode;
};

export default function NewsLayout({ children }: Props) {
  return (
    <>
      <Hero title="ニュース" sub="News" />
      <Sheet>
        <SearchField />
        {children}
      </Sheet>
    </>
  );
}
