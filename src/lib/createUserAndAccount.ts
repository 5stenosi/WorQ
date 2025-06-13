import { prisma } from "@/lib/prisma";

type OAuthProvider = "GOOGLE" | "GITHUB";

type Role = "CLIENT" | "AGENCY";

interface CreateUserAndAccountParams {
  email: string;
  provider: string;
  providerAccountId: string;
  role?: Role;
}

export async function createUserAndAccount({
  email,
  provider,
  providerAccountId,
  role = "CLIENT",
}: CreateUserAndAccountParams) {
  const user = await prisma.user.create({
    data: {
      email,
      oauthProvider: provider.toUpperCase() as OAuthProvider,
      oauthId: providerAccountId,
      role, // Set the user role (CLIENT or AGENCY)
    },
  });

  await prisma.account.create({
    data: {
      userId: user.id,
      type: "oauth",
      provider: provider,
      providerAccountId: providerAccountId,
    },
  });

  return user;
}
