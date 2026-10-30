import { StudioHero } from "./components/StudioHero";
import { StudioStory } from "./components/StudioStory";
import { StudioCollection } from "./components/StudioCollection";
import { StudioQuestions } from "./components/StudioQuestions";
import { StudioInvitation } from "./components/StudioInvitation";
import { LandingMotion } from "./components/LandingMotion";
import { StudioCanvases } from "./components/StudioCanvases";
import { StudioSignature } from "./components/StudioSignature";

export default function Home() {
  return (
    <LandingMotion>
      <StudioHero />
      <StudioCanvases />
      <StudioStory />
      <StudioSignature />
      <StudioCollection />
      <StudioQuestions />
      <StudioInvitation />
    </LandingMotion>
  );
}
