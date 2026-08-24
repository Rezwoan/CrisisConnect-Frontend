export default function Header(props: { title: string; subtitle: string }) {
  return (
    <>
      <h1>{props.title}</h1>
      <p>{props.subtitle}</p>
    </>
  );
}
