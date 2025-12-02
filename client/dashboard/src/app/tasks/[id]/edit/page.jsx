import TaskForm from "@/components/forms/task";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import React from "react";

export default async function EditPage({ params }) {
  const { id } = await params;

  return (
    <PageContainer>
      <Heading title={"Edit task"} description="Edit task." />
      <TaskForm type="edit" id={id} />
    </PageContainer>
  );
}
