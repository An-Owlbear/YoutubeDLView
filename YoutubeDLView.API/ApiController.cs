using Microsoft.AspNetCore.Mvc;
using YoutubeDLView.Core.Common;

namespace YoutubeDLView.API
{
    public class ApiController : ControllerBase
    {
        protected IActionResult FromResult(Result result) =>
            result.StatusCode switch
            {
                >= 200 and <= 299 => Ok(),
                null => BadRequest(result.Error),
                _ => StatusCode((int)result.StatusCode, result.Error)
            };
    }
}