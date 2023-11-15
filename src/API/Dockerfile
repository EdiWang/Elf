FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
LABEL maintainer="edi.wang@outlook.com"
LABEL repo="https://github.com/EdiWang/Elf"

USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED=true

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["API/Elf.Api.csproj", "API/"]
RUN dotnet restore "./API/./Elf.Api.csproj"
COPY . .
WORKDIR "/src/API"
RUN dotnet build "./Elf.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Elf.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Elf.Api.dll"]