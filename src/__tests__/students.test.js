import request from "supertest";
import handler from "../app/api/students/index";

const mockStudent = {
  fullName: "John Doe",
  phoneNumber: "1234567890",
};

// Mocking the Prisma client
jest.mock("../../lib/prisma", () => ({
  student: {
    findMany: jest.fn().mockResolvedValue([mockStudent]),
    create: jest.fn().mockResolvedValue(mockStudent),
  },
}));

// Helper function to convert handler to a server
const createServer = (handler) => {
  return (req, res) => {
    return new Promise((resolve, reject) => {
      res.on("finish", resolve);
      res.on("end", resolve);
      res.on("error", reject);
      handler(req, res);
    });
  };
};

describe("Students API", () => {
  it("should fetch all students", async () => {
    const res = await request(createServer(handler)).get("/api/students");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([mockStudent]);
  });

  it("should create a new student", async () => {
    const res = await request(createServer(handler))
      .post("/api/students")
      .send(mockStudent);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(mockStudent);
  });
});
