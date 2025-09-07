import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import type { ApiCommonResponse, CreateProductInput, Product, ProductResponse, UpdateProductInput } from '@/types'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3001'

const api: AxiosInstance = axios.create({
	baseURL: API_BASE,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10000, 
})

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('auth_token')
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	(error) => Promise.reject(error)
)

api.interceptors.response.use(
	(response: AxiosResponse) => response,
	(error) => {
		if (error.response) {
			const message = error.response.data?.message ||
				error.response.data?.error ||
				error.response.statusText ||
				`HTTP ${error.response.status}`
			throw new Error(message)
		} else if (error.request) {
			throw new Error('Network error - please check your connection')
		} else {
			throw new Error(error.message || 'An unexpected error occurred')
		}
	}
)

export const ProductsApi = {
	list: async () => {
		const response = await api.get<{ data: ProductResponse }>('/products')
		return response.data
	},
    getById: async (id: string) => {
		const response = await api.get<ApiCommonResponse<Product>>(`/products/${id}`)
		return response.data
	},
	create: async (input: CreateProductInput) => {
		const response = await api.post<Product>('/products', input)
		return response.data
	},
	update: async (id: string, input: UpdateProductInput) => {
		const response = await api.put<Product>(`/products/${id}`, input)
		return response.data
	},
	remove: async (id: string) => {
		await api.delete(`/products/${id}`)
	},
}

export type LowStockEvent = {
	type: 'LowStockWarning'
	productId: string
	message: string
}


export { api }

export { API_BASE }

export function connectEventStream(onEvent: (evt: LowStockEvent) => void) {
	const url = `${API_BASE}/events/stream`
	if ('EventSource' in window) {
		const es = new EventSource(url)
		es.onmessage = (e) => {
			try {
				const data = JSON.parse(e.data)
				if (data?.type === 'LowStockWarning') onEvent(data)
			} catch {}
		}
		es.onerror = () => {
			console.warn('EventSource connection error, falling back to polling')
			es.close()
		}
		return () => es.close()
	}

	// Fallback polling implementation
	let intervalId: number | null = null
	let aborted = false

	const poll = () => {
		if (aborted) return

		try {
			// For now, we'll just simulate polling - in a real app you'd poll an endpoint
			// const response = await api.get('/events/recent')
			// response.data.forEach(onEvent)
			console.log('Polling for events...')
		} catch (error) {
			console.error('Polling error:', error)
		}
	}

	intervalId = setInterval(poll, 5000)
	return () => {
		aborted = true
		if (intervalId) clearInterval(intervalId)
	}
}


