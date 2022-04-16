FROM arm64v8/alpine:3.14

# Install cURL
# RUN apk --no-cache add curl

# Download forager binary
# RUN curl -vLJ -o './forager' -H 'Authorization: token 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' 'ghcr.io/jeremyjacob/forager:latest' -O ./forager
RUN wget -O 'forager' 'https://github.com/jeremyjacob/Forager/releases/latest/download/forager'

# Fix permissions
RUN chmod +x ./forager

CMD ./forager