// Represents the result of an operation, indicating whether or not it was successful
class Result<T> {
  constructor(errorValue: string, dataValue?: T) {
    this.data = dataValue;
    this.error = errorValue;
    this.success = !this.error;
  }

  data?: T;
  error: string;
  success: boolean;

  public static ok = <T>(data?: T): Result<T> => new Result('', data);

  public static failure = <T>(error: string): Result<T> => new Result(error);
}

export default Result;