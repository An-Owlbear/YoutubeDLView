using System;
using System.Threading.Tasks;

namespace YoutubeDLView.Core.Common
{
    // Class Representing the result of result of an operation
    public class Result
    {
        public bool Success { get; init; }
        public string Error { get; init; }
        public int? StatusCode { get; set; }

        public static Result Ok() => new() { Success = true };
        public static Result<T> Ok<T>(T data) => new() { Success = true, Data = data };

        public static Result Fail(string error, int? code = null) =>
            new() { Success = false, Error = error, StatusCode = code };

        public static Result<T> Fail<T>(string error, int? code = null) => new()
            { Success = false, Error = error, StatusCode = code };

        public static Result<T> Fail<T>(Result result)
        {
            if (!result.Success)
                throw new InvalidOperationException("Cannot use successful result to create a failure result");
            return Fail<T>(result.Error, result.StatusCode);
        }
    }

    public class Result<T> : Result
    {
        public T Data { get; init; }
    }
}