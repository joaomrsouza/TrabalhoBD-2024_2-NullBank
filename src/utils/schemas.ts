import { z } from "@/lib/zod";
import { omit } from "lodash";

export function addQueryParams<T extends z.ZodRawShape>(
  zodSchema: z.ZodObject<T>,
) {
  return zodSchema
    .extend({
      page: z.coerce.number().default(1),
      perPage: z.coerce.number().default(10),
      sort: z.string().default(""),
    })
    .transform(q => {
      const [field, order] = (q.sort as string).split(".") as [string, string];

      return {
        ...omit(q, ["page", "perPage", "sort"]),
        ...(q.sort && { orderBy: { field, order } }),
        skip: ((q.page as number) - 1) * (q.perPage as number),
        take: q.perPage as number,
      };
    });
}
