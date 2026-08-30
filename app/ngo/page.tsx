import Link from "next/link";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

export default function NgoList() {
  return (
    <>
      <Header title="NGO" />
      <Navigation />
      <br />
      <Link href="/ngo/1">NGO 1</Link>
      <Link href="/ngo/2">NGO 2</Link>
    </>
  );
}
