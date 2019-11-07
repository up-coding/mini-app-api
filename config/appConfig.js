let appConfig = {
  port: "3000",
  allowedCorsOrigin: "*",
  environment: "dev",
  baseUrl: "http://localhost:3000",
  appUrl: "http://localhost:4200",
  dbUri: `mongodb://node-shop:node-shop@cluster0-shard-00-00-zvxva.mongodb.net:27017,
       cluster0-shard-00-01-zvxva.mongodb.net:27017,cluster0-shard-00-02-zvxva.
        mongodb.net:27017/mini-app-6?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`,
  emailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  passwordRegex: /^[A-Za-z0-9]\w{7,}$/
};

module.exports = appConfig;
