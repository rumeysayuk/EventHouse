// tests/authService.test.js
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../../src/models/User");
const Role = require("../../src/models/Role");
const authService = require("../../src/services/authService");

jest.mock("../../src/utils/hashPassword", () => ({
  hashPassword: jest.fn().mockResolvedValue("hashedPassword"),
  comparePassword: jest.fn().mockResolvedValue(true),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("token"),
}));

describe("authService", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Role.deleteMany({});
  });

  describe("register", () => {
    it("should register a new user with default role", async () => {
      const defaultRole = new Role({ name: "user" });
      await defaultRole.save();

      const userData = {
        userName: "testUser",
        firstName: "John",
        lastName: "Doe",
        password: "password123",
        country: "USA",
        city: "New York",
      };

      const user = await authService.register(userData);

      expect(user).toBeTruthy();
      expect(user.userName).toBe(userData.userName);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.country).toBe(userData.country);
      expect(user.city).toBe(userData.city);
      expect(user.password).toBe("hashedPassword");
      expect(user.roles).toContainEqual(defaultRole._id);
    });
  });

  describe("login", () => {
    it("should return a token for valid user credentials", async () => {
      const role = new Role({ name: "user" });
      await role.save();

      const user = new User({
        userName: "testUser",
        firstName: "John",
        lastName: "Doe",
        password: "hashedPassword",
        country: "USA",
        city: "New York",
        roles: [role._id],
      });
      await user.save();

      const loginData = { userName: "testUser", password: "password123" };
      const token = await authService.login(loginData);

      expect(token).toBe("token");
    });

    it("should throw an error for invalid user credentials", async () => {
      const loginData = { userName: "invalidUser", password: "password123" };

      await expect(authService.login(loginData)).rejects.toThrow(
        "Invalid username or password"
      );
    });
  });
});
