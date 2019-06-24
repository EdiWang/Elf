namespace LinkForwarder.Services.TokenGenerator
{
    public interface ITokenGenerator
    {
        string GenerateToken();

        bool TryParseToken(string input, out string token);
    }
}
