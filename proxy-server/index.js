const http = require("http");
const httpProxy = require("http-proxy");
const url = require("url");

const proxy = httpProxy.createProxyServer();

// eslint-disable-next-line handle-callback-err
proxy.on("error", (err, req, res) => {
  res.writeHead(500, {
    "Content-Type": "text/plain",
  });

  console.log(err);

  res.end("Something went wrong. And we are reporting a custom error message.");
});

const FRONT_URL = process.env.FRONT_URL;
const BACK_URL = process.env.BACK_URL;

const products = [
  {
    // front
    name: "front",
    target: FRONT_URL,
    path: "/",
  },
  {
    // back
    name: "back",
    target: BACK_URL,
    path: "/api", // sm, static
  },
];

http
  .createServer((req, res) => {
    // eslint-disable-next-line node/no-deprecated-api
    // console.log(url.parse(req.url));
    const parsedURL = url.parse(req.url);
    // ищем продукт, у которого paths содержит элемент, с которого начинается req.url.path

    const product_filtered = products.filter((prd) =>
      parsedURL.path.startsWith(prd.path)
    );
    const product_max = product_filtered.reduce((p, n) =>
      p.path.length < n.path.length ? n : p
    );
    const product = product_max;

    if (product) return proxy.web(req, res, { target: product.target });
    return proxy.web(req, res, { target: products[0].target });
  })
  .listen(4000);
