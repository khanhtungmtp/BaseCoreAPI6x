
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
            IHeaderDictionary headers = response.Headers;
            headers.Append("Aplication-Error", message);
            headers.Append("Access-Control-Expose-Headers", "Aplication-Error");
            headers.Append("Access-Control-Allow-Origin", "*");
        }

        public static void AddPagination(this HttpResponse response, int pageNumber, int PageSize, int totalItems, int totalPages)
        {
            IHeaderDictionary headers = response.Headers;
            PaginationHeader paginationHeader = new(pageNumber, PageSize, totalItems, totalPages);
            JsonSerializerSettings camelCaseFormatter = new(){
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };
             headers.Append("Pagination", JsonConvert.SerializeObject(paginationHeader, camelCaseFormatter));
             headers.Append("Access-Control-Expose-Headers", "Pagination");
        }

        //https://stackoverflow.com/questions/7726714/trim-all-string-properties
        public static TSelf TrimStringProperties<TSelf>(this TSelf input)
        {
            var stringProperties = input.GetType().GetProperties()
                .Where(p => p.PropertyType == typeof(string));

            foreach (var stringProperty in stringProperties)
            {
                string currentValue = (string)stringProperty.GetValue(input, null);
                if (currentValue != null)
                    stringProperty.SetValue(input, currentValue.Trim(), null);
            }
            return input;
        }

    }
}