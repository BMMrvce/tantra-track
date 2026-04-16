import app from '../server/app.js';

export const config = {
  runtime: 'nodejs20.x'
};

export default function handler(req, res) {
  return app(req, res);
}