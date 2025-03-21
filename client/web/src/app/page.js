import Hero from "@/components/hero";
import ExploreByKeywords from "@/components/explore-by-keywords";
import ExploreByAuthorities from "@/components/explore-by-authorities";
import ExploreByStates from "@/components/explore-by-states";
import Services from "@/components/services";
import Footer from "@/components/footer";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={"Loading..."}>
        <Hero />
      </Suspense>
      <Suspense fallback={"Loading..."}>
        <ExploreByKeywords />
      </Suspense>
      <Suspense fallback={"Loading..."}>
        <ExploreByAuthorities />
      </Suspense>
      <Suspense fallback={"Loading..."}>
        <ExploreByStates />
      </Suspense>
      <Suspense fallback={"Loading..."}>
        <Services />
      </Suspense>
    </div>
  );
}
