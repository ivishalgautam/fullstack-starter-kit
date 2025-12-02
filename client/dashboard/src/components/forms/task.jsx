"use client";
import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { ExternalLink, Loader2, XIcon } from "lucide-react";
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
import { useFormattedCategories } from "@/hooks/use-categories";
import CommandMenu from "../command-menu";
import { DatePicker } from "../ui/date-picker";
import { useFormattedUsers } from "@/hooks/use-users";
import { H3 } from "../ui/typography";
import { DateTimePickerForm } from "../ui/date-time-picker";

export default function TaskForm({ id, type = "create" }) {
  const [files, setFiles] = useState({
    image: [],
    pdf: [],
    audio: [],
  });
  const [fileUrls, setFileUrls] = useState({
    image_urls: [],
    pdf_urls: [],
    audio_urls: [],
  });

  const [userSearch, setUserSearch] = useState("");

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
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useFormattedCategories("");

  const {
    data: usersData,
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
  } = useFormattedUsers("role=manager.employee");
  const frequency = watch("frequency");

  const onSubmit = (form) => {
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
        image_urls: data?.image ?? [],
        pdf_urls: data?.pdf ?? [],
        audio_urls: data?.audio ?? [],
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
      <div className="grid gap-3 md:grid-cols-3">
        {/* Title */}
        <div>
          <Label>Title</Label>
          <Input
            {...register("title")}
            className={cn({ "border-red-500": errors.title })}
            placeholder="Enter title"
          />
        </div>

        {/* Description */}
        <div className="col-span-full">
          <Label>Description</Label>
          <Textarea
            {...register("description")}
            rows={3}
            placeholder="Enter description"
          />
        </div>

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
                  isLoading={isCategoriesLoading}
                  isError={isCategoriesError}
                  error={categoriesError}
                />
              );
            }}
          />
        </div>

        {/* Due Date */}
        <div className="md:col-span-2">
          <Label>Due Date</Label>
          <Controller
            name="due_date"
            control={control}
            render={({ field }) => {
              return (
                <DateTimePickerForm
                  onChange={field.onChange}
                  value={field.value}
                />
              );
            }}
          />
        </div>

        {/* Enums */}
        {/* priority */}
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

        {/* status */}
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

        {/* assigned to */}
        <div>
          <Label>Assigned To</Label>
          <Controller
            name="assigned_to"
            control={control}
            render={({ field }) => {
              return (
                <CustomMultiSelect
                  options={usersData}
                  async
                  isLoading={isUsersLoading}
                  isError={isUsersError}
                  error={usersError}
                  onChange={field.onChange}
                  value={field.value}
                  placeholder="Select users"
                />
              );
            }}
          />
        </div>

        {/* in loop */}
        <div>
          <Label>In loop</Label>
          <Controller
            name="in_loop"
            control={control}
            render={({ field }) => {
              return (
                <CustomMultiSelect
                  options={usersData}
                  async
                  isLoading={isUsersLoading}
                  isError={isUsersError}
                  error={usersError}
                  onChange={field.onChange}
                  value={field.value}
                  placeholder="Select users"
                />
              );
            }}
          />
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
            <Controller
              name="end_date"
              control={control}
              render={({ field }) => {
                return (
                  <DateTimePickerForm
                    onChange={field.onChange}
                    value={field.value}
                  />
                );
              }}
            />
          </>
        )}
      </div>

      {/* attachments */}
      <div className="space-y-2">
        <H3>Attachments</H3>
        <div className="grid gap-3 md:grid-cols-3">
          {/* Images */}
          <div className="space-y-4">
            <Label>Image</Label>
            <Input
              type="file"
              multiple
              onChange={(e) =>
                setFiles((prev) => ({
                  ...prev,
                  image: Array.from(e.target.files),
                }))
              }
              className={cn({ "border-destructive": errors.image })}
            />
            <div className="flex flex-wrap items-center justify-start gap-2">
              {fileUrls?.image_urls?.map((file, index) => (
                <div
                  key={index}
                  className="hover:bg-muted/50 relative flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <a href={`${config.file_base}/${file}`} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <span className="truncate">{file.split("\\").pop()}</span>
                  </div>
                  <Button
                    onClick={() =>
                      setFileUrls((prev) => ({
                        ...prev,
                        image_urls: prev.image_urls.filter((i) => i !== file),
                      }))
                    }
                    size="icon"
                    className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                    aria-label="Remove image"
                    type="button"
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          {/* pdf */}
          <div className="space-y-4">
            <Label>PDF</Label>
            <Input
              type="file"
              multiple
              onChange={(e) =>
                setFiles((prev) => ({
                  ...prev,
                  pdf: Array.from(e.target.files),
                }))
              }
              className={cn({ "border-destructive": errors.pdf })}
            />
            <div className="flex flex-wrap items-center justify-start gap-2">
              {fileUrls?.pdf_urls?.map((file, index) => (
                <div
                  key={index}
                  className="hover:bg-muted/50 relative flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <a>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <span className="truncate">{file.split("\\").pop()}</span>
                  </div>
                  <Button
                    onClick={() =>
                      setFileUrls((prev) => ({
                        ...prev,
                        pdf_urls: prev.pdf_urls.filter((i) => i !== file),
                      }))
                    }
                    size="icon"
                    className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                    aria-label="Remove image"
                    type="button"
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          {/* audio */}
          <div className="space-y-4">
            <Label>Audio</Label>
            <Input
              type="file"
              multiple
              onChange={(e) =>
                setFiles((prev) => ({
                  ...prev,
                  audio: Array.from(e.target.files),
                }))
              }
              className={cn({ "border-destructive": errors.audio })}
            />
            <div className="flex flex-wrap items-center justify-start gap-2">
              {fileUrls?.audio_urls?.map((file, index) => (
                <div
                  key={index}
                  className="hover:bg-muted/50 relative flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <a>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <span className="truncate">{file.split("\\").pop()}</span>
                  </div>
                  <Button
                    onClick={() =>
                      setFileUrls((prev) => ({
                        ...prev,
                        audio_urls: prev.audio_urls.filter((i) => i !== file),
                      }))
                    }
                    size="icon"
                    className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                    aria-label="Remove image"
                    type="button"
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
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
