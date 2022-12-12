const cloudflareScraper = require("cloudflare-scraper");

(async () => {
  try {
    const response = await cloudflareScraper.get(
      "https://www.allbiz.com/business/hoboken-car-wash-201-533-8000"
    );
    console.log(response);
  } catch (error) {
    console.log(error);
  }
})();
