import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Plus, Trash } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function ProductSpecifications() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specifications",
  });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
        {fields.map((_, ind) => (
          <div
            key={ind}
            className="border-input space-y-2 rounded-md border p-3"
          >
            <div className="space-y-1">
              <Label>Title</Label>
              <Input
                {...register(`specifications.${ind}.title`)}
                placeholder="Enter title"
                className={cn({
                  "border-red-500": errors?.specifications?.[ind]?.title,
                })}
              />
            </div>

            <div className="space-y-1">
              <Label>Description</Label>
              <Input
                {...register(`specifications.${ind}.description`)}
                placeholder="Enter description"
                className={cn({
                  "border-red-500": errors?.specifications?.[ind]?.description,
                })}
              />
            </div>

            <div className="text-right">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => remove(ind)}
                disabled={fields.length === 1}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ title: "", description: "" })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Spec
        </Button>
      </div>
    </div>
  );
}
