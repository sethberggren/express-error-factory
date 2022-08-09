import { NextFunction, Request, Response } from "express";
import CustomErrorThrower, { ExpressCustomError } from "./CustomErrorThrower";
import { handleCustomError } from "./handleCustomError";

describe("tests for handle custom error middleware", () => {
  const testCustomErrorThrower = new CustomErrorThrower({
    contactError: {
      badInformation: {
        type: "contactError",
        message: "Your information is incorrect, please try again.",
        statusCode: 400,
      },
      notEmail: {
        type: "contactError",
        message: "You did not pass along a valid email.",
        statusCode: 400,
      },
    },
    authenticationError: {
      invalidCredentials: {
        type: "authenticationError",
        message: "Your credentials are invalid.",
        statusCode: 400,
      },
      expiredToken: {
        type: "authenticationError",
        message: "Your session has expired - please log in again.",
        statusCode: 400,
      },
    },
  });

  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn(),
      send: jest.fn(),
    };
  });

  it("should respond with an error if the error of type ExpressCustomError is passed through", () => {
    const customError = new ExpressCustomError(
      testCustomErrorThrower.getErrorResponse("authenticationError")(
        "expiredToken"
      )
    );
    handleCustomError()(
      customError,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toBeCalledWith(customError.statusCode);
    expect(mockResponse.send).toBeCalledWith({
      type: customError.type,
      message: customError.message,
    });
    expect(nextFunction).not.toBeCalled();
  });

  it("should respond with a different error if an error not of the ExpressCustomError class is passed through", () => {
    const notCustomError = new Error(
      "This is not of the ExpressCustomErrorClass!"
    );

    handleCustomError()(
      notCustomError as ExpressCustomError,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toBeCalledWith(500);
    expect(mockResponse.send).toBeCalledWith({
      type: "Unknown Error",
      message: "Sorry, an unkown error has occured.  Please try again.",
    });

    expect(nextFunction).not.toBeCalled();
  });

  it("should respond with an optional custom error message if an error not of the ExpressCustomError class is passed through", () => {
    const notCustomError = new Error(
      "This is not of the ExpressCustomErrorClass!"
    );

    const customErrorMessage = "WHOOPS!";

    handleCustomError(customErrorMessage)(
      notCustomError as ExpressCustomError,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toBeCalledWith(500);
    expect(mockResponse.send).toBeCalledWith({
      type: "Unknown Error",
      message: customErrorMessage,
    });
    expect(nextFunction).not.toBeCalled();
  });
});
