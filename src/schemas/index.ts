import { z } from "@/lib/zod";
import * as agencia from "./agencia";
import * as login from "./login";

const id = z.string().pipe(z.coerce.number().positive());

export const schemas = {
  agencia,
  id,
  login,
};
