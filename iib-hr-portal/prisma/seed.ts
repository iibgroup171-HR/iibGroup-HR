import { PrismaClient, Role, LeaveType, LeaveStatus, CaseStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "IIB@2026!";

async function main() {
  console.log("🌱 Seeding iib Group HR Portal database...");

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // ---------- Users (idempotent upserts) ----------
  const admin = await prisma.user.upsert({
    where: { email: "admin@iibanks.com" },
    update: {},
    create: {
      email: "admin@iibanks.com",
      password: passwordHash,
      name: "Alexander Ibrahim",
      role: Role.SUPER_ADMIN,
    },
  });

  const hr = await prisma.user.upsert({
    where: { email: "hr@iibanks.com" },
    update: {},
    create: {
      email: "hr@iibanks.com",
      password: passwordHash,
      name: "Helena Rossi",
      role: Role.HR,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@iibanks.com" },
    update: {},
    create: {
      email: "manager@iibanks.com",
      password: passwordHash,
      name: "Marcus Chen",
      role: Role.MANAGER,
    },
  });

  const employee = await prisma.user.upsert({
    where: { email: "employee@iibanks.com" },
    update: {},
    create: {
      email: "employee@iibanks.com",
      password: passwordHash,
      name: "Emily Novak",
      role: Role.EMPLOYEE,
    },
  });

  console.log(`👤 Users ready: ${[admin.email, hr.email, manager.email, employee.email].join(", ")}`);

  // ---------- Departments ----------
  const deptData = [
    { name: "Corporate Banking", code: "CB" },
    { name: "Retail Operations", code: "RO" },
    { name: "IT & Security", code: "ITS" },
  ];

  const departments: Record<string, string> = {};
  for (const d of deptData) {
    const dept = await prisma.department.upsert({
      where: { code: d.code },
      update: { name: d.name },
      create: d,
    });
    departments[d.code] = dept.id;
  }
  console.log("🏢 Departments ready.");

  // ---------- Employees ----------
  const empManager = await prisma.employee.upsert({
    where: { userId: manager.id },
    update: {},
    create: {
      userId: manager.id,
      employeeNumber: "IIB-0003",
      departmentId: departments["CB"],
      jobTitle: "Regional Banking Manager",
      joiningDate: new Date("2019-03-11T00:00:00Z"),
    },
  });

  const empAdmin = await prisma.employee.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      employeeNumber: "IIB-0001",
      departmentId: departments["CB"],
      jobTitle: "Group Chief Executive",
      joiningDate: new Date("2015-01-05T00:00:00Z"),
    },
  });

  const empHr = await prisma.employee.upsert({
    where: { userId: hr.id },
    update: {},
    create: {
      userId: hr.id,
      employeeNumber: "IIB-0002",
      departmentId: departments["RO"],
      jobTitle: "HR Business Partner",
      joiningDate: new Date("2018-07-02T00:00:00Z"),
    },
  });

  const empEmployee = await prisma.employee.upsert({
    where: { userId: employee.id },
    update: { managerId: empManager.id },
    create: {
      userId: employee.id,
      employeeNumber: "IIB-0004",
      departmentId: departments["ITS"],
      jobTitle: "Systems Analyst",
      joiningDate: new Date("2022-09-19T00:00:00Z"),
      managerId: empManager.id,
    },
  });

  console.log("🧑‍💼 Employees ready (manager@iibanks.com is line manager for employee@iibanks.com).");

  // ---------- Leave Policies ----------
  const annualPolicy = await prisma.leavePolicy.upsert({
    where: { name: "Annual Leave" },
    update: { totalDays: 25, leaveType: LeaveType.ANNUAL, isActive: true },
    create: { name: "Annual Leave", leaveType: LeaveType.ANNUAL, totalDays: 25 },
  });

  const sickPolicy = await prisma.leavePolicy.upsert({
    where: { name: "Sick Leave" },
    update: { totalDays: 12, leaveType: LeaveType.SICK, isActive: true },
    create: { name: "Sick Leave", leaveType: LeaveType.SICK, totalDays: 12 },
  });

  console.log("📜 Leave policies ready.");

  // ---------- Leave Balances (current year, all employees) ----------
  const year = new Date().getFullYear();
  const allEmployees = [empAdmin, empHr, empManager, empEmployee];

  for (const emp of allEmployees) {
    await prisma.leaveBalance.upsert({
      where: {
        employeeId_leavePolicyId_year: {
          employeeId: emp.id,
          leavePolicyId: annualPolicy.id,
          year,
        },
      },
      update: {},
      create: {
        employeeId: emp.id,
        leavePolicyId: annualPolicy.id,
        year,
        totalDays: annualPolicy.totalDays,
        usedDays: 0,
        remainingDays: annualPolicy.totalDays,
      },
    });

    await prisma.leaveBalance.upsert({
      where: {
        employeeId_leavePolicyId_year: {
          employeeId: emp.id,
          leavePolicyId: sickPolicy.id,
          year,
        },
      },
      update: {},
      create: {
        employeeId: emp.id,
        leavePolicyId: sickPolicy.id,
        year,
        totalDays: sickPolicy.totalDays,
        usedDays: 0,
        remainingDays: sickPolicy.totalDays,
      },
    });
  }
  console.log(`💰 Leave balances seeded for ${year}.`);

  // ---------- Holidays (3 upcoming public holidays) ----------
  const now = new Date();
  const holidays = [
    { name: "Founders' Day", offsetDays: 21, isPaid: true },
    { name: "Bank Workers' Unity Day", offsetDays: 55, isPaid: true },
    { name: "Global Markets Holiday", offsetDays: 90, isPaid: true },
  ];

  for (const h of holidays) {
    const date = new Date(now.getTime() + h.offsetDays * 24 * 60 * 60 * 1000);
    date.setUTCHours(0, 0, 0, 0);
    const existing = await prisma.holiday.findFirst({ where: { name: h.name } });
    if (!existing) {
      await prisma.holiday.create({
        data: { name: h.name, date, isPaid: h.isPaid },
      });
    }
  }
  console.log("🎉 Upcoming holidays seeded.");

  // ---------- Leave Requests ----------
  const pendingExists = await prisma.leaveRequest.findFirst({
    where: { employeeId: empEmployee.id, status: LeaveStatus.PENDING },
  });
  if (!pendingExists) {
    const start = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const end = new Date(now.getTime() + 16 * 24 * 60 * 60 * 1000);
    await prisma.leaveRequest.create({
      data: {
        employeeId: empEmployee.id,
        approverId: manager.id,
        leaveType: LeaveType.ANNUAL,
        startDate: start,
        endDate: end,
        totalDays: 3,
        reason: "Family vacation - approved verbally by line manager.",
        status: LeaveStatus.PENDING,
      },
    });
  }

  const approvedExists = await prisma.leaveRequest.findFirst({
    where: { employeeId: empEmployee.id, status: LeaveStatus.APPROVED },
  });
  if (!approvedExists) {
    const start = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);
    const end = new Date(now.getTime() - 44 * 24 * 60 * 60 * 1000);
    await prisma.leaveRequest.create({
      data: {
        employeeId: empEmployee.id,
        approverId: manager.id,
        leaveType: LeaveType.SICK,
        startDate: start,
        endDate: end,
        totalDays: 2,
        reason: "Medical recovery - certificate submitted to HR.",
        status: LeaveStatus.APPROVED,
        approvedAt: new Date(now.getTime() - 47 * 24 * 60 * 60 * 1000),
      },
    });
    // Reflect the approved sick leave in the balance.
    const sickBalance = await prisma.leaveBalance.findUnique({
      where: {
        employeeId_leavePolicyId_year: {
          employeeId: empEmployee.id,
          leavePolicyId: sickPolicy.id,
          year,
        },
      },
    });
    if (sickBalance && sickBalance.usedDays === 0) {
      await prisma.leaveBalance.update({
        where: { id: sickBalance.id },
        data: { usedDays: 2, remainingDays: sickPolicy.totalDays - 2 },
      });
    }
  }
  console.log("🗓️ Leave requests seeded (1 PENDING, 1 APPROVED).");

  // ---------- HR Cases ----------
  const caseExists = await prisma.hRCase.findFirst({ where: { caseNumber: "IIB-HRC-0001" } });
  if (!caseExists) {
    await prisma.hRCase.create({
      data: {
        caseNumber: "IIB-HRC-0001",
        title: "Health insurance plan upgrade",
        description:
          "Employee requested details about the upgraded corporate health insurance coverage for dependents.",
        category: "BENEFITS",
        status: CaseStatus.OPEN,
        priority: "MEDIUM",
        createdById: employee.id,
        assignedToId: hr.id,
        employeeId: empEmployee.id,
      },
    });
  }

  const case2Exists = await prisma.hRCase.findFirst({ where: { caseNumber: "IIB-HRC-0002" } });
  if (!case2Exists) {
    await prisma.hRCase.create({
      data: {
        caseNumber: "IIB-HRC-0002",
        title: "Laptop replacement request",
        description: "Work laptop battery degraded below acceptable threshold. Requesting replacement unit.",
        category: "IT_SUPPORT",
        status: CaseStatus.IN_PROGRESS,
        priority: "HIGH",
        createdById: employee.id,
        assignedToId: admin.id,
        employeeId: empEmployee.id,
      },
    });
  }
  console.log("📂 HR cases seeded.");

  console.log("✅ Seed complete. Demo login password for all accounts: IIB@2026!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
