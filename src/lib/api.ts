const API_URL = 'http://localhost:8000';

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface Prediction {
  id: string;
  disease_name: string;
  category: string;
  confidence_score: number;
  severity_level: string;
  intensity_percentage: number;
  visual_symptoms: string[];
  natural_cure: string[];
  chemical_cure: string[];
  prevention_tips: string[];
  image_url: string;
  created_at: string;
}

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async signup(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Signup failed');
    }

    return response.json();
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    return response.json();
  }

  async predict(file: File): Promise<Prediction> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Prediction failed');
    }

    return response.json();
  }

  async getPredictions(): Promise<Prediction[]> {
    const response = await fetch(`${API_URL}/predictions`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch predictions');
    }

    return response.json();
  }
}

export const api = new ApiClient();
