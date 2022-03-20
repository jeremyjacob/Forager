# read domains.txt, and only include domains that end with tlds specified in TLDS.txt
from pymongo import MongoClient
client = MongoClient(
    '''mongodb://jeremy:OlSW2Q91eSQrreiu@3.101.119.162:27017/?authSource=forager&readPreference=primary&appname=Python&directConnection=true&ssl=false''')
db = client.forager


tlds = []
with open('TLDS.txt', 'r') as f:
    for line in f:
        l = line.strip()
        if l:
            tlds.append(l)
print(tlds)

i = 0
d = 0
with open('domains.txt', 'r') as f:
    print("Loaded file")
    for domain in f:
        i += 1
        # if i < 6017576: continue
        domain = domain.lower().strip()
        print(i, end='\r')
        for tld in tlds:
            if domain.endswith(tld):
                d += 1
                result = db.domains.insert_one(
                    {'domain': domain, 'fetched': 0, 'fetching': False})
                print('')
                print('Created {: >15} {: >10} as {}'.format(
                    domain, d, result.inserted_id))
                break
