"use client";
import Header from "@/components/Header/Header";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Voting from "@/components/Voting/Voting";
import Governance from "@/components/Governance/Governance/Governance";

export default function Home() {
  return (
    <>
      <Header />
      {/* <Navbar /> */}
      <Governance />
      <Voting />
      <Footer />
    </>
  );
}
