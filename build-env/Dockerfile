FROM arm64v8/rust:alpine

# You need libc6-compat, I guess
# RUN apk add --no-cache libc6-compat
RUN apk add --no-cache git

# ADD ../worker ./worker
RUN git clone https://github.com/jeremyjacob/Forager.git
WORKDIR ./Forager/worker
# COPY . 

# RUN cargo install --path ./Forager/worker

RUN rustup install nightly
RUN rustup default nightly
RUN cargo build --verbose --release 
RUN sleep 120