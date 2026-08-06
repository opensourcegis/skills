import { SignUp } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/clerk-config";
import { SetupBanner } from "@/components/setup-banner";

export default function SignUpPage() {
  if (!isClerkConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="display text-4xl text-ink">Sign up</h1>
        <div className="mt-8">
          <SetupBanner />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-6 py-12">
      <SignUp />
    </div>
  );
}
