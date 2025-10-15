# Używamy oficjalnego obrazu Bun
FROM oven/bun:1

# Katalog roboczy w kontenerze
WORKDIR /app

# Skopiuj cały kod do kontenera
COPY . .

# Zainstaluj zależności
RUN bun install --production

# Otwórz port (np. 3000)
EXPOSE 3000

# Uruchom backend
CMD ["bun", "run", "src/index.ts"]
