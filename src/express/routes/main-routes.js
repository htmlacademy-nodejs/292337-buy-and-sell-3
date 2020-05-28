'use strict';

const {Router} = require(`express`);

const mainRouter = new Router();

module.exports = (parentRouter, offerDataService) => {
  parentRouter.use(`/`, mainRouter);

  mainRouter.get(`/`, async (req, res) => {
    const offers = await offerDataService.findAll();

    const newestOffers = [...offers].sort((a, b) => b.date - a.date);
    const mostCommentedOffers = [...offers].sort((a, b) => b.comments.length - a.comments.length);

    if (newestOffers.length > 8) {
      newestOffers.length = 8;
    }

    if (mostCommentedOffers.length > 8) {
      mostCommentedOffers.length = 8;
    }

    res.render(`main`, {newestOffers, mostCommentedOffers});
  });
  mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
  mainRouter.get(`/login`, (req, res) => res.render(`login`));
  mainRouter.get(`/search`, async (req, res) => {
    const {search} = req.query;
    const searchResult = await offerDataService.findBy(search);

    // TODO: Убрать дублирование с newestOffers для главного маршрута
    const offers = await offerDataService.findAll();

    const newestOffers = [...offers].sort((a, b) => b.date - a.date);

    if (newestOffers.length > 8) {
      newestOffers.length = 8;
    }

    res.render(`search-result`, {searchResult, newestOffers});
  });
};
