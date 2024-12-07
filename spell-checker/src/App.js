import React, { useState } from "react";

const App = () => {
  const [word, setWord] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkSpelling = async () => {
    // Reset state
    setResult(null);
    setError(null);
    setLoading(true);

    try {
      // Panggil API backend untuk pengecekan ejaan menggunakan fetch
      const response = await fetch("http://localhost:5000/check-spelling", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word }),
      });

      if (!response.ok) {
        throw new Error("Gagal melakukan pengecekan ejaan");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Gagal melakukan pengecekan ejaan. Silakan coba lagi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestedWord) => {
    setWord(suggestedWord);
    checkSpelling();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Pengecekan Ejaan Bahasa Indonesia
        </h1>

        <div className="mb-4">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Masukkan kata yang ingin dicek"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={checkSpelling}
          disabled={!word || loading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 
                     disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? "Memeriksa..." : "Periksa Ejaan"}
        </button>

        {/* Tampilkan hasil pemeriksaan */}
        {result && (
          <div className="mt-4 p-4 rounded-md bg-gray-50 border">
            {result.is_correct ? (
              <div className="text-green-600 font-semibold">
                ✅ Kata "{result.word}" sudah benar!
              </div>
            ) : (
              <div className="text-red-600">
                ❌ Kata "{result.word}" sepertinya salah.
                {result.suggestion && (
                  <div className="mt-2">
                    Apakah yang Anda maksud:
                    <button
                      onClick={() => handleSuggestionClick(result.suggestion)}
                      className="ml-2 text-blue-600 underline hover:text-blue-800"
                    >
                      "{result.suggestion}"
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
