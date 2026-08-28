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
  name: z
    .string()
    .trim()
    .nonempty("Name is required")
    .min(4, "Name must be at least 4 characters")
    .max(40, "Name must be at most 40 characters"),
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Registering...");
      try {
        // console.log("Submit Clicked...", value);
        const { data, error } = await authClient.signUp.email(value);
        console.log("data : ", data);
        console.log("error : ", error);

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        // if (data) {
        toast.success("Registration successful", { id: toastId });
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
        <CardTitle className="font-bold">Registration</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Enter your information below to create your account
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
            <form.Field name="name" children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Name</FieldLabel>
                  <Input
                    type="text"
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
          Register
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
