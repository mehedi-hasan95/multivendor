"use server";

import { userRole } from "@/generated/prisma";
import { db } from "@/lib/db";

export const updateUserRole = async (id: string, role: userRole) => {
  console.log(role);
  await db.user.update({
    where: {
      id,
    },
    data: {
      role,
    },
  });
};
