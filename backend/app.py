from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import difflib

class IndonesianSpellChecker:
    def __init__(self):
        # Kamus kata dasar bahasa Indonesia
        self.dictionary = self.load_dictionary()
    
    def load_dictionary(self):
        # Membaca file daftar kata bahasa Indonesia
        dictionary = set()
        try:
            with open('indonesian.txt', 'r', encoding='utf-8') as file:
                # Membaca setiap baris dan menambahkan kata ke dalam set
                for line in file:
                    word = line.strip().lower()  # Menghapus spasi dan membuat huruf kecil
                    if word:  # Pastikan kata tidak kosong
                        dictionary.add(word)
        except FileNotFoundError:
            print("File indonesian.txt tidak ditemukan!")
        return dictionary
    
    def suggest_correction(self, word):
        """
        Mencari kata yang mirip dengan kata yang dimasukkan
        Menggunakan algoritma difflib untuk menemukan suggestion
        """
        word = word.lower().strip()
        
        # Tambahkan validasi panjang kata
        if len(word) < 2:
            return None
        
        # Cek apakah kata persis ada di kamus
        if word in self.dictionary:
            return None
        
        # Cari kata terdekat menggunakan difflib
        matches = difflib.get_close_matches(word, list(self.dictionary), n=3, cutoff=0.6)
        
        return matches[0] if matches else None

# Inisialisasi Flask App
app = Flask(__name__)
CORS(app)  # Izinkan Cross-Origin Resource Sharing

# Inisialisasi spell checker
spell_checker = IndonesianSpellChecker()

@app.route('/check-spelling', methods=['POST'])
def check_spelling():
    """
    Endpoint untuk memeriksa ejaan
    """
    data = request.json
    word = data.get('word', '').strip()
    
    if not word:
        return jsonify({
            'is_correct': False,
            'error': 'Kata tidak boleh kosong'
        }), 400
    
    # Cek ejaan
    suggestion = spell_checker.suggest_correction(word)
    
    return jsonify({
        'word': word,
        'is_correct': suggestion is None,
        'suggestion': suggestion
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)