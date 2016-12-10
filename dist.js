'use latest';

import express from 'express';
import { fromExpress } from 'webtask-tools';
import httpProxy from 'http-proxy';
const app = express();

const proxy = httpProxy.createProxyServer({});
const samlTool = "samltool.io:80";

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  //hack: find a better way... 
  proxyReq._headers.host = samlTool;
});

app.get('*', function (req, res) {
  proxy.web(req,res,{target: `http://${samlTool}/dist`});
});

module.exports = fromExpress(app);
