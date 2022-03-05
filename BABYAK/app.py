from flask import Flask
import requests

app = Flask(__name__)

@app.route('/test', methods=['POST'])
def create():
    print(request.is_json)
    params = request.get_json()
    print(params)
    return 'ok'

