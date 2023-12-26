using System.Security.Claims;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace API.Helpers.Utilities;
public static class UserUtilities
{
    public static void QuickLog(string text, string logPath)
    {
        var dirPath = Path.GetDirectoryName(logPath);

        if (!Directory.Exists(dirPath))
            Directory.CreateDirectory(dirPath);

        using var writer = File.AppendText(logPath);
        writer.WriteLine($"{DateTime.Now} - {text}");
    }

    public static string GetUserId(ClaimsPrincipal user)
    {
        return user.FindFirstValue(Claims.Subject)?.Trim();
    }

    public static string[] GetRoles(ClaimsPrincipal user)
    {
        return user.Claims
            .Where(c => c.Type == Claims.Role)
            .Select(c => c.Value)
            .ToArray();
    }
}
