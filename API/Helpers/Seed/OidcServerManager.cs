using OpenIddict.Abstractions;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace API.Helpers.Seed;
public class OidcServerManager
    {
        public const string ApiFriendlyName = "Basecore API";
        public const string BasecoreClientID = "basecore_spa";
        public const string SwaggerClientID = "swagger_ui";

        public static async Task RegisterApplicationsAsync(IServiceProvider provider)
        {
            var manager = provider.GetRequiredService<IOpenIddictApplicationManager>();

            // Angular SPA Client
            if (await manager.FindByClientIdAsync(BasecoreClientID) is null)
            {
            _ = await manager.CreateAsync(new OpenIddictApplicationDescriptor
            {
                ClientId = BasecoreClientID,
                ClientType = ClientTypes.Public,
                DisplayName = "Basecore SPA",
                Permissions =
                    {
                        Permissions.Endpoints.Token,
                        Permissions.GrantTypes.Password,
                        Permissions.GrantTypes.RefreshToken,
                        Permissions.Scopes.Profile,
                        Permissions.Scopes.Email,
                        Permissions.Scopes.Phone,
                        Permissions.Scopes.Address,
                        Permissions.Scopes.Roles
                    }
            });
            }

            // Swagger UI Client
            if (await manager.FindByClientIdAsync(SwaggerClientID) is null)
            {
            _ = await manager.CreateAsync(new OpenIddictApplicationDescriptor
            {
                ClientId = SwaggerClientID,
                ClientType = ClientTypes.Public,
                DisplayName = "Swagger UI",
                Permissions =
                    {
                        Permissions.Endpoints.Token,
                        Permissions.GrantTypes.Password
                    }
            });
            }
        }
    }
