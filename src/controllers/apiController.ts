import { Request, Response } from 'express';
import {
  getAttackTypes,
  getCasualtyRegions,
  getIncidentTrendsService,
  getTopGroups,
  getGroupsByYearService,
  getRegionsByGroup,
  getGroupsYears,
  getGroupList,
  getCountriesList
} from "../services/apiService";

export const getDeadliestAttackTypes = async (req: Request, res: Response) => {
  try {
    const data = await getAttackTypes();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching deadliest attack types", error: (error as Error).message });
  }
};

export const getHighestCasualtyRegions = async (req: Request, res: Response) => {
  try {
    const result = await getCasualtyRegions();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching highest casualty regions', error: (error as Error).message });
  }
};

export const getIncidentTrends = async (req: Request, res: Response) => {
  try {
    const { year, endyear } = req.query;
    const result = await getIncidentTrendsService(Number(year), (endyear? Number(endyear) : Number(year)));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching incident trends', error: (error as Error).message });
  }
};

export const getTopGroupsByRegion = async (req: Request, res: Response) => {
  try {
    const  { country, limit } = req.query;
    if (!country) throw new Error("country is required");
    const Numlimit = Number(limit);
    if (Numlimit < -1) throw new Error("limit must be greater than 0");

    const result = await getTopGroups(country as string, Numlimit? Numlimit : 5);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top groups by region', error: (error as Error).message });
  }
};

export const getGroupsByYear = async (req: Request, res: Response) => {
  try {
    let result:any[] = [];
    const { year, groupName, amount } = req.query;
    if (year) result = await getGroupsByYearService(Number(year), Number(amount? amount : -1));
    else if (groupName) result = await getGroupsYears(groupName as string);
    else throw new Error("year or group name is required");
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching groups by year', error: (error as Error).message });
  }
};

export const getDeadliestRegionsByGroup = async (req: Request, res: Response) => {
  try {
    const { groupName } = req.query;
    if (!groupName) throw new Error("group name is required");
    const result = await getRegionsByGroup(groupName as string);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deadliest regions by group', error: (error as Error).message });
  }
};

export const grouplist = async (req: Request, res: Response) => {
  try {
    const result = await getGroupList();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deadliest regions by group', error: (error as Error).message });
  }
};
export const countriesList = async (req: Request, res: Response) => {
  try {
    const result = await getCountriesList();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deadliest regions by group', error: (error as Error).message });
  }
};