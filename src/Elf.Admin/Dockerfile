FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
LABEL maintainer="edi.wang@outlook.com"
LABEL repo="https://github.com/EdiWang/Elf"
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Elf.Admin/Elf.Admin.csproj", "Elf.Admin/"]
COPY ["Elf.Api/Elf.Api.csproj", "Elf.Api/"]
COPY ["Elf.Data/Elf.Data.csproj", "Elf.Data/"]
COPY ["Elf.Shared/Elf.Shared.csproj", "Elf.Shared/"]
COPY ["Elf.TokenGenerator/Elf.TokenGenerator.csproj", "Elf.TokenGenerator/"]
RUN dotnet restore "./Elf.Admin/Elf.Admin.csproj"
COPY . .
WORKDIR "/src/Elf.Admin"
RUN dotnet publish "./Elf.Admin.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false --no-restore

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Elf.Admin.dll"]
