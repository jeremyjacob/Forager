import time
import sys


def main():
    name = input('')  # Python 3
    sys.stdout.write(f"recieved: {name}")
    sys.stdout.close()
    time.sleep(10)


if __name__ == "__main__":
    main()
