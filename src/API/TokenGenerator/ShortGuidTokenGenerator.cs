﻿namespace Elf.Api.TokenGenerator;

public class ShortGuidTokenGenerator : ITokenGenerator
{
    private const int Length = 8;

    public string GenerateToken() => Guid.NewGuid().ToString()[..Length].ToLower();

    public bool TryParseToken(string input, out string token)
    {
        token = null;
        if (input.Length != Length) return false;

        token = input;
        return true;
    }
}
