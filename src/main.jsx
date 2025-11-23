import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { DataProvider } from './context/DataContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ErrorBoundary>
            <ThemeProvider>
                <LanguageProvider>
                    <DataProvider>
                        <CartProvider>
                            <App />
                        </CartProvider>
                    </DataProvider>
                </LanguageProvider>
            </ThemeProvider>
        </ErrorBoundary>
    </StrictMode>,
)
