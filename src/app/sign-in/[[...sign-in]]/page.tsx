import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-6 py-12">
      <SignIn />
    </div>
  );
}
