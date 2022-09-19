using API.Configurations;
using API.Helpers.Utilities;

var builder = WebApplication.CreateBuilder(args);
// add databaseconfig
builder.Services.AddDatabaseConfig(builder.Configuration);
// add cors
builder.Services.AddCors();
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// RepositoryAccessor and Service
builder.Services.AddDependencyInjectionConfig();
// add auth
builder.Services.AddAuthenticationConfig(builder.Configuration);
// add middleware error global
builder.Services.AddTransient<ExceptionHandlingMiddleware>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
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
