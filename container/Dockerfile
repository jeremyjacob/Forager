FROM arm64v8/alpine:3.14

# You need libc6-compat, I guess
RUN apk add --no-cache libc6-compat

# Download forager binary
RUN wget -O '/tmp/forager' 'https://github.com/jeremyjacob/Forager/releases/latest/download/forager'

# Fix permissions
# COPY /tmp/forager /app/forager
RUN chmod +x /tmp/forager

ENTRYPOINT ./tmp/forager