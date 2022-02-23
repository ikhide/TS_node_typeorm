import { UserController } from "./controller/UserController";
import { body, param } from "express-validator";
export const Routes = [
  {
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all",
    validation: [],
  },
  {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one",
    validation: [param("id", "id must be an integer").isInt()],
  },
  {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save",
    validation: [
      body("firstName", "firstName must be a string").isString(),
      body("lastName", "lastName must be a string").isString(),
      body("age", "age must be an integer").isInt({ min: 0 }),
    ],
  },
  {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove",
    validation: [param("id", "id must be an integer").isInt()],
  },
];
