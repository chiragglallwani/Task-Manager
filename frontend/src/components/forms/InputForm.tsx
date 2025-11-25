import type { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

type InputFormProps<T extends FieldValues> = {
  type: string;
  label: string;
  placeholder: string;
  name: Path<T>;
  control: Control<T>;
};

export const InputForm = <T extends FieldValues>({
  type,
  label,
  placeholder,
  name,
  control,
}: InputFormProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="text-start">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} placeholder={placeholder} type={type} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
