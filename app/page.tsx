import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

export default function Home() {
  return (
    <>
      <Header title="Home" subtitle="Welcome to our home page!" />
      <Navigation />
      <p>This is the landing page of the application.</p>
    </>
  );
}
