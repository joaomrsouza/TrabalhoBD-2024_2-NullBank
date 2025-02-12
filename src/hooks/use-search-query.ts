import { type ObjectSearch } from "@/server/api/routers/search";
import { api } from "@/trpc/react";
import React, { useMemo } from "react";
import { useDebounce } from "./use-debounce";

type UseSearchQueryReturn = {
  error: Error | null;
  handleSearch: (search: string) => void;
  loading: boolean;
  options: { label: string; value: string }[];
  search: string;
  selectProps: {
    cacheOptions?: boolean;
    loading?: boolean;
    onSearchChange?: (search: string) => void;
    options: { label: string; value: string }[];
    search?: string;
  };
};

export function useSearchQuery<WhereRestriction = Record<string, unknown>>(
  object?: ObjectSearch,
  whereRestriction?: WhereRestriction, // TODO: Remover isso e fazer rotas especializadas
): UseSearchQueryReturn {
  const [searchText, handleSearchText] = React.useState("");
  const search = useDebounce(searchText, 250);

  const {
    data,
    error,
    isLoading: loading,
  } = api.search.object.useQuery(
    {
      object: object!,
      search,
    },
    {
      enabled: !!object,
    },
  );

  const options = useMemo(() => data ?? [], [data]);

  const selectProps = React.useMemo(
    () => ({
      cacheOptions: true,
      loading,
      onSearchChange: handleSearchText,
      options,
      search: searchText,
    }),
    [loading, options, searchText],
  );

  return {
    error: new Error(error?.message),
    handleSearch: handleSearchText,
    loading,
    options,
    search: searchText,
    selectProps,
  };
}
