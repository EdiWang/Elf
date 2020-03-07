FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["Elf.Web/Elf.Web.csproj", "Elf.Web/"]
COPY ["Elf.Services/Elf.Services.csproj", "Elf.Services/"]
COPY ["Elf.Setup/Elf.Setup.csproj", "Elf.Setup/"]
RUN dotnet restore "Elf.Web/Elf.Web.csproj"
COPY . .
WORKDIR "/src/Elf.Web"
RUN dotnet build "Elf.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Elf.Web.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Elf.Web.dll"]