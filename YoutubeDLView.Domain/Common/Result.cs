namespace YoutubeDLView.Domain.Common
{
    // Class Representing the result of result of an operation
    public class Result
    {
        public bool Success { get; init; }
        public string Error { get; init; }

        public static Result Ok() => new Result() { Success = true };
        public static Result<T> Ok<T>(T data) => new Result<T>() { Success = true, Data = data };
        public static Result Fail(string error) => new Result() { Success = false, Error = error };
        public static Result<T> Fail<T>(string error) => new Result<T>() { Success = false, Error = error };
    }

    public class Result<T> : Result
    {
        public T Data { get; init; }
    }
}