using System;
using System.Data;
using System.IO;
using System.Reflection;
using Dapper;

namespace Elf.Setup
{
    public class SetupHelper
    {
        private readonly IDbConnection conn;

        public SetupHelper(IDbConnection dbConnection)
        {
            conn = dbConnection;
        }

        public bool IsFirstRun()
        {
            var tableExists = conn.ExecuteScalar<int>("SELECT TOP 1 1 " +
                                "FROM INFORMATION_SCHEMA.TABLES " +
                                "WHERE TABLE_NAME = N'Link'") == 1;
            return !tableExists;
        }

        public bool TestDatabaseConnection(Action<Exception> errorLogAction = null)
        {
            try
            {
                int result = conn.ExecuteScalar<int>("SELECT 1");
                return result == 1;
            }
            catch (Exception e)
            {
                errorLogAction?.Invoke(e);
                return false;
            }
        }

        public void SetupDatabase()
        {
            var sql = GetEmbeddedSqlScript("schema-mssql-140");
            if (!string.IsNullOrWhiteSpace(sql))
            {
                conn.Execute(sql);
            }
        }

        private static string GetEmbeddedSqlScript(string scriptName)
        {
            var assembly = typeof(SetupHelper).GetTypeInfo().Assembly;
            using var stream = assembly.GetManifestResourceStream($"Elf.Setup.Data.{scriptName}.sql");
            using var reader = new StreamReader(stream);
            var sql = reader.ReadToEnd();
            return sql;
        }
    }
}
