import pandas as pd

good = pd.read_csv('./dataset/good.txt', sep="!#$$#]", header=None)
bad = pd.read_csv('./dataset/bad.txt', sep="!#$$#]", header=None)
df = pd.concat([good, bad], axis=1)
print(df)
