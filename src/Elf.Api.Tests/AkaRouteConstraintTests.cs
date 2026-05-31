using Elf.Shared;
using Microsoft.AspNetCore.Routing.Patterns;

namespace Elf.Api.Tests;

public class AkaRouteConstraintTests
{
    [Fact]
    public void AkaNameRouteConstraint_CanBeParsedAsInlineRouteConstraint()
    {
        var routePattern = RoutePatternFactory.Parse("/aka/{akaName:" + IdentifierRules.AkaNameRouteConstraint + "}");

        var parameter = Assert.Single(routePattern.Parameters);
        Assert.Equal("akaName", parameter.Name);
        Assert.Single(parameter.ParameterPolicies);
    }
}
