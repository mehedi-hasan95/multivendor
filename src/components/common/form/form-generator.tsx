import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

type Props = {
  id: string;
  type?: "text" | "email" | "password" | "number";
  inputType: "select" | "input" | "textarea";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  placeholder?: string;
  label?: string;
  name: string;
  rows?: number;
  options?: { value: string; label: string; id: string }[];
  disabled?: boolean;
};

export const FormGenerator = ({
  inputType,
  form,
  id,
  placeholder,
  label,
  name,
  rows,
  options,
  type,
  disabled,
}: Props) => {
  switch (inputType) {
    case "input":
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              {label && <FormLabel htmlFor={id}>{label}</FormLabel>}
              <FormControl>
                <Input
                  disabled={disabled}
                  type={type}
                  id={id}
                  placeholder={placeholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "textarea":
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              {label && <FormLabel htmlFor={id}>{label}</FormLabel>}
              <FormControl>
                <Textarea
                  disabled={disabled}
                  className="resize-none"
                  placeholder={placeholder}
                  {...field}
                  rows={rows ? rows : 4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "select":
      return (
        <FormField
          disabled={disabled}
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              {label && <FormLabel htmlFor={id}>{label}</FormLabel>}
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options?.map((item) => (
                    <SelectItem key={item.id} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    default:
      <></>;
  }
};
