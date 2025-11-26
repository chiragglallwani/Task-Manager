import type { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "../ui/button";

type InputFormProps<T extends FieldValues> = {
  type: string;
  label: string;
  placeholder: string;
  name: Path<T>;
  control: Control<T>;
  isPasswordType?: boolean;
};

export const InputForm = <T extends FieldValues>({
  type,
  label,
  placeholder,
  name,
  control,
  isPasswordType = false,
}: InputFormProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="text-start">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                placeholder={placeholder}
                className="pr-14"
                type={
                  type === "password"
                    ? showPassword
                      ? "text"
                      : "password"
                    : type
                }
              />
              {isPasswordType && (
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeIcon className="h-4 w-4" />
                  ) : (
                    <EyeOffIcon className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
