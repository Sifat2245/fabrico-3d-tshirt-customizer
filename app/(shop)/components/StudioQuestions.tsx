import { Plus } from "lucide-react";

const QUESTIONS = [
  {
    question: "Do I need to know how to design?",
    answer:
      "Just bring an idea. Start with a blank T-shirt or choose a design from the collection. Pick colors, add text, and upload your artwork using the studio’s simple tools. You can see every change on the 3D T-shirt as you work.",
  },
  {
    question: "What can I customize?",
    answer:
      "Make the front and back your own with colors, design patterns, fabric patterns, text, and uploaded images. Adjust the size, position, and rotation of your artwork, and organize your design with layers.",
  },
  {
    question: "Can I use my own logo or artwork?",
    answer:
      "Yes. Open Uploads in the studio to add your own image or logo. A high-resolution PNG with a transparent background works especially well. You can place it on the front or back and adjust it to fit your design.",
  },
  {
    question: "Will I lose my design if I leave?",
    answer:
      "Your work is saved automatically in this browser as you design. Return to the studio on the same device and browser to pick up where you left off. Clearing your browser’s site data will remove the saved design.",
  },
  {
    question: "How do I order my T-shirt?",
    answer:
      "When your design feels right, open the order summary in the studio, choose your size and quantity, and add it to your bag. Review your design details and total before continuing.",
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
