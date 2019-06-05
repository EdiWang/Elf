using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace LinkForwarder
{
    public static class Utils
    {
        public static string AppVersion =>
            Assembly.GetEntryAssembly().GetCustomAttribute<AssemblyInformationalVersionAttribute>()
                .InformationalVersion;
    }
}