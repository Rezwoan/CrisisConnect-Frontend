import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

export default function AdminRegisterPage() {
  return (
    <>
      <Header title="Admin Registration" />
      <Navigation />
      <p>
        Admins are not self-registered — see
        final-project-plans/admin/PLAN.md for how this role signs up.
      </p>
    </>
  );
}
