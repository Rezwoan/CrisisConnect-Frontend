import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

export default function AdminLoginPage() {
  return (
    <>
      <Header title="Admin Login" />
      <Navigation />
      <p>
        Continue admin login here (password already checked by the shared
        /login page) — see final-project-plans/admin/PLAN.md.
      </p>
    </>
  );
}
