using System.Net;
using API.Configurations;
using API.Helpers.Utilities;
using Microsoft.AspNetCore.Diagnostics;
using System.Text.Json.Serialization;
using API.SignalR;
using API.Helpers.Seed;
using API.Data;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using API.Models;
using Microsoft.AspNetCore.Identity;
using static OpenIddict.Abstractions.OpenIddictConstants;
using OpenIddict.Validation.AspNetCore;
using Quartz;
using API.Helpers.Authorization;
using API.Helpers.Constant;
using AppPermissions = API.Helpers.Authorization.ApplicationPermissions;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authorization;
namespace API;
public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        AddServices(builder);// Add services to the container.

        var app = builder.Build();
        ConfigureRequestPipeline(app); // Configure the HTTP request pipeline.

        await SeedDatabase(app); //Seed initial database

        await app.RunAsync();
    }

    private static void AddServices(WebApplicationBuilder builder)
    {
        // add AddSignalR
        builder.Services.AddSignalR();
        // add databaseconfig
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ??
                            throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        var migrationsAssembly = typeof(Program).GetTypeInfo().Assembly.GetName().Name; //Basecore

        builder.Services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseSqlServer(connectionString, b => b.MigrationsAssembly(migrationsAssembly)).UseLoggerFactory(LoggerFactory.Create(builder => builder.AddConsole()));
            options.UseOpenIddict();
        });

        // add identity
        builder.Services.AddIdentity<ApplicationUser, ApplicationRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        // Configure Identity options and password complexity here
        builder.Services.Configure<IdentityOptions>(options =>
        {
            // User settings
            options.User.RequireUniqueEmail = true;

            //// Password settings
            //options.Password.RequireDigit = true;
            //options.Password.RequiredLength = 8;
            //options.Password.RequireNonAlphanumeric = false;
            //options.Password.RequireUppercase = true;
            //options.Password.RequireLowercase = false;

            //// Lockout settings
            //options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
            //options.Lockout.MaxFailedAccessAttempts = 10;

            // Configure Identity to use the same JWT claims as OpenIddict
            options.ClaimsIdentity.UserNameClaimType = Claims.Name;
            options.ClaimsIdentity.UserIdClaimType = Claims.Subject;
            options.ClaimsIdentity.RoleClaimType = Claims.Role;
            options.ClaimsIdentity.EmailClaimType = Claims.Email;
        });

        // Configure OpenIddict periodic pruning of orphaned authorizations/tokens from the database.
        builder.Services.AddQuartz(options =>
        {
            options.UseSimpleTypeLoader();
            options.UseInMemoryStore();
        });

        // Register the Quartz.NET service and configure it to block shutdown until jobs are complete.
        builder.Services.AddQuartzHostedService(options => options.WaitForJobsToComplete = true);

        builder.Services.AddOpenIddict()
            .AddCore(options =>
            {
                options.UseEntityFrameworkCore()
                       .UseDbContext<ApplicationDbContext>();

                options.UseQuartz();
            })
            .AddServer(options =>
            {
                options.SetTokenEndpointUris("connect/token");

                options.AllowPasswordFlow()
                       .AllowRefreshTokenFlow();

                options.RegisterScopes(
                    Scopes.Profile,
                    Scopes.Email,
                    Scopes.Address,
                    Scopes.Phone,
                    Scopes.Roles);

                // For persisted keys see https://documentation.openiddict.com/configuration/encryption-and-signing-credentials.html
                options.AddEphemeralEncryptionKey()
                       .AddEphemeralSigningKey();

                options.UseAspNetCore()
                       .EnableTokenEndpointPassthrough();
            })
            .AddValidation(options =>
            {
                options.UseLocalServer();
                options.UseAspNetCore();
            });

        builder.Services.AddAuthentication(o =>
        {
            o.DefaultScheme = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme;
            o.DefaultAuthenticateScheme = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme;
            o.DefaultChallengeScheme = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme;
        });

        builder.Services.AddAuthorizationBuilder()
            .AddPolicy(Policies.ViewAllUsersPolicy, policy => policy.RequireClaim(ClaimConstants.Permission, AppPermissions.ViewUsers))
            .AddPolicy(Policies.ManageAllUsersPolicy, policy => policy.RequireClaim(ClaimConstants.Permission, AppPermissions.ManageUsers))
            .AddPolicy(Policies.ViewAllRolesPolicy, policy => policy.RequireClaim(ClaimConstants.Permission, AppPermissions.ViewRoles))
            .AddPolicy(Policies.ViewRoleByRoleNamePolicy, policy => policy.Requirements.Add(new ViewRoleAuthorizationRequirement()))
            .AddPolicy(Policies.ManageAllRolesPolicy, policy => policy.RequireClaim(ClaimConstants.Permission, AppPermissions.ManageRoles))
            .AddPolicy(Policies.AssignAllowedRolesPolicy, policy => policy.Requirements.Add(new AssignRolesAuthorizationRequirement()));

        // add cors
        builder.Services.AddCors(opt => opt.AddDefaultPolicy(p => p.WithOrigins("http://localhost:4200", "https://localhost:4200")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()));

        builder.Services.AddControllersWithViews();
       
        builder.Services.AddSwaggerGen(c =>
           {
               c.SwaggerDoc("v1", new OpenApiInfo { Title = OidcServerManager.ApiFriendlyName, Version = "v1" });
               c.OperationFilter<AuthorizeCheckOperationFilter>();
               c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
               {
                   Type = SecuritySchemeType.OAuth2,
                   Flows = new OpenApiOAuthFlows
                   {
                       Password = new OpenApiOAuthFlow
                       {
                           TokenUrl = new Uri("/connect/token", UriKind.Relative)
                       }
                   }
               });
           });
        // Add Automapper
        builder.Services.AddAutoMapper(typeof(Program));

        // Configurations
        builder.Services.Configure<AppSettings>(builder.Configuration);
        // Auth Handlers
        builder.Services.AddSingleton<IAuthorizationHandler, ViewUserAuthorizationHandler>();
        builder.Services.AddSingleton<IAuthorizationHandler, ManageUserAuthorizationHandler>();
        builder.Services.AddSingleton<IAuthorizationHandler, ViewRoleAuthorizationHandler>();
        builder.Services.AddSingleton<IAuthorizationHandler, AssignRolesAuthorizationHandler>();

        // DB Creation and Seeding
        builder.Services.AddTransient<IDatabaseInitializer, DatabaseInitializer>();

        //File Logger
        builder.Logging.AddFile(builder.Configuration.GetSection("Logging"));

        //Email Templates
        // EmailTemplates.Initialize(builder.Environment);
        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
       
        // RepositoryAccessor and Service
        builder.Services.AddDependencyInjectionConfiguration(typeof(Program));
        builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        // add auth
      //  builder.Services.AddAuthenticationConfig(builder.Configuration);
        // add middleware error global
        builder.Services.AddTransient<ExceptionHandlingMiddleware>();
        // add config json 
        builder.Services.AddControllers().AddJsonOptions(x =>
                        x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
    }

    public static void ConfigureRequestPipeline(WebApplication app)
    {
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
                    IExceptionHandlerFeature error = context.Features.Get<IExceptionHandlerFeature>();
                    if (error != null)
                    {
                        context.Response.AddAplicationError(error.Error.Message);
                        await context.Response.WriteAsync(error.Error.Message);
                    }
                });
            });
        }

        // use cors allow
        app.UseCors(o => o
                      .SetIsOriginAllowed(_ => true)
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials());
        // middleware global
        app.UseMiddleware<ExceptionHandlingMiddleware>();
        // use auth
        app.UseAuthentication();
        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseRouting();
        app.UseAuthorization();

        app.MapControllers();
        app.MapHub<PresenceHub>("hubs/presense");
        app.MapControllerRoute(
            name: "default",
            pattern: "{controller}/{action=Index}/{id?}");

        app.MapFallbackToFile("index.html");
        app.Run();

    }

    private static async Task SeedDatabase(WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        try
        {
            var databaseInitializer = scope.ServiceProvider.GetRequiredService<IDatabaseInitializer>();
            await databaseInitializer.SeedAsync();

            await OidcServerManager.RegisterApplicationsAsync(scope.ServiceProvider);
        }
        catch (Exception ex)
        {
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            logger.LogCritical(LoggingEvents.INIT_DATABASE, ex, LoggingEvents.INIT_DATABASE.Name);

            throw new Exception(LoggingEvents.INIT_DATABASE.Name, ex);
        }
    }
}