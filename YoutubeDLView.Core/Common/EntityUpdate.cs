#nullable enable
using System;
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
        
        // Applies the changes to the given target entity
        public void Apply(T targetEntity, bool updateWithNull = false)
        {
            // Gets the list of properties to update
            PropertyInfo[] propertyInfos = _entityChanges.GetType().GetProperties();
            Type targetType = typeof(T);
            foreach (PropertyInfo propertyInfo in propertyInfos)
            {
                // Gets the property of the target entity, change checks it exists
                PropertyInfo? targetPropertyInfo = targetType.GetProperty(propertyInfo.Name);
                if (targetPropertyInfo == null)
                    throw new InvalidOperationException("Target entity does not have matching properties");
                
                // Updates the value
                object? value = propertyInfo.GetValue(_entityChanges);
                if (!updateWithNull && value == null) continue;
                targetPropertyInfo.SetValue(targetEntity, value);
            }
        }
    }
}