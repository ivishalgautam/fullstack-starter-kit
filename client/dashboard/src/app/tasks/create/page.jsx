import TaskForm from "@/components/forms/task";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";

export default function CreatePage() {
  return (
    <PageContainer>
      <Heading title={"Create task"} description="Create task." />
      <TaskForm />
    </PageContainer>
  );
}
