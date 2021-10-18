﻿using Microsoft.AspNetCore.Razor.TagHelpers;
using System.Security.Claims;

namespace Elf.Web.TagHelpers;

public enum UserInfoDisplay
{
    PreferName,
    PreferEmail,
    Both
}

[HtmlTargetElement("userinfo", TagStructure = TagStructure.NormalOrSelfClosing)]
public class UserInfoTagHelper : TagHelper
{
    public ClaimsPrincipal User { get; set; }

    public UserInfoDisplay UserInfoDisplay { get; set; } = UserInfoDisplay.Both;

    public static string TagClassBase => "aspnet-tag-elf-userinfo";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        if (User?.Identity is null || !User.Identity.IsAuthenticated)
        {
            base.Process(context, output);
        }
        else
        {
            var name = GetName();
            var email = GetEmail();

            output.TagName = "div";
            output.Attributes.SetAttribute("class", TagClassBase);

            switch (UserInfoDisplay)
            {
                case UserInfoDisplay.PreferName:
                    output.Content.SetContent(name ?? email);
                    break;
                case UserInfoDisplay.PreferEmail:
                    output.Content.SetContent(email ?? name);
                    break;
                case UserInfoDisplay.Both:
                    output.Content.SetHtmlContent(
                        $"<div class='{TagClassBase}-name'>{name}</div><email class='{TagClassBase}-email'>{email}</email>");
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }

    private string GetName()
    {
        string name = null;

        // try non-standard name
        if (User.HasClaim(c => c.Type.ToLower() == "name"))
        {
            name = User.Claims.FirstOrDefault(c => c.Type.ToLower() == "name")?.Value;
        }

        if (!string.IsNullOrWhiteSpace(name)) return name;
        if (User.Identity != null) name = User.Identity.Name;
        // if (string.IsNullOrWhiteSpace(name)) name = "N/A";

        return name;
    }

    private string GetEmail()
    {
        string email = null;
        if (User.HasClaim(c => c.Type == ClaimTypes.Email))
        {
            email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        }

        if (string.IsNullOrWhiteSpace(email))
        {
            // non-standard name
            if (User.HasClaim(c => c.Type.ToLower() == "email"))
            {
                email = User.Claims.FirstOrDefault(c => c.Type.ToLower() == "email")?.Value;
            }
        }

        return email;
    }
}