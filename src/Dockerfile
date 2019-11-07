ARG DllVersion=1.0.1000

FROM mcr.microsoft.com/dotnet/core/aspnet:3.0-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.0-buster AS build
WORKDIR /src
COPY ["LinkForwarder.Web/LinkForwarder.Web.csproj", "LinkForwarder.Web/"]
COPY ["LinkForwarder.Services/LinkForwarder.Services.csproj", "LinkForwarder.Services/"]
COPY ["LinkForwarder.Setup/LinkForwarder.Setup.csproj", "LinkForwarder.Setup/"]
RUN dotnet restore "LinkForwarder.Web/LinkForwarder.Web.csproj"
COPY . .
WORKDIR "/src/LinkForwarder.Web"
RUN dotnet build "LinkForwarder.Web.csproj" -c Release -o /app/build -p:Version=$DllVersion

FROM build AS publish
RUN dotnet publish "LinkForwarder.Web.csproj" -c Release -o /app/publish -p:Version=$DllVersion

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LinkForwarder.Web.dll"]