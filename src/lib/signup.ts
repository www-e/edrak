import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SignupData } from "@/types/auth";

const prisma = new PrismaClient();

export async function signupUser(data: SignupData) {
  // Check if username already exists
  const existingUser = await prisma.user.findUnique({
    where: { username: data.username },
  });

  if (existingUser) {
    throw new Error("Username already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      username: data.username,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      secondPhoneNumber: data.secondPhoneNumber,
      categoryPreference: data.categoryPreference,
      referralSource: data.referralSource,
      role: "STUDENT", // Default role for signup
      isActive: true,
    },
  });

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}