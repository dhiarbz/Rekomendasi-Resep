from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Load the TF-IDF vectorizer and the recipe model
tfidf = joblib.load('vectorizer.pkl')
df = pd.read_csv('Indonesia_food_dataset.csv')

# Create a TF-IDF representation of the dataset ingredients
df['Ingredients'] = df['Ingredients'].fillna('') 
model = tfidf.transform(df['Ingredients'])  # Assuming 'Ingredients' is the relevant column

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/search', methods=['POST'])
def search():
    bahan1 = request.json.get('bahan1', '')
    bahan2 = request.json.get('bahan2', '')
    bahan3 = request.json.get('bahan3', '')
    query_all = ' '.join([bahan1, bahan2, bahan3]).strip()
    
    # Handle empty query
    if not query_all:
        return jsonify([])  # Return an empty list if no ingredients are provided

    # Transform the query into the same TF-IDF format
    query_vector = tfidf.transform([query_all])
    
    # Debugging information
    print("Query vector shape:", query_vector.shape)
    print("Model shape:", model.shape)

    # Calculate cosine similarities
    cosine_similarities = cosine_similarity(query_vector, model).flatten()
    top_indices = cosine_similarities.argsort()[-3:][::-1]  # 5 top recommendations

    # Retrieve recommended recipes based on indices
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
