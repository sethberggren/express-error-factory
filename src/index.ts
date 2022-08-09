type StringOnlyObject = { [key in string]: string };

type ErrorResponse<K extends string> = {
  type: K;
  statusCode: number;
  message: string;
};

type ErrorResponses<ErrorTypes extends StringOnlyObject> = {
  [ErrorType in keyof ErrorTypes]: {
    [ErrorSubtype in ErrorTypes[ErrorType]]: ErrorType extends string
      ? ErrorResponse<ErrorType>
      : never;
  };
};

/**
 * Custom error class to be used by the CustomErrorThrower class.
 * @extends Error
 */
export class ExpressCustomError extends Error {
  /**
   * Custom error class.  Will rarely be called itself, but is called by the CustomErrorThrower class.
   *
   * @param type Error type to be returned in response
   * @param statusCode Error status code to be returned in response
   * @param message Error message to be returned in response
   */
  type: string;
  statusCode: number;
  message: string;

  constructor(errorDetails: {
    type: string;
    statusCode: number;
    message: string;
  }) {
    super();

    const { type, statusCode, message } = errorDetails;

    this.type = type;
    this.statusCode = statusCode;
    this.message = message;
  }
}

/**
 * Class to generate and throw custom errors.
 */
export default class CustomErrorThrower<
  UserErrorResponses extends ErrorResponses<StringOnlyObject>
> {
  private errorResponses: UserErrorResponses;

  /**
   *
   * @param errorResponses Object containing all error types and error subtypes with their corresponding messages as nested objects.
   */
  constructor(errorResponses: UserErrorResponses) {
    this.errorResponses = errorResponses;
  }

  /**
   *
   * @param type Error type
   * @returns Function that takes in error subtype and returns the error type, status code, and message.
   */
  public getErrorResponse =
    <Type extends keyof UserErrorResponses>(type: Type) =>
    /**
     *
     * @param subtype Error subtype
     * @returns Object including error type, status code, and message.
     */
    <Subtype extends keyof UserErrorResponses[Type]>(subtype: Subtype) =>
      this.errorResponses[type][subtype];

  /**
   *
   * @param type Error type
   * @returns Function that takes in error subtype and throws new error.
   */
  public throwCustomError =
    <Type extends keyof UserErrorResponses>(type: Type) =>
    /**
     *
     * @param subtype Error subtype
     */
    <Subtype extends keyof UserErrorResponses[Type]>(subtype: Subtype) => {
      const errorResponse = this.getErrorResponse(type)(subtype);

      throw new ExpressCustomError(errorResponse);
    };
}
