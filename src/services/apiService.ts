import AttackTypeModel from "../models/AttackTypeModel";
import StateAttacksModel from "../models/StateAttacksModel";

export const getAttackTypes = async ()=>{
    const attackTypes = await AttackTypeModel.find({}).lean().sort({ countKill: -1 });
    return attackTypes
}

export const getCasualtyRegions = async ()=>{
    const stateAttacks = await StateAttacksModel.aggregate([
        {
            $project: {
                country_txt: 1,
                count: 1,
                countKill: 1,
                countWound: 1,
                latitude: 1,
                longitude: 1,
                averageCasualties: {
                    $avg: ["$countKill", "$countWound"]
                }
            }
        },
        {
            $sort: { averageCasualties: -1 }
        }
    ]);

    return stateAttacks
}

export const getIncidentTrendsService = async ()=>{

}

export const getTopGroups = async ()=>{

}

export const getGroupsByYearService = async ()=>{

}

export const getRegionsByGroup = async ()=>{

}
