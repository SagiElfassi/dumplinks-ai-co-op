import type { CardData } from '../types';
import { getToken } from './authService';

const API_BASE_URL = '/api';

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || 'API request failed');
  }
  return response.json();
};

export const getCards = async (): Promise<CardData[]> => apiRequest('/cards');

export const addCard = async (card: Omit<CardData, 'id'> & { id: string }): Promise<CardData> =>
  apiRequest('/cards', { method: 'POST', body: JSON.stringify(card) });

export const updateCard = async (card: CardData): Promise<CardData> =>
  apiRequest(`/cards/${card.id}`, { method: 'PUT', body: JSON.stringify(card) });

export const deleteCard = async (cardId: string): Promise<void> =>
  apiRequest(`/cards/${cardId}`, { method: 'DELETE' });

export const processLink = async (url: string): Promise<Omit<CardData, 'id' | 'date'>> =>
  apiRequest('/links/process', { method: 'POST', body: JSON.stringify({ url }) });

export const parseSearchQuery = async (query: string): Promise<import('../types').SearchFilters> =>
  apiRequest('/links/parse-search', { method: 'POST', body: JSON.stringify({ query }) });
