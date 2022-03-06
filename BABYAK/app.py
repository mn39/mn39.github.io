from flask import Flask, request
 
app = Flask(__name__)



def writeall(reanwdata):    
    f=open("memory.txt",'r')
    data = []
    while True:
        line = f.readline()
        print([line])
        if(line =='\n'): break
        if not line: break
        nwdata = line.strip().strip(',').split()
        print([nwdata[0],nwdata[1].split(',')],'nwdata')
        data.append([nwdata[0],nwdata[1].split(',')])
    f.close()
    data.append(reanwdata)

    print(data,'this is data')

    nw = set(data[0][1])
    for n,date in data: 
        nw = nw&set(date)

    f=open("memory.txt",'w')
    for n,date in data:
        f.write(n)
        f.write(' ')
        for i in date:
            f.write(i)
            f.write(',')
        f.write('\n')
    f.write('\n')
    f.write(str(list(nw)))
    f.close()

@app.route('/param')
def hello():

    a = request.args.get('pname')
    b = request.args.get('possDate')
    if(a==None or b == None):
        return "sorry please check your name or possible days"
    writeall([a,b.split(',')])
    return "thx"

if __name__== "__main__":
    app.run()