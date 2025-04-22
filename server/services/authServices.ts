import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;


export const signup = async ({
  name,
  email,
  password,
  role,
  managerId,
  mobileNo,
  address,
  ratePerDay,
  validity,
  companyName,
}: {
  name: string;
  email: string;
  password: string;
  role: "employee" | "manager" | "customer";
  managerId?: number;
  mobileNo?: string;
  address?: string;
  ratePerDay?: number;
  validity?: number;
  companyName?: string;
}) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("User already exists");

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role },
  });

  if (role === "employee") {
    if (!managerId) throw new Error("Manager ID required for employee");
  
    await prisma.employee.create({
      data: {
        userId: user.userId,  // The user ID associated with the employee
        managerId,  // The manager ID associated with this employee
        name,  // The employee's name
        email,  // The employee's email address
        mobileNo: Number(mobileNo),  // Convert mobileNo to a number
      },
    });
  }
  else if (role === "manager") {
    // Check if all required fields are provided
    if (!mobileNo || !companyName) {
      throw new Error("Missing required fields for manager");
    }
  
    // Log the data for debugging
    console.log("Creating manager with the following data:", {
      userId: user.userId,
      managerName: name,
      email,
      mobileNo: Number(mobileNo),
      ratePerDay,
      validity: new Date(),
      companyName,
    });
  
    // Create manager in the database
    await prisma.manager.create({
      data: {
        userId: user.userId,
        managerName: name,
        email,
        mobileNo: Number(mobileNo),
        ratePerDay: 0,  // Default value for ratePerDay (can be updated as needed)
        validity: new Date(),  // Current date and time for validity
        companyName,
      },
    });
  }else if (role === "customer") {
    if (!mobileNo || !address)
      throw new Error("Missing required fields for customer");
    await prisma.customer.create({
      data: {
        userId: user.userId,
        name,
        email,
        mobileNo : Number(mobileNo),
        address,
      },
    });
  }

  return {
    message: "User created",
    user: { id: user.userId, email: user.email, role: user.role },
  };
};


export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: "1d" });
  return { token };
};

export const forgotPassword = async ({ email, newPassword }: { email: string; newPassword: string }) => {
  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password and set loggedIn to false
  await prisma.user.update({
    where: { userId: user.userId },
    data: { password: hashedPassword, loggedIn: false },
  });

  return { message: "Password updated successfully" };
};
