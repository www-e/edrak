import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import { SignupData } from "@/types/auth";

export async function signupUser(data: SignupData) {
   // Check if username already exists
   const existingUser = await db.user.findUnique({
     where: { username: data.username },
   });

   if (existingUser) {
     throw new Error("Username already exists");
   }

   // Check if email already exists
   const existingEmail = await db.user.findUnique({
     where: { email: data.email },
   });

   if (existingEmail) {
     throw new Error("Email already exists");
   }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create user
  const user = await db.user.create({
    data: {
      username: data.username,
      email: data.email,
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
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}