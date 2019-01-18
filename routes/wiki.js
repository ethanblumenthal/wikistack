const express = require('express');
const main = require('../views/main');
const addPage = require('../views/addPage');
const wikiPage = require('../views/wikiPage');
const { Page, User } = require('../models/index');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const pages = await Page.findAll();
    res.send(main(pages));
  } catch (error) { next(error) }
});

router.post('/', async (req, res, next) => {
  try {
    const [user, wasCreated] = await User.findOrCreate({
      where: {
        name: req.body.name,
        email: req.body.email
      }
    });

    const page = await Page.create(req.body);

    await page.setAuthor(user);

    res.redirect(`/wiki/${page.slug}`);
  } catch (error) { next(error) }
});

router.get('/add', (req, res, next) => {
  res.send(addPage());
});

router.get('/:slug', async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      }
    });
    res.send(wikiPage(page));
  } catch (error) { next(error) };
});

module.exports = router;
