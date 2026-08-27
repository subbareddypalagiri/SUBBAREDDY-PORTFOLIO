import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

const localCmsPlugin = () => ({
  name: 'local-cms',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/api/save-data' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
          try {
            const filePath = path.resolve(__dirname, 'src', 'data.json');
            fs.writeFileSync(filePath, body);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: error.message }));
          }
        });
      } else if (req.url === '/api/upload-image' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            const base64Data = data.image.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, 'base64');
            const filePath = path.resolve(__dirname, 'public', 'uploaded_avatar.png');
            fs.writeFileSync(filePath, buffer);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, url: '/uploaded_avatar.png?' + new Date().getTime() }));
          } catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: error.message }));
          }
        });
      } else if (req.url === '/api/submit-feedback' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
          try {
            const newFeedback = JSON.parse(body);
            const filePath = path.resolve(__dirname, 'src', 'feedback.json');
            let existingFeedback = [];
            if (fs.existsSync(filePath)) {
              existingFeedback = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            }
            existingFeedback.push({ ...newFeedback, date: new Date().toISOString() });
            fs.writeFileSync(filePath, JSON.stringify(existingFeedback, null, 2));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: error.message }));
          }
        });
      } else if (req.url === '/api/get-feedback' && req.method === 'GET') {
        try {
          const filePath = path.resolve(__dirname, 'src', 'feedback.json');
          if (fs.existsSync(filePath)) {
            const feedback = fs.readFileSync(filePath, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.end(feedback);
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify([]));
          }
        } catch (error) {
          res.statusCode = 500;
          res.end(JSON.stringify({ success: false, error: error.message }));
        }
      } else {
        next();
      }
    });
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), localCmsPlugin()],
})
