using System;
using System.Data;
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
    }
}
