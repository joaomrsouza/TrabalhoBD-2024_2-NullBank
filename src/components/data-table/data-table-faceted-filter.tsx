"use client";

import type { Column } from "@tanstack/react-table";
import { CheckIcon, CirclePlusIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useSearchQuery } from "@/hooks";
import { type Option } from "@/hooks/use-data-table";
import { cn } from "@/lib/utils";
import { type ObjectSearch } from "@/utils/enums";
import { CommandLoading } from "cmdk";
import React from "react";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  options?: Option[];
  searchQueryObject?: ObjectSearch;
  title?: string;
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  options: fixedOptions,
  searchQueryObject,
  title,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  const [optionsCache, setOptionsCache] = React.useState<Map<string, Option>>(
    new Map(),
  );

  const {
    loading,
    onSearchChange,
    options: queryOptions,
    search,
  } = useSearchQuery(searchQueryObject).selectProps;

  const options = React.useMemo(
    () => fixedOptions ?? queryOptions,
    [fixedOptions, queryOptions],
  );

  const currentOptions = React.useMemo(
    () =>
      [
        ...optionsCache.values(),
        ...options.filter(option => !optionsCache.has(option.value)),
      ].sort((a, b) => a.label.localeCompare(b.label)),
    [options, optionsCache],
  );

  const filteredOptions = React.useMemo(() => {
    const searchText = search?.trim().toLowerCase();
    if (!searchText) return currentOptions;

    const regexes = searchText.split(" ").map(term => new RegExp(term, "i"));

    return currentOptions.filter(option =>
      regexes.every(regex => regex.test(option.label.trim().toLowerCase())),
    );
  }, [currentOptions, search]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 border-dashed">
          <CirclePlusIcon className="mr-2 size-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator className="mx-2 h-4" orientation="vertical" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selecionados
                  </Badge>
                ) : (
                  currentOptions
                    .filter(option => selectedValues.has(option.value))
                    .map(option => (
                      <Badge
                        key={option.value}
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[12.5rem] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={title}
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
              {filteredOptions.map(option => {
                const isSelected = selectedValues.has(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                        setOptionsCache(st => {
                          const map = new Map(st);
                          map.delete(option.value);
                          return map;
                        });
                      } else {
                        selectedValues.add(option.value);
                        setOptionsCache(st =>
                          new Map(st).set(option.value, option),
                        );
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined,
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className="size-4" aria-hidden="true" />
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 &&
              (search === "" ||
                search
                  ?.split(" ")
                  .every(term =>
                    new RegExp(term, "i").test("limpar filtros"),
                  )) && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      className="justify-center text-center"
                      onSelect={() => column?.setFilterValue(undefined)}
                    >
                      Limpar filtros
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
