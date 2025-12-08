import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaClient, User, Role } from "@prisma/client";
import { SessionUser } from "@/types/auth";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Find user by username with required billing fields
        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username,
          },
          select: {
            id: true,
            username: true,
            email: true,
            password: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            role: true,
            isActive: true,
          },
        });

        // If no user found or password doesn't match, return null
        if (!user || !await bcrypt.compare(credentials.password, user.password)) {
          return null;
        }

        // For professors, ensure they can only sign in (no signup)
        if (credentials.role === "PROFESSOR" && user.role !== "PROFESSOR") {
          return null;
        }

        // For students, ensure they have the correct role
        if (credentials.role === "STUDENT" && user.role !== "STUDENT") {
          return null;
        }

        // For admin, ensure they have the correct role
        if (credentials.role === "ADMIN" && user.role !== "ADMIN") {
          return null;
        }

        // Return user object without password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const userWithBilling = user as User & { firstName: string; lastName: string; phoneNumber: string };
        token.id = user.id;
        token.role = userWithBilling.role;
        token.email = user.email; // Add email to the token
        token.firstName = userWithBilling.firstName; // Add billing fields to token
        token.lastName = userWithBilling.lastName;
        token.phoneNumber = userWithBilling.phoneNumber;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // Extend session user with custom properties including billing fields
        const extendedUser: SessionUser = {
          id: token.id as string,
          role: token.role as Role,
          name: session.user.name,
          email: token.email as string, // Ensure email is passed to the session
          image: session.user.image,
          firstName: (token as { firstName?: string }).firstName || null,
          lastName: (token as { lastName?: string }).lastName || null,
          phoneNumber: (token as { phoneNumber?: string }).phoneNumber || null,
        };
        session.user = extendedUser;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);