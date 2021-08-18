const express = require('express');
const cleanBody = require('../middlewares/cleanbody');
const { validateToken } = require('../middlewares/validateToken');
const UrlDesign = require('../src/urlDesign/urlDesign.controller');

const router = express.Router();

// Define endpoints
router.get('/', validateToken, UrlDesign.GetUrlDesign);
router.post('/info', validateToken, cleanBody, UrlDesign.AddInfo);
router.post('/about-me', validateToken, cleanBody, UrlDesign.AddAboutMe);
router.post('/social-links', validateToken, cleanBody, UrlDesign.AddSocialLinks);
router.post('/video', validateToken, cleanBody, UrlDesign.AddVideo);
router.post('/images', validateToken, cleanBody, UrlDesign.AddImages)
router.post('/testimonials', validateToken, cleanBody, UrlDesign.AddTestimonials);
router.post('/custom-cta', validateToken, cleanBody, UrlDesign.AddCta);
router.post('/app-stores', validateToken, cleanBody, UrlDesign.AddAppStores);
router.post('/contact-form', validateToken, cleanBody, UrlDesign.AddContactForm);
module.exports = router;
