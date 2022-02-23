import { createConnection } from "typeorm";
import app from "../../src/app";
import { port } from "../../src/config";
import * as request from "supertest";
const testUser = {
  firstName: "Goodness",
  lastName: "Irononse",
  age: 20,
};
let connection, server;
beforeEach(async () => {
  connection = await createConnection();
  await connection.synchronize(true);
  server = app.listen(port);
});

afterEach(async () => {
  connection.close();
  server.close();
});

it("should be no users initially", async () => {
  const response = await request(server).get("/users");
  expect(response.status).toBe(200);
  expect(response.body).toEqual([]);
});

it("should create a user", async () => {
  const response = await request(server).post("/users").send(testUser);
  expect(response.status).toBe(200);
  expect(response.body.id).toEqual(1);
});

it("should not create a user if no first name", async () => {
  const response = await request(server).post("/users").send({
    lastName: "Irononse",
    age: 20,
  });
  expect(response.status).toBe(400);
  expect(response.body.errors.length).toEqual(1);
  expect(response.body.errors[0].msg).toEqual("firstName must be a string");
});
