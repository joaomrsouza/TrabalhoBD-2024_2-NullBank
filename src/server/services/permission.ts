import "server-only";

import { PermissionError } from "../utils/errors/permission-error";

import { redirect } from "next/navigation";
import { auth } from "../auth";
import { type CargoUser, type SafeUser } from "../auth/config";

export class Permission {
  static async safeGetAuthUser(permissoes: CargoUser | CargoUser[] = []) {
    try {
      return await this.getAuthUser(permissoes);
    } catch (error) {
      if (
        error instanceof PermissionError &&
        error.cause?.includes("unauthenticated")
      ) {
        redirect("/login");
      }
      redirect("/");
    }
  }

  static async getAuthUser(
    permissoes: CargoUser | CargoUser[] = [],
  ): Promise<SafeUser> {
    const session = await auth();

    if (!session?.user) {
      throw new PermissionError(
        "Acesso negado",
        "Você não está autenticado.",
        "unauthenticated",
      );
    }

    if (!this.temPermissaoDeAcesso(permissoes, session.user)) {
      throw new PermissionError(
        "Acesso negado",
        "Você não tem permissão para acessar este recurso.",
        "unauthorized",
      );
    }

    return session.user;
  }

  /**
   * Verifica se um usuário tem pelo menos uma dos cargos requeridos.
   *
   * @function temPermissaoDeAcesso
   * @param {CargoUser[]} cargoRequerido CargoUser necessário
   * @param {User} usuario Usuário
   * @returns {boolean} Resultado da permissão de acesso
   */
  public static temPermissaoDeAcesso(
    cargoRequerido: CargoUser | CargoUser[],
    usuario: SafeUser,
  ): boolean {
    if (cargoRequerido.length === 0) return true;

    return [cargoRequerido].flat().includes(usuario.cargo);
  }
}
