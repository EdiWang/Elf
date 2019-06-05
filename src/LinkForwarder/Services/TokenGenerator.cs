using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LinkForwarder.Services
{
    public interface ITokenGenerator
    {
        string GenerateToken();

        bool TryParseToken(string input, out string token);
    }

    public class ShortGuidTokenGenerator : ITokenGenerator
    {
        public string GenerateToken()
        {
            return Guid.NewGuid().ToString().Substring(0, 7);
        }

        public bool TryParseToken(string input, out string token)
        {
            token = null;
            if (input.Length != 7)
            {
                return false;
            }

            token = input;
            return true;
        }
    }
}
