'use latest';

import express from 'express';
import { fromExpress } from 'webtask-tools';
import bodyParser from 'body-parser';
import httpProxy from 'http-proxy';
import jade from 'jade';
const app = express();

app.use(bodyParser.json());


app.use(bodyParser.urlencoded({ extended: false }));
const proxy = httpProxy.createProxyServer({});

const samlTool = "samltool.io:80"

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  //hack: find a better way... 
  proxyReq._headers.host = samlTool
});

app.get('*', function (req, res) {
  console.log(req.path);
  proxy.web(req,res,{target: `http://${samlTool}`});
});

app.post('/', function (req, res) {
  var template = `
html
  head
    script.
      localStorage.setItem('samlValue', '${req.body.SAMLResponse}');
      window.location.href = '/v2';
  body
`;
  res.header("Content-Type", 'text/html');
  res.status(200).send(jade.compile(template)({}));
});

module.exports = fromExpress(app);
