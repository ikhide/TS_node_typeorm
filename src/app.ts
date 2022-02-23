import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { Routes } from "./routes";
import handleError from "./middlewares/handleError";
import * as morgan from "morgan";
import { validationResult } from "express-validator";

const app = express();

//logging

app.use(morgan("combined"));
app.use(bodyParser.json());

// register express routes from defined application routes
Routes.forEach((route) => {
  (app as any)[route.method](
    route.route,
    ...(route.validation || []),
    async (req: Request, res: Response, next: Function) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const result = await new (route.controller as any)()[route.action](
          req,
          res,
          next
        );

        res.json(result);
      } catch (err) {
        next(err);
      }
    }
  );
});

// Handle errors
app.use(handleError);
export default app;
