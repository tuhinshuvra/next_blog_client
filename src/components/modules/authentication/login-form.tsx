"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle, } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner";
import * as z from "zod"

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters")
})

export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Logging in...");
      try {
        // console.log("Submit Clicked...", value);
        const { data, error } = await authClient.signIn.email(value);
        console.log("data : ", data);
        console.log("error : ", error);

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        // if (data) {
        toast.success("Login successful", { id: toastId });
        // }

      } catch (error) {
        console.log(error);
        toast.error("Something went wrong, please try again", { id: toastId });
      }
    }
  });

  const handleGoogleLogin = async () => {
    const data = authClient.signIn.social({
      provider: "google",
      callbackURL: "http://localhost:3000",
    });

    console.log("handleGoogleLogin : ", data);
  }

  return (
    <Card {...props}>
      <CardHeader className=" text-center ">
        <CardTitle className="font-bold">Login</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Enter your email and password to login.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}>

          <FieldGroup>


            <form.Field name="email" children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => { field.handleChange(e.target.value); }}
                  />
                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              );
            }}
            />

            <form.Field name="password" children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    type="password"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => { field.handleChange(e.target.value); }}

                  />
                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              );
            }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className=" flex flex-col gap-3 justify-end" >
        <Button
          className="w-full"
          variant="default"
          form="login-form"
          type="submit">
          Login
        </Button>

        <Button
          onClick={() => handleGoogleLogin()}
          variant="outline"
          type="button"
          className="w-full"
        >
          Continue with Google
        </Button>
      </CardFooter>
    </Card>
  )
}
