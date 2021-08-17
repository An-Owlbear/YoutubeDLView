using Microsoft.AspNetCore.Mvc;
using YoutubeDLView.Core.Common;

namespace YoutubeDLView.API
{
    public class ApiController : ControllerBase
    {
        protected ActionResult FromResult(Result result) =>
            result switch
            {
                { Success: true } => Ok(),
                { Success: false, StatusCode: null } => BadRequest(result.Error),
                _ => StatusCode((int)result.StatusCode, result.Error)
            };
    }
}