import { z } from "@/lib/zod";
import * as agencia from "./agencia";
import * as cliente from "./cliente";
import * as conta from "./conta";
import * as dependente from "./dependente";
import * as funcionario from "./funcionario";
import * as login from "./login";
import * as transacao from "./transacao";

const number = z.string().pipe(z.coerce.number().positive());
const string = z.string();

export const schemas = {
  agencia,
  cliente,
  conta,
  dependente,
  funcionario,
  login,
  number,
  string,
  transacao,
};
