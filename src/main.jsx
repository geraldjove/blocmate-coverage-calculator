import React from 'react'
import ReactDOM from 'react-dom/client'
// Self-hosted Montserrat (bundled, same-origin) so the fonts render reliably on
// every device and can be embedded into the saved report image.
import '@fontsource/montserrat/300.css'
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/500.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'
import App from '@/App.jsx'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
