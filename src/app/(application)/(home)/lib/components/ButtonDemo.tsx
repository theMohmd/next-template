import { CogIcon } from "lucide-react";

import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/common/ui/button";

export default function ButtonDemo() {
  return (
    <div className="flex flex-col gap-5">
      <Typography variant="h2">Buttons</Typography>
      <div className="flex flex-wrap gap-5">
        <Button size="lg">lg button</Button>
        <Button size="default">default button</Button>
        <Button size="icon">
          <CogIcon />
        </Button>
        <Button size="sm">sm button</Button>
      </div>
      <div className="flex flex-wrap gap-5">
        <Button variant="default">default button</Button>
        <Button variant="secondary">secondary button</Button>
        <Button variant="outline">outline button</Button>
        <Button variant="destructive">destructive button</Button>
        <Button variant="link">link button</Button>
        <Button variant="ghost">ghost button</Button>
      </div>
      <div className="flex flex-wrap gap-5">
        <Button disabled variant="default">
          default button
        </Button>
        <Button disabled variant="secondary">
          secondary button
        </Button>
        <Button disabled variant="outline">
          outline button
        </Button>
        <Button disabled variant="destructive">
          destructive button
        </Button>
        <Button disabled variant="link">
          link button
        </Button>
        <Button disabled variant="ghost">
          ghost button
        </Button>
      </div>
      <div className="flex flex-wrap gap-5">
        <Button isLoading variant="default">
          default button
        </Button>
        <Button isLoading variant="secondary">
          secondary button
        </Button>
        <Button isLoading variant="outline">
          outline button
        </Button>
        <Button isLoading variant="destructive">
          destructive button
        </Button>
        <Button isLoading variant="link">
          link button
        </Button>
        <Button isLoading variant="ghost">
          ghost button
        </Button>
        <Button isLoading size="icon">
          <CogIcon />
        </Button>
      </div>
    </div>
  );
}
