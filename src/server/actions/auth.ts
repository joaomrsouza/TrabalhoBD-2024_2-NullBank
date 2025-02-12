"use server";

import { type z } from "@/lib/zod";
import { schemas } from "@/schemas";
import { signIn, signOut } from "../auth";
import { type ActionResponse, handleErrors } from "../utils/actions";

type LoginFormData = z.infer<typeof schemas.login.form>;

export async function login(
  formData: LoginFormData,
): ActionResponse<LoginFormData, null> {
  try {
    await signIn("credentials", {
      ...schemas.login.form.parse(formData),
      redirect: false, // Desligado para ser redirecionado em consequência a action
      redirectTo: "/",
    });
    return {
      data: null,
      error: false,
    };
  } catch (error) {
    return handleErrors(error);
  }
}

export async function logout(): ActionResponse<null, null> {
  try {
    await signOut();
    return {
      data: null,
      error: false,
    };
  } catch (error) {
    return handleErrors(error);
  }
}
