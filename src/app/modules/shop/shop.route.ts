import { Router } from 'express';
import auth from '../../middleware/auth';
import upload from '../../middleware/fileUpload';
import parseData from '../../middleware/parseData';
import validateRequest from '../../middleware/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { shopController } from './shop.controller';
import { shopValidation } from './shop.validation';

const router = Router();

router.post(
  '/',
  upload.single('file'),
  parseData(),
  auth(USER_ROLE.admin, USER_ROLE.provider),
  validateRequest(shopValidation.InsertShopSchema),
  shopController.insertShopintoDb,
);
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.provider, USER_ROLE.customer),
  shopController.getAllShops,
);
router.get('/my-shop', auth(USER_ROLE.provider), shopController.getmyshop);
router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.provider, USER_ROLE.customer),
  shopController.getSingleShop,
);
router.patch(
  '/:id',
  upload.single('file'),
  parseData(),
  auth(USER_ROLE.admin, USER_ROLE.provider),
  validateRequest(shopValidation.InsertShopSchema),
  shopController.updateAshop,
);
router.patch(
  '/delete/:id',
  validateRequest(shopValidation.updateAshopSchema),
  auth(USER_ROLE.admin, USER_ROLE.provider),
  shopController.deleteAShop,
);
export const shopRoutes = router;