import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CrisisCard(props: {
  crisis: {
    id: number;
    title: string;
    category: string;
    severity: string;
    status: string;
    city: string;
  };
}) {
  const { crisis } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{crisis.title}</CardTitle>
        <CardDescription>{crisis.category} · {crisis.city}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Severity: {crisis.severity} · Status: {crisis.status}</p>
      </CardContent>
      <CardFooter>
        <Button
          variant="link"
          className="px-0"
          nativeButton={false}
          render={<Link href={"/ngo/crises/" + crisis.id} />}
        >
          View details
        </Button>
      </CardFooter>
    </Card>
  );
}
