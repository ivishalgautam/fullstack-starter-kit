"use client";
import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Loader2, XIcon } from "lucide-react";
import Image from "next/image";
import FileUpload from "../file-uploader";
import Loader from "../loader";
import ErrorMessage from "../ui/error";
import { toast } from "sonner";
import config from "@/config";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { taskSchema } from "@/schemas/task-schema";
import { useCreateTask, useTask, useUpdateTask } from "@/hooks/use-task";
import CustomSelect from "../custom-select";
import CustomMultiSelect from "../custom-multi-select";
import { days, monthlyOptions } from "@/data";
import { useCategories, useFormattedCategories } from "@/hooks/use-categories";
import CommandMenu from "../command-menu";
import { DatePicker } from "../ui/date-picker";

export default function TaskForm({ id, type = "create" }) {
  const [files, setFiles] = useState({ attachments: [] });
  const [fileUrls, setFileUrls] = useState({ attachments: [] });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
    setError,
  } = useForm({
    resolver: zodResolver(taskSchema),
  });

  const router = useRouter();

  const handleSuccess = () => {
    reset();
    router.replace("/tasks?page=1&limit=10");
  };

  const createMutation = useCreateTask(handleSuccess);
  const updateMutation = useUpdateTask(id, handleSuccess);
  const { data, isLoading, isError, error } = useTask(id);

  const {
    data: categoriesData,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    error: categoryError,
  } = useFormattedCategories("");

  const frequency = watch("frequency");

  const onSubmit = (form) => {
    if (!fileUrls.attachments.length && !files.attachments.length) {
      toast.warning("At least 1 attachment is required");
      return setError("attachments", { type: "manual", message: "Required*" });
    }

    const formData = new FormData();

    Object.entries(files).forEach(([key, value]) => {
      value.forEach((file) => formData.append(key, file));
    });

    Object.entries(form).forEach(([key, value]) => {
      typeof value === "object"
        ? formData.append(key, JSON.stringify(value))
        : formData.append(key, value);
    });

    if (type === "edit") {
      Object.entries(fileUrls).forEach(([key, values]) => {
        formData.append(key, JSON.stringify(values));
      });
    }

    type === "create"
      ? createMutation.mutate(formData)
      : updateMutation.mutate(formData);
  };

  const handleAttachmentChange = useCallback((data) => {
    setFiles((prev) => ({ ...prev, attachments: data }));
  }, []);

  useEffect(() => {
    if (data) {
      reset({
        title: data.title,
        description: data.description,
        category_id: data.category_id,
        due_date: data.due_date?.slice(0, 10),
        assigned_to: data.assigned_to,
        project_id: data.project_id,
        status: data.status,
        priority: data.priority,
        frequency: data.frequency?.frequency ?? "Once",
        weekly_repeat_days: data.frequency?.weekly_repeat_days ?? [],
        monthly_repeat_days: data.frequency?.monthly_repeat_days ?? [],
        end_date: data.frequency?.end_date?.slice(0, 10),
        is_repeated: data.is_repeated,
      });

      setFileUrls((prev) => ({
        ...prev,
        attachments: data.attachments ?? [],
      }));
    }
  }, [data, reset]);

  const isFormPending =
    (type === "create" && createMutation.isPending) ||
    (type === "edit" && updateMutation.isPending);

  if (type === "edit" && isLoading) return <Loader />;
  if (type === "edit" && isError) return <ErrorMessage error={error} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Attachments */}
      <div className="space-y-3">
        <Label>Attachments</Label>
        <FileUpload
          onFileChange={handleAttachmentChange}
          inputName="attachments"
          multiple
          maxFiles={50}
          className={cn({ "border-red-500": errors.attachments })}
        />

        {fileUrls.attachments?.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3">
            {fileUrls.attachments.map((file, idx) => (
              <div
                key={idx}
                className="bg-accent relative aspect-square w-24 rounded-md"
              >
                <Image
                  src={`${config.file_base}/${file}`}
                  width={200}
                  height={200}
                  alt="file"
                  className="rounded-md object-cover"
                />
                <Button
                  size="icon"
                  type="button"
                  className="absolute -top-2 -right-2 size-6 rounded-full border"
                  onClick={() =>
                    setFileUrls((prev) => ({
                      ...prev,
                      attachments: prev.attachments.filter((f) => f !== file),
                    }))
                  }
                >
                  <XIcon className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Title */}
      <div>
        <Label>Title</Label>
        <Input
          {...register("title")}
          className={cn({ "border-red-500": errors.title })}
        />
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <Textarea {...register("description")} rows={3} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Category */}
        <div>
          <Label>Category</Label>
          <Controller
            name="category_id"
            control={control}
            render={({ field }) => {
              return (
                <CommandMenu
                  data={categoriesData}
                  onChange={field.onChange}
                  value={field.value}
                  async={true}
                  isLoading={isCategoryLoading}
                  isError={categoryError}
                  error={categoryError}
                />
              );
            }}
          />
        </div>

        {/* Due Date */}
        <div>
          <Label>Due Date</Label>
          <Controller
            name="due_date"
            control={control}
            render={({ field }) => {
              return (
                <DatePicker onChange={field.onChange} value={field.value} />
              );
            }}
          />
        </div>
      </div>

      {/* Enums */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Priority</Label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => {
              return (
                <CustomSelect
                  onChange={field.onChange}
                  value={field.value}
                  options={[
                    { value: "Low", label: "Low" },
                    { value: "Medium", label: "Medium" },
                    { value: "High", label: "High" },
                  ]}
                  placeholder="Select priority"
                />
              );
            }}
          />
        </div>
        <div>
          <Label>Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => {
              return (
                <CustomSelect
                  onChange={field.onChange}
                  value={field.value}
                  options={[
                    { value: "Pending", label: "Pending" },
                    { value: "In Progress", label: "In Progress" },
                    { value: "Completed", label: "Completed" },
                    { value: "Cancelled", label: "Cancelled" },
                    { value: "Delayed", label: "Delayed" },
                  ]}
                  placeholder="Select status"
                />
              );
            }}
          />
        </div>

        <div>
          <Label>Assigned To (UUID)</Label>
          <Input {...register("assigned_to")} />
        </div>
      </div>

      {/* Recurrence */}
      <div className="space-y-3">
        <Label>Repeat</Label>
        <Controller
          name="is_repeated"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <span>Enable recurrence</span>
            </div>
          )}
        />

        {watch("is_repeated") && (
          <>
            <Label>Frequency</Label>
            <Controller
              name="frequency"
              control={control}
              render={({ field }) => {
                return (
                  <CustomSelect
                    onChange={field.onChange}
                    value={field.value}
                    options={[
                      { value: "Once", label: "Once" },
                      { value: "In Progress", label: "In Progress" },
                      { value: "Daily", label: "Daily" },
                      { value: "Weekly", label: "Weekly" },
                      { value: "Monthly", label: "Monthly" },
                      { value: "Yearly", label: "Yearly" },
                    ]}
                    placeholder="Select frequency"
                  />
                );
              }}
            />

            {/* Weekly */}
            {frequency === "Weekly" && (
              <Controller
                name="weekly_repeat_days"
                control={control}
                render={({ field }) => {
                  return (
                    <CustomMultiSelect
                      options={days}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  );
                }}
              />
            )}

            {/* Monthly */}
            {frequency === "Monthly" && (
              <Controller
                name="monthly_repeat_days"
                control={control}
                render={({ field }) => (
                  <CustomMultiSelect
                    options={monthlyOptions}
                    onChange={field.onChange}
                    value={field.value}
                    placeholder="Select Dates"
                  />
                )}
              />
            )}

            <Label>Recurrence End Date</Label>
            <Input type="date" {...register("end_date")} />
          </>
        )}
      </div>

      {/* Submit */}
      <div className="mb-2 text-end">
        <Button disabled={isFormPending}>
          {isFormPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          Submit
        </Button>
      </div>
    </form>
  );
}
