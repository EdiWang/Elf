FROM mcr.microsoft.com/dotnet/aspnet:5.0-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src

# Auto copy to prevent 996
COPY ./src/**/*.csproj ./
RUN for file in $(ls *.csproj); do mkdir -p ./${file%.*}/ && mv $file ./${file%.*}/; done

RUN dotnet restore "Elf.Web/Elf.Web.csproj"
COPY ./src .
WORKDIR "/src/Elf.Web"
RUN dotnet build "Elf.Web.csproj" -p:Version=3.1.0-docker -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Elf.Web.csproj" -p:Version=3.1.0-docker -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Elf.Web.dll"]