from flask import Flask, request
 
app = Flask(__name__)
 
@app.route('/param')
def hello():

    a = request.args.get('pname')
    b = request.args.get('possDate')
    
    return "thx"
 


if __name__== "__main__":
    app.run(port=80)