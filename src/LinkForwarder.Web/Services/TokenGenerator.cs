using System;

namespace LinkForwarder.Services
{
    public interface ITokenGenerator
    {
        string GenerateToken();

        bool TryParseToken(string input, out string token);
    }

    public class ShortGuidTokenGenerator : ITokenGenerator
    {
        private const int Length = 8;

        public string GenerateToken()
        {
            return Guid.NewGuid().ToString().Substring(0, Length).ToLower();
        }

        public bool TryParseToken(string input, out string token)
        {
            token = null;
            if (input.Length != Length)
            {
                return false;
            }

            token = input;
            return true;
        }
    }
}
