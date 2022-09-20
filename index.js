const { getNetworth, getPrices } = require('skyhelper-networth');
const express = require('express')

const app = express()

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

let prices = getPrices();

setInterval(async () => {
    console.log("Getting prices")
    prices = await getPrices();
}, 1000 * 60 * 5); // Retrieve prices every 5 minutes

// Networth can now be retrieved without having to request SkyHelper's prices every function call

// Weird altpapier didn't do this in his package behind the scenes
// He said he never thought of it smh.

app.get('/networth', async function (req, res) {
    let options = req.body.options;
    options.prices = prices;
    const networth = await getNetworth(req.body.profileData, req.body.bankBalance, options);
    res.send(networth)
})

app.listen(port, () => {
    console.log(`Networth api listening on port ${port}`)
})