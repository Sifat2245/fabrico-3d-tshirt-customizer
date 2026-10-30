import { Plus } from "lucide-react";

const QUESTIONS = [
  {
    question: "Do I need to know how to design?",
    answer:
      "Just bring an idea. Start with a T-shirt, hoodie, or cap and choose a blank canvas or a design from the collection. Pick colors, add text, and upload your artwork. You can see every change on your 3D garment as you work.",
  },
  {
    question: "What can I customize?",
    answer:
      "Customize a T-shirt, hoodie, or cap. Add colors, patterns, text, and uploaded images to the T-shirt’s front and back, the hoodie’s torso, or the cap’s crown. Adjust artwork size, position, rotation, and layers in the same studio.",
  },
  {
    question: "Can I use my own logo or artwork?",
    answer:
      "Yes. Open Uploads in the studio to add your own image or logo. A high-resolution PNG with a transparent background works especially well. You can place it on the front or back and adjust it to fit your design.",
  },
  {
    question: "Will I lose my design if I leave?",
    answer:
      "Each garment keeps its own draft, saved automatically in this browser. Switch between your tee, hoodie, and cap without losing your work. Return on the same device and browser to continue. Clearing your browser’s site data removes saved drafts.",
  },
  {
    question: "How do I order my design?",
    answer:
      "When your design feels right, select Review design in the studio. Choose your size and quantity, then add it to your bag. T-shirts and hoodies have clothing sizes; the cap comes in one size. Review your details and total before continuing.",
  },
];

export function StudioQuestions() {
  return (
    <section
      id="questions"
      className="studio-questions scroll-mt-24"
      aria-labelledby="questions-title"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 md:grid-cols-2 lg:gap-24 lg:px-8">
        <div data-reveal>
          <p className="studio-label mb-5">Before you make your mark</p>
          <h2 id="questions-title" className="section-heading">
            A FEW
            <br />
            GOOD QUESTIONS.
          </h2>
          <p className="mt-6 max-w-xs text-[var(--muted)]">
            A little clarity, so you can get straight to the creative part.
          </p>
        </div>
        <div data-reveal>
          {QUESTIONS.map((item) => (
            <details key={item.question} className="studio-question">
              <summary>
                {item.question}
                <Plus className="h-5 w-5 shrink-0" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
