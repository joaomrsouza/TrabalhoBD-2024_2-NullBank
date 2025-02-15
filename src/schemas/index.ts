import { z } from "@/lib/zod";
import * as agencia from "./agencia";
import * as cliente from "./cliente";
import * as login from "./login";

const id = z.string().pipe(z.coerce.number().positive());
const string = z.string();

export const schemas = {
  agencia,
  cliente,
  string,
  id,
  login,
};
