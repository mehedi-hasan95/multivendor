import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username, admin, emailOTP } from "better-auth/plugins";
// If your Prisma file is located elsewhere, you can change the path
import { db } from "./db";
import { userRole } from "@/generated/prisma";
import { sendEmail } from "./node-mailer";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  user: {
    additionalFields: {
      role: {
        type: [userRole.user, userRole.vendor],
        required: true,
        defaultValue: userRole.user,
        input: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 4,
    maxPasswordLength: 64,
    autoSignIn: true,
    requireEmailVerification: true,
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },

  plugins: [
    username(),
    admin(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          await sendEmail(email, otp);
        }
      },
      allowedAttempts: 3,
    }),
  ],
});
