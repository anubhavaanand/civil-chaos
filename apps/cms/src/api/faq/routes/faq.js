'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::faq.faq', {
  only: ['find', 'findOne'],
});
