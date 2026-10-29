import { StudioHero } from "./components/StudioHero";
import { StudioStory } from "./components/StudioStory";
import { StudioCollection } from "./components/StudioCollection";
import { StudioQuestions } from "./components/StudioQuestions";
import { StudioInvitation } from "./components/StudioInvitation";
import { LandingMotion } from "./components/LandingMotion";

export default function Home() {
  return (
    <LandingMotion>
      <StudioHero />
      <StudioStory />
      <StudioCollection />
      <StudioQuestions />
      <StudioInvitation />
    </LandingMotion>
  );
}
