using System;
using System.Collections.Generic;
using System.Linq;

namespace YoutubeDLView.Core.Common
{
    public static class ListUtils
    {
        public static bool RemoveFirst<T>(this IList<T> list, Func<T, bool> predicate) =>
            list.Remove(list.FirstOrDefault(predicate));
    }
}