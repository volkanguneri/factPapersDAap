import Header from "@/components/Header/Header";
import Navbar from "@/components/Navbar/Navbar";
import Articles from "@/components/Articles/Articles";
import Footer from "@/components/Footer/Footer";
import Voting from "@/components/Voting/Voting";

export default function Home() {
  return (
    <>
      <Header />
      <Navbar />
      <Articles />
      <Voting />
      <Footer />
    </>
  );
}
