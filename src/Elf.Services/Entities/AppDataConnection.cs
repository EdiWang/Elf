using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LinqToDB;
using LinqToDB.Configuration;
using LinqToDB.Data;

namespace Elf.Services.Entities
{
    public class AppDataConnection : DataConnection
    {
        public ITable<Link> Link => GetTable<Link>();

        public ITable<LinkTracking> LinkTracking => GetTable<LinkTracking>();

        public AppDataConnection(LinqToDbConnectionOptions<AppDataConnection> options)
            : base(options)
        {
            
        }
    }
}
