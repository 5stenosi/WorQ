import { useSearchParams } from "next/navigation";

export function useAuthErrorMessage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "";

  switch (error) {
    case "OAuthAccountNotLinked":
      errorMessage =
        "This email is already associated with another provider. Please sign in with the original method.";
      break;
    case "CredentialsSignin":
      errorMessage =
        "Invalid credentials. Please check your email and password.";
      break;
    case "AccessDenied":
      errorMessage = "You must be logged in to access this page.";
      break;
    default:
      return null;
  }

  return errorMessage;
}
