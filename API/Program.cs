using System.Net;
using API.Configurations;
using API.Helpers.Utilities;
using Microsoft.AspNetCore.Diagnostics;

var builder = WebApplication.CreateBuilder(args);
// add databaseconfig
builder.Services.AddDatabaseConfig(builder.Configuration);
// add cors
builder.Services.AddCors();
// Add services to the container

// Add Automapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
// add Swapger config with jwt
builder.Services.AddSwaggerGenConfiguration();
// RepositoryAccessor and Service
builder.Services.AddDependencyInjectionConfig();
// add auth
builder.Services.AddAuthenticationConfig(builder.Configuration);
// add logUserActivity custom user
builder.Services.AddScoped<LogUserActivity>();
// add middleware error global
builder.Services.AddTransient<ExceptionHandlingMiddleware>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    // add header application error
    app.UseExceptionHandler(builder =>
    {
        builder.Run(async context =>
        {
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            var error = context.Features.Get<IExceptionHandlerFeature>();
            if (error != null)
            {
                context.Response.AddAplicationError(error.Error.Message);
                await context.Response.WriteAsync(error.Error.Message);
            }
        });
    });
}

// use cors allow
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
// middleware global
app.UseMiddleware<ExceptionHandlingMiddleware>();
// use auth
app.UseAuthentication();
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
