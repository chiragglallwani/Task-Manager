import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginSchemaType } from "@/types/schema";
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
import { useAuth } from "@/hooks/useAuth";

export const Login = () => {
  const { login, message } = useAuth();
  const navigate = useNavigate();
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    const response = await login(data.email, data.password);
    if (response) {
      navigate("/");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center text-2xl font-bold">
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              isPasswordType
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
          to="/signup"
        >
          Don't have an account? Register
        </Link>
      </CardFooter>
    </Card>
  );
};
