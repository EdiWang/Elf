FROM mcr.microsoft.com/dotnet/aspnet:6.0-alpine AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED=true

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src/API

# Auto copy to prevent 996
COPY ./src/API/**/*.csproj ./
RUN for file in $(ls *.csproj); do mkdir -p ./${file%.*}/ && mv $file ./${file%.*}/; done

RUN dotnet restore "Elf.Api/Elf.Api.csproj"
COPY ./src/API .
WORKDIR "/src/API/Elf.Api"
RUN dotnet build "Elf.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Elf.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Elf.Api.dll"]