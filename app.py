from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import logging

app = Flask(__name__)

# Logging setup
logging.basicConfig(level=logging.INFO)

# Load TF-IDF model and dataset
try:
    tfidf = joblib.load('vectorizer.pkl')
    df = pd.read_csv('Indonesia_food_dataset.csv')
    df['Ingredients'] = df['Ingredients'].fillna('')
    model = tfidf.transform(df['Ingredients'])
except FileNotFoundError as e:
    raise RuntimeError(f"File tidak ditemukan: {e}")
except Exception as e:
    raise RuntimeError(f"Kesalahan saat memuat model atau data: {e}")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    """
    Cari resep berdasarkan bahan yang diberikan.

    Request Body (JSON):
        - bahan1: string
        - bahan2: string
        - bahan3: string
    
    Response (JSON):
        - Masakan: Nama masakan
        - Bahan: Bahan yang digunakan
        - Langkah: Langkah memasak
    """
    bahan1 = request.json.get('bahan1', '').strip()
    bahan2 = request.json.get('bahan2', '').strip()
    bahan3 = request.json.get('bahan3', '').strip()
    query_all = ' '.join([bahan1, bahan2, bahan3]).strip()

    if not query_all:
        return jsonify({"error": "Harap masukkan minimal satu bahan untuk mencari resep"}), 400

    query_vector = tfidf.transform([query_all])
    app.logger.info(f"Query vector shape: {query_vector.shape}")
    app.logger.info(f"Model shape: {model.shape}")

    # Calculate similarities
    cosine_similarities = cosine_similarity(query_vector, model).flatten()
    top_indices = np.argpartition(-cosine_similarities, 3)[:3]
    top_indices = top_indices[np.argsort(-cosine_similarities[top_indices])]

    results = []
    for idx in top_indices:
        recipe = df.iloc[idx]
        results.append({
            "Masakan": recipe['Title'], 
            "Bahan": recipe['Ingredients'], 
            "Langkah": recipe['Steps']
        })

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
