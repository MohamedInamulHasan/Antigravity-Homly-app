import express from 'express';
import {
    getStores,
    getStore,
    createStore,
    updateStore,
    deleteStore
} from '../controllers/storeController.js';

const router = express.Router();

router.route('/')
    .get(getStores)
    .post(createStore);

router.route('/:id')
    .get(getStore)
    .put(updateStore)
    .delete(deleteStore);


export default router;
