import { AuthProvider } from "./context/AuthContext";
import { Root } from "./Root";

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function MyLibraryApp() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}
