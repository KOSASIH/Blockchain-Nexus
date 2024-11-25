const express = require('express');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();
const port = 4000;

// Swagger Configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Blockchain Compatibility API',
      version: '1.0.0',
      description: 'API for cross-blockchain compatibility',
    },
    servers: [{ url: 'http://localhost:4000' }],
  },
  apis: ['./index.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(bodyParser.json());

// JWT Secret
const JWT_SECRET = 'your-secure-secret';

// Blockchain Providers
const providers = {
  ethereum: new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'),
  bsc: new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org/'),
  polygon: new ethers.JsonRpcProvider('https://polygon-rpc.com/'),
};

// Utility Functions
const verifyJwt = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token required');
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = decoded;
    next();
  });
};

// API Endpoints

/**
 * @swagger
 * /token/balance:
 *   post:
 *     summary: Get token balance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *               tokenAddress:
 *                 type: string
 *               blockchain:
 *                 type: string
 *                 enum: [ethereum, bsc, polygon]
 *     responses:
 *       200:
 *         description: Token balance retrieved
 */
app.post('/token/balance', verifyJwt, async (req, res) => {
  const { address, tokenAddress, blockchain } = req.body;
  try {
    const provider = providers[blockchain];
    const abi = [
      'function balanceOf(address) view returns (uint256)',
      'function decimals() view returns (uint8)',
    ];
    const contract = new ethers.Contract(tokenAddress, abi, provider);
    const balance = await contract.balanceOf(address);
    const decimals = await contract.decimals();
    res.json({ balance: ethers.formatUnits(balance, decimals) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /token/transfer:
 *   post:
 *     summary: Transfer tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               privateKey:
 *                 type: string
 *               to:
 *                 type: string
 *               amount:
 *                 type: string
 *               tokenAddress:
 *                 type: string
 *               blockchain:
 *                 type: string
 *                 enum: [ethereum, bsc, polygon]
 *     responses:
 *       200:
 *         description: Token transferred successfully
 */
app.post('/token/transfer', verifyJwt, async (req, res) => {
  const { privateKey, to, amount, tokenAddress, blockchain } = req.body;
  try {
    const provider = providers[blockchain];
    const wallet = new ethers.Wallet(privateKey, provider);
    const abi = [
      'function transfer(address, uint256) returns (bool)',
      'function decimals() view returns (uint8)',
    ];
    const contract = new ethers.Contract(tokenAddress, abi, wallet);
    const decimals = await contract.decimals();
    const tx = await contract.transfer(to, ethers.parseUnits(amount, decimals));
    await tx.wait();
    res.json({ message: 'Transfer successful', transactionHash: tx.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// OAuth 2.0 Authentication Simulation
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  // Replace with real authentication logic
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(403).json({ message: 'Invalid credentials' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
