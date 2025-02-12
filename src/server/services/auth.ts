import { pbkdf2, randomBytes, timingSafeEqual } from "crypto";

export class AuthService {
  private static ITERATIONS = 310000;
  private static KEYLEN = 32;
  private static DIGEST = "sha256";

  public static async hashPassword(
    senha: string,
  ): Promise<{ hash: Buffer; salt: Buffer }> {
    const salt = randomBytes(32);

    return new Promise((resolve, reject) => {
      pbkdf2(
        senha,
        salt,
        this.ITERATIONS,
        this.KEYLEN,
        this.DIGEST,
        (error, hash) => {
          if (error) {
            reject(error);
          }

          resolve({ hash, salt });
        },
      );
    });
  }

  public static async comparePasswords(
    password: string,
    hashedPassword: Buffer,
    salt: Buffer,
    message = "Login ou senha incorretos!",
  ): Promise<void> {
    return await new Promise((resolve, reject) =>
      pbkdf2(
        password,
        salt,
        this.ITERATIONS,
        this.KEYLEN,
        this.DIGEST,
        (error, hash) => {
          if (error) reject(error);

          if (!timingSafeEqual(hashedPassword, hash)) {
            reject(new Error(message));
          }

          resolve();
        },
      ),
    );
  }
}
