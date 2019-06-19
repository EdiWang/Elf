﻿namespace LinkForwarder.Web.Authentication
{
    public class AuthenticationSettings
    {
        public AuthenticationProvider Provider { get; set; }

        public AzureAdOption AzureAd { get; set; }

        public LocalAccountOption Local { get; set; }

        public AuthenticationSettings()
        {
            Provider = AuthenticationProvider.None;
        }
    }
}
