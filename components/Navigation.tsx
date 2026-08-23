import Link from "next/link";

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      {" | "}
      <Link href="/login">Login</Link>
      {" | "}
      <Link href="/register">Register</Link>
      {" | "}
      <Link href="/ngo/1">NGO 1</Link>
      {" | "}
      <Link href="/ngo/2">NGO 2</Link>
    </nav>
  );
}
