import express from 'express';

import { validate } from '@/common/validate';
import { auth } from '@/modules/auth';
import { claimController, claimValidation } from '@/modules/claim';

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(claimValidation.createClaimSchema), claimController.createClaim)
  .get(auth(), validate(claimValidation.getClaimsByDateRangeSchema), claimController.getClaimsByDateRange);

router
  .route('/:claimId/status')
  .patch(auth(), validate(claimValidation.updateClaimStatusSchema), claimController.updateClaimStatus);

router.route('/:claimId/assign').patch(auth(), validate(claimValidation.assignClaimSchema), claimController.assignClaim);

router.route('/:claimId/resolve').patch(auth(), validate(claimValidation.resolveClaimSchema), claimController.resolveClaim);

router
  .route('/variant/:variantId')
  .get(auth(), validate(claimValidation.getClaimsByVariantSchema), claimController.getClaimsByVariant);

export default router;
