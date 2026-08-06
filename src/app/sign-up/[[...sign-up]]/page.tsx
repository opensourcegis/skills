import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-6 py-12">
      <SignUp />
    </div>
  );
}
