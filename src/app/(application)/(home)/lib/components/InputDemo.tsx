import { Typography } from "@/components/common/Typography";
import { Input } from "@/components/common/ui/input";
import { Separator } from "@/components/common/ui/separator";

export default function InputDemo() {
  return (
    <div className="flex flex-col gap-5">
      <Typography variant="h2">Inputs</Typography>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="flex flex-1 flex-col gap-5">
          <Input label="default input" />
          <Input size="sm" label="sm input" />
          <Input size="lg" label="lg input" />
          <Input variant="filled" label="filled input" />
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-1 flex-col gap-5">
          <Input type="file" label="file input" />
          <Input type="number" label="number input" />
          <Input label="input" autoComplete="country" />
          <Input
            type="password"
            label="password input"
            autoComplete="address-level3"
            name="name"
          />
          <Input placeholder="no label input" />
        </div>
      </div>
    </div>
  );
}
