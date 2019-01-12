const express = require('express');
const router = express.Router();

const cacheControllers = require('../controllers/cacheController');

router.post('/create',cacheControllers.createCache);
router.put('/updatecache/:key',cacheControllers.updateCacheData);
router.get('/getcache/:key',cacheControllers.getCache);
router.get('/',cacheControllers.getAllCache);
router.delete('/:key',cacheControllers.deleteCacheData);
router.delete('/',cacheControllers.deleteAllCacheData);

module.exports = router;