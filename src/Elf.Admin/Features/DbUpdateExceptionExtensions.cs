using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Elf.Admin.Features;

internal static class DbUpdateExceptionExtensions
{
    public static bool IsUniqueConstraintViolation(this DbUpdateException exception)
    {
        var currentException = exception.InnerException;
        while (currentException is not null)
        {
            if (currentException is SqlException sqlException &&
                sqlException.Errors.Cast<SqlError>().Any(error => error.Number is 2601 or 2627))
            {
                return true;
            }

            currentException = currentException.InnerException;
        }

        return false;
    }
}
