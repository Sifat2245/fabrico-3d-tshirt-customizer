import Image from "next/image";
import { Asterisk } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100dvh-88px)] grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden min-h-160 overflow-hidden bg-accent p-12 text-white lg:block">
        <p className="studio-label">A space for your ideas</p>
        <h2 className="relative z-10 mt-10 font-display text-7xl leading-none tracking-tight">
          YOUR IDEAS
          <br />
          LOOK GOOD
          <br />
          ON YOU.
        </h2>
        <Image
          src="/images/studio/club.png"
          alt="An original T-shirt designed in the Fabrico studio"
          width={700}
          height={800}
          className="absolute -bottom-32 -right-16 w-3/4 -rotate-12"
        />
        <Asterisk
          className="absolute right-10 top-12 h-10 w-10 text-blue-200"
          strokeWidth={1}
        />
        <p className="absolute bottom-10 left-12 text-xs text-blue-100">
          A little imagination. Something entirely yours.
        </p>
      </div>
      <div className="flex items-center justify-center px-6 py-16 lg:px-16">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
