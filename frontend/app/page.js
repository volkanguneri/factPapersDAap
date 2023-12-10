"use client";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Voting from "@/components/Voting/Voting";
import Governance from "@/components/Governance/Governance/Governance";
import { ResultProvider } from "../components/UseContext/ResultContext";

export default function Home() {
  return (
    <>
      <Header />
      <ResultProvider>
        <Governance />
        <Voting />
      </ResultProvider>
      <Footer />
    </>
  );
}
