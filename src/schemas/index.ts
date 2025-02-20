import { z } from "@/lib/zod";
import * as agencia from "./agencia";
import * as cliente from "./cliente";
import { consultas } from "./consultas";
import * as dependente from "./dependente";
import * as funcionario from "./funcionario";
import * as login from "./login";

const number = z.string().pipe(z.coerce.number().positive());
const string = z.string();

export const schemas = {
  agencia,
  cliente,
  consultas,
  dependente,
  funcionario,
  login,
  number,
  string,
};
