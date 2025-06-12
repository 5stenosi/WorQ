import { useSearchParams } from "next/navigation";

// Function to extract and return the error message based on the search parameters
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
        "Invalid credentials. Make sure you're registered and try again.";
      break;
    case "AccessDenied":
      errorMessage = "You must be logged in to access this page.";
      break;
    default:
      return null;
  }

  return errorMessage;
}
