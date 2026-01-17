import Hero from "@/app/components/Hero";
import Sheet from "@/app/components/sheet";

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <>
      <Hero title="Contact" sub="Get in touch" />
      <Sheet>{children}</Sheet>
    </>
  );
}
