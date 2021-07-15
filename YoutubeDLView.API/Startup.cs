using System;
using System.IO;
using System.Reflection;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using YoutubeDLView.API.Auth;
using YoutubeDLView.API.Services;
using YoutubeDLView.Core.Common;
using YoutubeDLView.Core.Interfaces;
using YoutubeDLView.Core.Services;
using YoutubeDLView.Data.Extensions;

namespace YoutubeDLView.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "YoutubeDLView.API", Version = "v1" });
                c.AddSecurityDefinition("JWT Authorization", new OpenApiSecurityScheme()
                {
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer"
                });
                c.OperationFilter<SecurityRequirementsOperationFilter>(true, "JWT Authorization");
                
                string xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                string xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);
            });
            
            services.AddAuthentication("JwtAuthScheme")
                .AddScheme<AuthenticationSchemeOptions, JwtAuthHandler>("JwtAuthScheme", _ => { });
            services.AddAuthorization();
            
            services.Configure<YoutubeDLViewConfig>(Configuration.GetSection("YoutubeDLViewConfig"));

            services.AddYoutubeDLViewDb();
            services.AddUserManager();
            services.AddSingleton<IRandomGenerator, RandomGenerator>();
            services.AddScoped<IJwtTokenHandler, JwtTokenHandler>();
            services.AddScoped<IAuthorizationHandler, RoleAuthorizationHandler>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IYoutubeDLViewDb dbContext)
        {
            dbContext.Database.Migrate();
            
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "YoutubeDLView.API v1"));
            }

            app.UsePathBase("/api");
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}