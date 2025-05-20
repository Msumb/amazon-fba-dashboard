const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');

const app = express();
app.use(cors());
app.use(express.json());

// Scrape Amazon search results (simplified demo, not for production scraping)
async function scrapeAmazon(keyword) {
  const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
  const { data } = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const $ = cheerio.load(data);
  const products = [];
  $('.s-result-item[data-asin]').each((i, el) => {
    const asin = $(el).attr('data-asin');
    const title = $(el).find('h2 a span').text().trim();
    const price = $(el).find('.a-price .a-offscreen').first().text().replace('$', '') || '0';
    const reviews = $(el).find('.a-size-base').first().text().replace(',', '') || '0';
    const rating = $(el).find('.a-icon-alt').first().text().split(' ')[0] || '0';
    // BSR and history are mock/demo data
    if (asin && title) products.push({
      asin,
      title,
      price: parseFloat(price),
      reviews: parseInt(reviews),
      rating: parseFloat(rating),
      bsr: Math.floor(Math.random() * 20000) + 1,
      keepa: {
        priceHistory: [20, 22, 21, 23, 19, 18, 20].map(x => Math.max(5, x + Math.random() * 5)),
        bsrHistory: [15000, 17000, 14000, 13500, 18000, 15000, 12000].map(x => x + Math.floor(Math.random() * 3000))
      }
    });
  });
  return products.slice(0, 20);
}

// Search endpoint
app.get('/api/search', async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) return res.json([]);
  const products = await scrapeAmazon(keyword);
  // Winner highlight logic (price>20, bsr<20000, reviews<150, rating>=4)
  products.forEach(p => p.winner = (p.price > 20 && p.bsr < 20000 && p.reviews < 150 && p.rating >= 4));
  res.json(products);
});

// Profit calculator endpoint
app.post('/api/profit-calc', (req, res) => {
  const { price, cost, shipping, fbaFee } = req.body;
  const profit = price - cost - shipping - fbaFee;
  const roi = (profit / (cost + shipping)) * 100;
  res.json({ profit, roi });
});

app.listen(5000, () => console.log('Backend running on port 5000'));
