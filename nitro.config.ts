export default defineNitroConfig({
  prerender: {
    autoSubfolderIndex: true,
    concurrency: 1,
    interval: 0,
    failOnError: false,
    crawlLinks: false,
    ignore: [],
    routes: [],
    retryDelay: 500,
  },
});
