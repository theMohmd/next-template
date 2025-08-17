import { Typography } from "@/components/common/Typography";

export default function TypographyDemo() {
  return (
    <div className="flex flex-col gap-5">
      <Typography variant="h1" className="">
        Typography h1
      </Typography>
      <Typography variant="h2">Typography h2</Typography>
      <Typography variant="h3">Typography h3</Typography>
      <Typography variant="h4">Typography h4</Typography>
      <Typography variant="h5">Typography h5</Typography>
      <Typography variant="h6">Typography h6</Typography>
      <Typography variant="p">Typography p</Typography>
      <Typography variant="lead">Typography lead p</Typography>
      <Typography variant="large">Typography large p</Typography>
      <Typography variant="small">Typography small p</Typography>
      <Typography variant="muted">Typography muted p</Typography>
      <Typography variant="blockquote">Typography blockquote</Typography>
      <Typography variant="code">Typography code</Typography>
    </div>
  );
}
