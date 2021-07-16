using System.Reflection;

namespace YoutubeDLView.Core.Common
{
    public class EntityUpdate<T>
    {
        private readonly object _entityChanges;

        public EntityUpdate(object entityChanges)
        {
            _entityChanges = entityChanges;
        }
        
        public void Apply(T targetEntity)
        {
            PropertyInfo[] properties = typeof(T).GetProperties();
            foreach (PropertyInfo property in properties)
            {
                object? value = property.GetValue(_entityChanges);
                if (value == null) continue;
                property.SetValue(targetEntity, value);
            }
        }
    }
}