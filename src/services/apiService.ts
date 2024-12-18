import AttackTypeModel from "../models/AttackTypeModel";

export const getAttackTypes = async ()=>{
    const attackTypes = await AttackTypeModel.find({}).sort({ countKill: -1 });
    return attackTypes
}

export const getCasualtyRegions = async ()=>{

}

export const getIncidentTrendsService = async ()=>{

}

export const getTopGroups = async ()=>{

}

export const getGroupsByYearService = async ()=>{

}

export const getRegionsByGroup = async ()=>{

}
