import "dotenv/config";
import express, {
  Application,
  NextFunction,
  Request,
  Response,
} from "express";
import morgan from "morgan";

import { HTTP_STATUS, RESPONSE_MESSAGES } from "./constants";
import routes from "./routes";
import database from "./database";

const app: Application = express();
const { PORT = 3000, NODE_ENV } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use('/api/v1', routes);
app.use('/status', (req, res) => res.status(HTTP_STATUS.OK).json({
  message: 'OK'
}));
app.use('*', (req, res) => res.status(HTTP_STATUS.NOT_FOUND).json({
  message: 'unexisting path'
}))

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  console.log(error)
  const isDev = NODE_ENV === "development";
  return res.status(HTTP_STATUS.SERVER_ERROR).json({
    message: error.message as string || RESPONSE_MESSAGES.SOMETHING_WRONG,
    error: isDev ? error : undefined,
  });
});

app.listen(PORT, () => {
  database().then(() => {
    console.log(`App started listening on port ${PORT}`);
  }).catch(() => {
    console.log('Database connection failed!')
  })
});
