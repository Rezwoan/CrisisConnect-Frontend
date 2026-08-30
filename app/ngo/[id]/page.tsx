import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

const ngos = [
  {
    id: "1",
    orgName: "CrisisConnect Relief Foundation",
    regNumber: "NGO-2024-001",
    city: "Dhaka",
    phone: "+8801700000001",
  },
  {
    id: "2",
    orgName: "Hope Aid Bangladesh",
    regNumber: "NGO-2024-002",
    city: "Chattogram",
    phone: "+8801700000002",
  },
];

export default async function NgoDetails({params}: PageProps<"/ngo/[id]">) {
  const { id } = await params;
  const ngo = ngos.find((n) => n.id === id);

  return (
    <>
      <Header title="NGO" />
      <Navigation />

      {ngo ? (
        <>
          <p>Organization Name: {ngo.orgName}</p>
          <p>Registration Number: {ngo.regNumber}</p>
          <p>City: {ngo.city}</p>
          <p>Phone: {ngo.phone}</p>
        </>
      ) : (
        <p>NGO not found.</p>
      )}
    </>
  );
}
