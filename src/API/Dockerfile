FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
LABEL maintainer="edi.wang@outlook.com"
LABEL repo="https://github.com/EdiWang/Elf"

WORKDIR /app
EXPOSE 8080
EXPOSE 443

ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED=true

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Elf.Api/Elf.Api.csproj", "Elf.Api/"]
RUN dotnet restore "Elf.Api/Elf.Api.csproj"
COPY . .
WORKDIR "/src/Elf.Api"
RUN dotnet build "Elf.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Elf.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Elf.Api.dll"]