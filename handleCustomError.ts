import { Request, Response, NextFunction } from "express";
import { ExpressCustomError } from ".";

export function handleCustomError(unknownErrorMessage?: string) {
  const defaultErrorMessage =
    "Sorry, an unkown error has occured.  Please try again.";

  return (
    err: ExpressCustomError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!(err instanceof ExpressCustomError)) {
      const errorResponse = {
        type: "Unknown Error",
        message: unknownErrorMessage
          ? unknownErrorMessage
          : defaultErrorMessage,
      };

      res.status(500)
      res.send(errorResponse);
    }

    res.status(err.statusCode);
    res.send({ type: err.type, message: err.message });
  };
}

