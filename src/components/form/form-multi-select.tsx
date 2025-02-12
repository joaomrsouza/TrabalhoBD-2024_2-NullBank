import { cn } from "@/lib/utils";
import { CommandLoading } from "cmdk";
import { sortBy } from "lodash";
import {
  AsteriskIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  XIcon,
} from "lucide-react";
import React from "react";
import {
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface FormMultiSelectProps<TFieldValues extends FieldValues> {
  cacheOptions?: boolean;
  className?: string;
  description?: React.ReactNode;
  disabled?: boolean;
  label: React.ReactNode;
  loading?: boolean;
  name: FieldPath<TFieldValues>;
  onSearchChange?: (search: string) => void;
  options: { label: string; value: string }[];
  required?: boolean;
  search?: string;
}

export function FormMultiSelect<TFieldValues extends FieldValues>(
  props: FormMultiSelectProps<TFieldValues>,
) {
  const {
    cacheOptions = false,
    className,
    description,
    disabled,
    label,
    loading,
    name,
    onSearchChange,
    options,
    required,
    search,
  } = props;

  const [optionsCache, setOptionsCache] = React.useState<
    Map<string, { label: string; value: string }>
  >(new Map());

  const { control } = useFormContext<TFieldValues>();

  const currentOptions = React.useMemo(
    () =>
      sortBy(
        cacheOptions
          ? [
              ...optionsCache.values(),
              ...options.filter(option => !optionsCache.has(option.value)),
            ]
          : options,
        ["label", "value"],
      ),
    [cacheOptions, options, optionsCache],
  );

  return (
    <FormField
      name={name}
      control={control}
      disabled={disabled}
      render={({
        field: { disabled, onBlur: handleBlur, onChange, value },
      }) => {
        if (!Array.isArray(value))
          return <>This component must be used with an array field</>;

        const values = new Set<unknown>(value);

        return (
          <FormItem className="my-4 flex w-full flex-col">
            <FormLabel className="flex gap-1">
              {label}
              {required && <AsteriskIcon className="size-4 text-destructive" />}
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    role="combobox"
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                      "w-full justify-between px-3",
                      !values.size && "text-muted-foreground",
                      className,
                    )}
                  >
                    <span className="flex gap-2">
                      {values.size
                        ? currentOptions
                            .filter(option => values.has(option.value))
                            .slice(0, 3)
                            .map(option => (
                              <Badge
                                key={option.value}
                                variant="secondary"
                                className="rounded-sm px-1 font-normal"
                              >
                                {option.label}
                              </Badge>
                            ))
                        : "‎"}
                      {values.size > 3 && (
                        <Badge
                          variant="secondary"
                          className="rounded-sm px-1 font-normal"
                        >
                          +{values.size - 3}
                        </Badge>
                      )}
                    </span>
                    {values.size ? (
                      <XIcon
                        onClick={() => onChange([])}
                        className="ml-2 size-4 shrink-0 rounded-sm opacity-50 hover:bg-destructive-foreground hover:text-destructive hover:opacity-75"
                      />
                    ) : (
                      <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-fit p-0">
                <Command onBlur={handleBlur}>
                  <CommandInput
                    placeholder="Pesquisar..."
                    {...(search !== undefined && onSearchChange !== undefined
                      ? { onValueChange: onSearchChange, value: search }
                      : {})}
                  />
                  <CommandList>
                    {loading ? (
                      <CommandLoading className="py-6 text-center text-sm">
                        Carregando...
                      </CommandLoading>
                    ) : (
                      <CommandEmpty>Não resultado encontrado.</CommandEmpty>
                    )}
                    <CommandGroup>
                      {currentOptions.map(option => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          keywords={[option.label]}
                          onSelect={() => {
                            const newValues = new Set(values);
                            if (values.has(option.value)) {
                              newValues.delete(option.value);
                              if (cacheOptions)
                                setOptionsCache(st => {
                                  const map = new Map(st);
                                  map.delete(option.value);
                                  return map;
                                });
                            } else {
                              newValues.add(option.value);
                              if (cacheOptions)
                                setOptionsCache(st =>
                                  new Map(st).set(option.value, option),
                                );
                            }

                            onChange(Array.from(newValues));
                          }}
                        >
                          <div
                            className={cn(
                              "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                              values.has(option.value)
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible",
                            )}
                          >
                            <CheckIcon className="size-4" aria-hidden="true" />
                          </div>
                          <span>{option.label}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    {values.size > 0 && (
                      <>
                        <CommandSeparator />
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => onChange([])}
                            className="justify-center text-center"
                          >
                            Limpar
                          </CommandItem>
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
