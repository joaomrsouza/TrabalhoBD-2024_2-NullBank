import { env } from "@/env";
import { schemas } from "@/schemas";
import { omit } from "lodash";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "../database";
import { type Agencia } from "../database/queries/agencias";
import { type Conta } from "../database/queries/contas";
import { Cargos } from "../database/queries/funcionarios";
import { AuthService } from "../services/auth";

export const CargosUser = [...Cargos, "dba", "cliente"] as const;
export type CargoUser = (typeof CargosUser)[number];

export type User = {
  agencia?: Omit<Agencia, "sal_total">;
  cargo: CargoUser;
  conta?: Omit<Conta, "salt" | "senha">;
  id: string;
  nome: string;
  salt: Buffer;
  senha: Buffer;
};

export type SafeUser = Omit<User, "salt" | "senha">;

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: SafeUser;
  }

  // interface User {
  //   cargo: CargoUser;
  //   nome: string;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        ...(token as typeof token & { user: SafeUser }).user,
      },
    }),
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log(JSON.stringify(credentials, null, 2));
        const { conta, login, senha } = schemas.login.form.parse(credentials);

        const { hash, salt } = await AuthService.hashPassword(senha);

        console.log(
          JSON.stringify(
            { salt: salt.toString("base64"), senha: hash.toString("base64") },
            null,
            2,
          ),
        );
        // await db.sql`
        //   INSERT INTO funcionarios
        //     (agencias_num_ag, nome, data_nasc, genero, endereco, cidade, cargo, salario, senha, salt)
        //   VALUES
        //     (1, 'João Marcos', '2001-11-12', 'masculino', 'Rua Cel. Diogo Gomes', 'Sobral', 'gerente', 8000.00, ${hash.toString("base64")}, ${salt.toString("base64")})
        // `;
        const accessType = getAccessType(login, senha, Number(conta));

        const usuario = await (accessType.dba.condition()
          ? accessType.dba.getUser()
          : accessType.cliente.condition()
            ? accessType.cliente.getUser()
            : accessType.funcionario.condition()
              ? accessType.funcionario.getUser()
              : null);

        if (usuario?.cargo === "dba") return omit(usuario, ["senha", "salt"]);

        if (!usuario) {
          throw new Error("Login ou senha incorretos!");
        }

        try {
          await AuthService.comparePasswords(
            senha,
            usuario.senha,
            usuario.salt,
          );
        } catch (error) {
          if (error instanceof Error) throw new Error(error.message);
          throw error;
        }

        return omit(usuario, ["senha", "salt"]);
      },
      credentials: {
        conta: { label: "Conta", name: "conta" },
        login: { label: "Login", name: "login" },
        senha: { label: "Senha", name: "senha", type: "password" },
      },
      name: "Credentials",
    }),
  ],
  secret: env.AUTH_SECRET,
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;

function getAccessType(
  login: string,
  senha: string,
  conta: number | null,
): Record<
  "cliente" | "dba" | "funcionario",
  {
    condition: () => boolean;
    getUser: () => Promise<User | null>;
  }
> {
  return {
    cliente: {
      condition: () => login.replace(/\D/g, "").trim().length === 11,
      getUser: async () => {
        if (conta === null) return null;

        const cpf = login.replace(/\D/g, "").trim();
        const contas = await db.queries.contas.getByCliente(cpf);
        const selectedConta = contas.find(c => c.contas_num_conta === conta);
        if (!selectedConta) return null;

        const [agenciaData, contaData, clienteData] = await Promise.all([
          db.queries.agencias.getByNumero(selectedConta.agencias_num_ag),
          db.queries.contas.getByNumero(conta),
          db.queries.clientes.getByCpf(cpf),
        ]);

        if (!contaData || !clienteData) return null;

        return {
          agencia: omit(agenciaData, ["sal_total"]),
          cargo: "cliente",
          conta: omit(contaData, ["senha", "salt"]),
          id: cpf,
          nome: clienteData.nome,
          salt: Buffer.from(contaData.salt, "base64"),
          senha: Buffer.from(contaData.senha, "base64"),
        };
      },
    },
    dba: {
      condition: () => login === "Admin" && senha === "Root",
      getUser: async () => ({
        cargo: "dba",
        id: "0",
        nome: "Admin",
        salt: Buffer.from("", "base64"),
        senha: Buffer.from("", "base64"),
      }),
    },
    funcionario: {
      condition: () => !isNaN(Number(login)),
      getUser: async () => {
        const funcionario = await db.queries.funcionarios.getByMatricula(
          Number(login),
        );

        if (!funcionario) return null;

        const agencia = await db.queries.agencias.getByNumero(
          funcionario.agencias_num_ag,
        );

        return {
          agencia: omit(agencia, "sal_total"),
          cargo: funcionario.cargo,
          id: String(funcionario.matricula),
          nome: funcionario.nome,
          salt: Buffer.from(funcionario.salt, "base64"),
          senha: Buffer.from(funcionario.senha, "base64"),
        };
      },
    },
  };
}
