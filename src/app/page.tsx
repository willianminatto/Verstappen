import { Cursor } from "@/components/layout/Cursor";
import { Header } from "@/components/layout/Header";
import { Preloader } from "@/components/layout/Preloader";
import { Reveals } from "@/components/layout/Reveals";
import { Beyond } from "@/sections/Beyond";
import { Driver } from "@/sections/Driver";
import { Finale } from "@/sections/Finale";
import { Helmets } from "@/sections/Helmets";
import { Hero } from "@/sections/Hero";
import { Legacy } from "@/sections/Legacy";
import { Numbers } from "@/sections/Numbers";
import { OnTrack } from "@/sections/OnTrack";
import { Timeline } from "@/sections/Timeline";

export default function Home() {
  return (
    <>
      <Preloader />
      <Header />
      <div id="content">
        <main id="main">
          <Hero />
          <Driver />
          <Timeline />
          <Numbers />
          <OnTrack />
          <Helmets />
          <Beyond />
          <Legacy />
        </main>
        <Finale />
      </div>
      {/* Must stay last: its ScrollTriggers are created after the pinned sections. */}
      <Reveals />
      <Cursor />
    </>
  );
}
