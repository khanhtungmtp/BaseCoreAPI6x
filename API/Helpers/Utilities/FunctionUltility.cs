
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace API.Helpers.Utilities
{
    public static class FunctionUltility
    {
        public static int CalculateAge(this DateTime theDateTime)
        {
            int age = DateTime.Today.Year - theDateTime.Year;
            if (theDateTime.AddYears(age) > DateTime.Today)
                age--;
            return age;
        }

        public static void AddAplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Aplication-Error", message);
            response.Headers.Add("Access-Control-Expose-Headers", "Aplication-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }

        public static void AddPagination(this HttpResponse response, int pageNumber, int PageSize, int totalItems, int totalPages)
        {
            PaginationHeader paginationHeader = new PaginationHeader(pageNumber, PageSize, totalItems, totalPages);
            JsonSerializerSettings camelCaseFormatter = new JsonSerializerSettings();
            camelCaseFormatter.ContractResolver = new CamelCasePropertyNamesContractResolver();
            response.Headers.Add("Pagination", JsonConvert.SerializeObject(paginationHeader, camelCaseFormatter));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }

    }
}