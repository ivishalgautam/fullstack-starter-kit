import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Plus, Trash } from "lucide-react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import FileUploaderServer from "@/features/file-uploader-server";

export default function ProductFeatures() {
  const {
    control,
    formState: { errors },
    register,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        {fields.map((field, index) => (
          <FeatureItem
            key={field.id}
            remove={remove}
            index={index}
            errors={errors}
            register={register}
          />
        ))}
      </div>
      <Button
        type="button"
        size="sm"
        onClick={() => append({ heading: "", image: null })}
        variant={"outline"}
        control={control}
      >
        <Plus className="h-4 w-4" /> Add feature Item
      </Button>
    </div>
  );
}

function FeatureItem({ register, index, remove, errors, control }) {
  return (
    <div className="border-input space-y-2 rounded-md border p-4">
      {/* Heading */}
      <div className="space-y-1">
        <Label>Heading</Label>
        <Input
          {...register(`features.${index}.title`)}
          placeholder="Enter heading"
          className={cn({
            "border-red-500": errors?.features?.[index]?.title,
          })}
        />
        {errors?.features?.[index]?.title && (
          <span className="text-xs text-red-500">
            {errors?.features?.[index]?.title?.message}
          </span>
        )}
      </div>

      {/* Decription */}
      <div className="space-y-1">
        <Label>Decription</Label>
        <Textarea
          {...register(`features.${index}.description`)}
          placeholder="Enter decription"
          className={cn({
            "border-red-500": errors?.features?.[index]?.description,
          })}
        />
        {errors?.features?.[index]?.description && (
          <span className="text-xs text-red-500">
            {errors?.features?.[index]?.description?.message}
          </span>
        )}
      </div>

      {/* Image Upload */}
      <div className="space-y-1">
        <Label>Image</Label>
        <Controller
          control={control}
          name={`features.${index}.image`}
          render={({ field: { value, onChange } }) => (
            <FileUploaderServer
              value={value}
              onFileChange={onChange}
              className={cn({
                "border-red-500": errors?.features?.[index]?.image,
              })}
            />
          )}
        />
        {errors?.features?.[index]?.image && (
          <span className="text-xs text-red-500">
            {errors?.features?.[index]?.image?.message}
          </span>
        )}
      </div>

      {/* Remove Button */}
      <div className="text-right">
        <Button
          variant="destructive"
          type="button"
          size="icon"
          onClick={() => remove(index)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
