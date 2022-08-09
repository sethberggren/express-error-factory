import CustomErrorThrower, { ExpressCustomError } from ".";

describe("tests of the CustomErrorThrower class", () => {
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

  it("should throw the correct error response", () => {
    expect(() =>
      testCustomErrorThrower.throwCustomError("authenticationError")(
        "expiredToken"
      )
    ).toThrowError(
      new ExpressCustomError(
        testCustomErrorThrower.getErrorResponse("authenticationError")(
          "expiredToken"
        )
      )
    );

    expect(() =>
      testCustomErrorThrower.throwCustomError("contactError")("notEmail")
    ).toThrowError(
      new ExpressCustomError(
        testCustomErrorThrower.getErrorResponse("contactError")("notEmail")
      )
    );
  });
});
