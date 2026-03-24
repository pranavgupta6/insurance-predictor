from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app)

with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    input_df = pd.DataFrame([{
        'age':      data['age'],
        'sex':      data['sex'],
        'bmi':      data['bmi'],
        'children': data['children'],
        'smoker':   data['smoker'],
        'region':   data['region']
    }])
    prediction = model.predict(input_df)[0]
    return jsonify({'predicted_cost': round(float(prediction), 2)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)