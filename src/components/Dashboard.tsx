import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api, Prediction } from '../lib/api';
import { Upload, LogOut, Leaf, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export function Dashboard() {
  const { logout } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Prediction | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError('');

    try {
      const prediction = await api.predict(selectedFile);
      setResult(prediction);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'text-green-700 bg-green-100 border-green-300';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'critical': return 'text-red-700 bg-red-100 border-red-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category === 'healthy') return <CheckCircle className="w-6 h-6 text-green-600" />;
    return <AlertCircle className="w-6 h-6 text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Cotton Disease Detector
            </h1>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Leaf Image</h2>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-green-500 transition cursor-pointer bg-gray-50"
            >
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
              ) : (
                <div>
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Click to upload cotton leaf image</p>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-2">
                <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleUpload}
                disabled={!selectedFile || loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Analyze Leaf'}
              </button>
              {(selectedFile || result) && (
                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition disabled:opacity-50"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {result && (
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
                {getCategoryIcon(result.category)}
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-1">Disease Name</h3>
                  <p className="text-xl font-bold text-gray-800">{result.disease_name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Category</h3>
                    <p className="text-lg font-semibold text-gray-800 capitalize">{result.category}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Confidence</h3>
                    <p className="text-lg font-semibold text-gray-800">{result.confidence_score}%</p>
                  </div>
                </div>

                <div className={`border rounded-lg p-4 ${getSeverityColor(result.severity_level)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold mb-1">Severity Level</h3>
                      <p className="text-xl font-bold">{result.severity_level}</p>
                    </div>
                    <div className="text-right">
                      <h3 className="text-sm font-semibold mb-1">Intensity</h3>
                      <p className="text-xl font-bold">{result.intensity_percentage}%</p>
                    </div>
                  </div>
                </div>

                {result.visual_symptoms.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">Visual Symptoms</h3>
                    <ul className="space-y-1">
                      {result.visual_symptoms.map((symptom, idx) => (
                        <li key={idx} className="text-sm text-blue-800 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.natural_cure.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-green-900 mb-2">Natural Cure</h3>
                    <ul className="space-y-1">
                      {result.natural_cure.map((cure, idx) => (
                        <li key={idx} className="text-sm text-green-800 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{cure}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.chemical_cure.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-orange-900 mb-2">Chemical Treatment</h3>
                    <ul className="space-y-1">
                      {result.chemical_cure.map((cure, idx) => (
                        <li key={idx} className="text-sm text-orange-800 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{cure}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.prevention_tips.length > 0 && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-purple-900 mb-2">Prevention Tips</h3>
                    <ul className="space-y-1">
                      {result.prevention_tips.map((tip, idx) => (
                        <li key={idx} className="text-sm text-purple-800 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
