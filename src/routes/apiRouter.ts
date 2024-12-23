import express, { Router } from 'express';
import {
  getDeadliestAttackTypes,
  getHighestCasualtyRegions,
  getIncidentTrends,
  getTopGroupsByRegion,
  getGroupsByYear,
  getDeadliestRegionsByGroup,
  grouplist,
  countriesList,
  freeSearch
} from '../controllers/apiController';

const router: Router = express.Router();

router.get('/analysis/deadliest-attack-types', getDeadliestAttackTypes);
router.get('/analysis/highest-casualty-regions', getHighestCasualtyRegions);
router.get('/analysis/incident-trends', getIncidentTrends);
router.get('/relationships/top-groups', getTopGroupsByRegion);
router.get('/relationships/groups-by-year', getGroupsByYear);
router.get('/relationships/deadliest-regions', getDeadliestRegionsByGroup);
router.get('/freeSearch', freeSearch);
router.get('/grouplist', grouplist)
router.get('/countrieslist', countriesList)

export default router;
