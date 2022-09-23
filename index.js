const { getNetworth, getPrices } = require('skyhelper-networth');
const express = require('express')

const app = express()
const accessKey = "TIMNOOT_IS_AWESOME";
var fs = require('fs');

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

const port = 8880

app.get('/', (req, res) => {
    res.json('Hello World!')
})

var prices = getPrices();

setInterval(async () => {
    console.log("Getting prices")
    prices = await getPrices();
}, 1000 * 60 * 5); // Retrieve prices every 5 minutes

// Networth can now be retrieved without having to request SkyHelper's prices every function call

// Weird altpapier didn't do this in his package behind the scenes
// He said he never thought of it smh.

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

app.get('/networth', async function (req, res) {
    if (req.headers.authorization !== accessKey) {
        res.status(401).json("Invalid access key");
        return;
    }
    let options = req.body.options || {};
    if (isEmpty(prices)) {
        prices = await getPrices();
    }
    options.prices = prices
    const networth = await getNetworth(req.body.profileData, req.body.bankBalance, options);
    res.json(networth)
})

app.listen(port, () => {
    console.log(`Networth api listening on port ${port}`)
})