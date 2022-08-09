import { Request, Response, NextFunction } from "express";
import { ExpressCustomError } from "./CustomErrorThrower";

/**
 * Returns Express middleware to handle errors.
 *
 * @param unknownErrorMessage An optional parameter to name the error message returned for errors not of the ExpressCustomError class.
 * @returns Express middleware to handle errors.  Make sure to use as the last middleware.
 */
export function handleCustomError(unknownErrorMessage?: string) {
  const defaultErrorMessage =
    "Sorry, an unkown error has occured.  Please try again.";

  /**
   *
   * Express middleware to handle ExpressCustomError errors.
   *
   * @param err ExpressCustomError generated by your app
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express Next function
   *
   * @returns void
   */
  return function customErrorMiddleware(
    err: ExpressCustomError,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!(err instanceof ExpressCustomError)) {
      const errorResponse = {
        type: "Unknown Error",
        message: unknownErrorMessage
          ? unknownErrorMessage
          : defaultErrorMessage,
      };

      res.status(500);
      res.send(errorResponse);
    }

    res.status(err.statusCode);
    res.send({ type: err.type, message: err.message });
  };
}
