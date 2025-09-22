import { startGoogleLogin } from "@/lib/api";

export default function LoginButton() {
  return (
    <button onClick={startGoogleLogin}>
      Login with Google
    </button>
  );
}
