FROM arm64v8/rust as builder

# Capture dependencies
COPY Cargo.toml Cargo.lock /app/

# We create a new lib and then use our own Cargo.toml
WORKDIR /app
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN rustup install nightly && rustup default nightly

# This step compiles only our dependencies and saves them in a layer. This is the most impactful time savings
# Note the use of --mount=type=cache. On subsequent runs, we'll have the crates already downloaded
RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release && rm src/main.rs

# Copy our sources
COPY ./src /app/src

# A bit of magic here!
# * We're mounting that cache again to use during the build, otherwise it's not present and we'll have to download those again - bad!
# * Rust here is a bit fiddly, so we'll touch the files (even though we copied over them) to force a new build
RUN --mount=type=cache,target=/usr/local/cargo/registry \
	set -e && \
	# update timestamps to force a new build &&
	touch /app/src/main.rs && \
	cargo build --release

# Again, our final image is the same - a slim base and just our app
FROM arm64v8/debian:buster-slim as app
RUN \
	apt-get update && \
	apt-get install ca-certificates -y && \
	apt-get clean

# Enable MITM inspection
# RUN \
# 	sysctl -w net.ipv4.ip_forward=1 && \
# 	iptables -t nat -A PREROUTING -i docker0 -p tcp --dport 80 -j REDIRECT --to-port 8080 && \
# 	iptables -t nat -A PREROUTING -i docker0 -p tcp --dport 443 -j REDIRECT --to-port 8080

COPY --from=builder /app/target/release/forager /forager
CMD ["/forager"]
