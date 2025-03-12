"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setErrors({});
    setLoading(true);

    // request to the API route we just created
    await fetch("/api/login", {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          console.error(data);
          if (data?.data) {
            setErrors(data.data);
          }
          throw new Error(data?.message);
        }
        return data;
      })
      .then(({ data }) => {
        router.push("/");
      })
      .catch((error) => {
        toast.error(error?.message || "Something went wrong");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username" />
      <input type="password" name="password" placeholder="********" />
      <button type="submit" disabled={loading}>
        {loading ? "Loading..." : "Login"}
      </button>
    </form>
  );
}
