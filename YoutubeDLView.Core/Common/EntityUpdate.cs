#nullable enable
using System;
using System.Reflection;

namespace YoutubeDLView.Core.Common
{
    public class EntityUpdate<T> where T : new()
    {
        public readonly T EntityChanges;
        
        private readonly Type _entityType;

        public EntityUpdate(object entityChanges)
        {
            // Initialises changes and type objects
            EntityChanges = new T();
            _entityType = typeof(T);
            
            PropertyInfo[] changesPropertyInfos = entityChanges.GetType().GetProperties();
            foreach (PropertyInfo propertyInfo in changesPropertyInfos)
            {
                // Checks property exists on target type, then sets it
                PropertyInfo? entityPropertyInfo = _entityType.GetProperty(propertyInfo.Name);
                if (entityPropertyInfo == null) throw new Exception("Invalid property on entityChanges");
                object? value = propertyInfo.GetValue(entityChanges);
                entityPropertyInfo.SetValue(EntityChanges, value);
            }
        }
        
        // Applies the changes to the given target entity
        public void Apply(T targetEntity, bool updateWithNull = false)
        {
            PropertyInfo[] propertyInfos = _entityType.GetProperties();
            foreach (PropertyInfo propertyInfo in propertyInfos)
            {
                // Checks if the value is null, and sets it if suitable
                object? value = propertyInfo.GetValue(EntityChanges);
                if (value == null && !updateWithNull) continue;
                propertyInfo.SetValue(targetEntity, value);
            }
        }
    }
}