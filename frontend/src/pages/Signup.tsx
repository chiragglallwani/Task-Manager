import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterSchemaType } from "@/types/schema";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { InputForm } from "@/components/forms/InputForm";
import { Button } from "@/components/ui/button";
import { SelectForm } from "@/components/forms/SelectForm";
import { useAuth } from "@/hooks/useAuth";

export const Signup = () => {
  const { register, message } = useAuth();
  const navigate = useNavigate();
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "user",
    },
  });

  const handleSubmit = async (data: RegisterSchemaType) => {
    const response = await register(data.email, data.password, data.role);
    if (response) {
      navigate("/");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center text-2xl font-bold">
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <InputForm
              type="email"
              label="Email"
              placeholder="example@example.com"
              name="email"
              control={form.control}
            />
            <InputForm
              type="password"
              label="Password"
              placeholder="********"
              name="password"
              control={form.control}
            />
            <SelectForm
              label="Role"
              placeholder="Select a role"
              name="role"
              control={form.control}
              options={[
                { value: "user", label: "User" },
                { value: "admin", label: "Admin" },
              ]}
            />
            {message && <p className="text-red-500">{message}</p>}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link
          className="underline text-muted-foreground underline-offset-2"
          to="/signin"
        >
          Already have an account? Sign in
        </Link>
      </CardFooter>
    </Card>
  );
};
