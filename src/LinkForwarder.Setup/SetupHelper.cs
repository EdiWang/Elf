using System;
using System.Data.SqlClient;
using System.IO;
using System.Reflection;
using Dapper;
using Edi.Practice.RequestResponseModel;

namespace LinkForwarder.Setup
{
    public class SetupHelper
    {
        public string DatabaseConnectionString { get; set; }

        public SetupHelper(string databaseConnectionString)
        {
            if (string.IsNullOrWhiteSpace(databaseConnectionString))
            {
                throw new ArgumentNullException(nameof(databaseConnectionString));
            }

            DatabaseConnectionString = databaseConnectionString;
        }

        public bool IsFirstRun()
        {
            using (var conn = new SqlConnection(DatabaseConnectionString))
            {
                var tableExists = conn.ExecuteScalar<int>("SELECT TOP 1 1 " +
                                                          "FROM INFORMATION_SCHEMA.TABLES " +
                                                          "WHERE TABLE_NAME = N'Link'") == 1;
                return !tableExists;
            }
        }

        public bool TestDatabaseConnection(Action<Exception> errorLogAction = null)
        {
            try
            {
                using (var conn = new SqlConnection(DatabaseConnectionString))
                {
                    int result = conn.ExecuteScalar<int>("SELECT 1");
                    return result == 1;
                }
            }
            catch (Exception e)
            {
                errorLogAction?.Invoke(e);
                return false;
            }
        }

        public Response SetupDatabase()
        {
            try
            {
                using (var conn = new SqlConnection(DatabaseConnectionString))
                {
                    var sql = GetEmbeddedSqlScript("schema-mssql-140");
                    if (!string.IsNullOrWhiteSpace(sql))
                    {
                        conn.Execute(sql);
                        return new SuccessResponse();
                    }
                    return new FailedResponse("Database Schema Script is empty.");
                }
            }
            catch (Exception e)
            {
                return new FailedResponse(e.Message);
            }
        }

        private static string GetEmbeddedSqlScript(string scriptName)
        {
            var assembly = typeof(SetupHelper).GetTypeInfo().Assembly;
            using (var stream = assembly.GetManifestResourceStream($"LinkForwarder.Setup.Data.{scriptName}.sql"))
            {
                if (stream == null) return null;
                using (var reader = new StreamReader(stream))
                {
                    var sql = reader.ReadToEnd();
                    return sql;
                }
            }
        }
    }
}
