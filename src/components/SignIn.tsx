import { signIn } from "@/auth";

export default function SignIn() {
  return (
    <div className="flex flex-col items-center space-y-4">
      // Form per il login con email e password
      <form
        className="flex flex-col space-y-2"
        action={async (formData) => {
          "use server"; // Esegue lato server
          await signIn("credentials", formData); // Login con credenziali
        }}
      >
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        <label>
          Password
          <input name="password" type="password" required />
        </label>
        <button type="submit">Sign In</button>
      </form>

      // Divisore
      <div className="border-t w-full border-gray-300 my-4"></div>

      // Pulsante per il login con Google
      <button
        type="button"
        onClick={async () => {
          "use server";
          await signIn("google"); // Login con Google
        }}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
}
