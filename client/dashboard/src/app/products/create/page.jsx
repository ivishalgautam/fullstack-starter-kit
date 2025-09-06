import ProductForm from "@/components/forms/product-form";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";

export default function CreatePage() {
  return (
    <PageContainer>
      <Heading title={"Create Product"} description="Create Product." />
      <ProductForm type="create" />
    </PageContainer>
  );
}
