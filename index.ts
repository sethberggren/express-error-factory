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

export class ExpressCustomError extends Error {
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

export default class CustomErrorThrower<
  UserErrorResponses extends ErrorResponses<StringOnlyObject>
> {
  private errorResponses: UserErrorResponses;

  constructor(errorResponses: UserErrorResponses) {
    this.errorResponses = errorResponses;
  }

  public getErrorResponse =
    <Type extends keyof UserErrorResponses>(type: Type) =>
    <Subtype extends keyof UserErrorResponses[Type]>(subtype: Subtype) =>
      this.errorResponses[type][subtype];

  public throwCustomError =
    <Type extends keyof UserErrorResponses>(type: Type) =>
    <Subtype extends keyof UserErrorResponses[Type]>(subtype: Subtype) => {
      const errorResponse = this.getErrorResponse(type)(subtype);

      throw new ExpressCustomError(errorResponse);
    };
}