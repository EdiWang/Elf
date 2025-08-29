FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
LABEL maintainer="edi.wang@outlook.com"
LABEL repo="https://github.com/EdiWang/Elf"
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Elf.Admin/Elf.Admin.csproj", "Elf.Admin/"]
COPY ["Elf.Shared/Elf.Shared.csproj", "Elf.Shared/"]
COPY ["Elf.TokenGenerator/Elf.TokenGenerator.csproj", "Elf.TokenGenerator/"]
RUN dotnet restore "./Elf.Admin/Elf.Admin.csproj"
COPY . .
WORKDIR "/src/Elf.Admin"
RUN dotnet build "./Elf.Admin.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Elf.Admin.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Elf.Admin.dll"]