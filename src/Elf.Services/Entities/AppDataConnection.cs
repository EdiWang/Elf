using System;
using System.Linq;
using System.Threading.Tasks;
using LinqToDB;
using LinqToDB.Configuration;
using LinqToDB.Data;

namespace Elf.Services.Entities
{
    public partial class AppDataConnection : DataConnection
    {
        public ITable<Link> Link => GetTable<Link>();

        public ITable<LinkTracking> LinkTracking => GetTable<LinkTracking>();

        public AppDataConnection(LinqToDbConnectionOptions<AppDataConnection> options)
            : base(options)
        {
            InitDataContext();
            InitMappingSchema();
        }

        partial void InitDataContext();
        partial void InitMappingSchema();
    }

    public static partial class TableExtensions
    {
        public static Link Find(this ITable<Link> table, int Id)
        {
            return table.FirstOrDefault(t =>
                t.Id == Id);
        }

        public static Task<Link> FindAsync(this ITable<Link> table, int Id)
        {
            return table.FirstOrDefaultAsync(t =>
                t.Id == Id);
        }

        public static LinkTracking Find(this ITable<LinkTracking> table, Guid Id)
        {
            return table.FirstOrDefault(t =>
                t.Id == Id);
        }

        public static Task<LinkTracking> FindAsync(this ITable<LinkTracking> table, Guid Id)
        {
            return table.FirstOrDefaultAsync(t =>
                t.Id == Id);
        }
    }
}
