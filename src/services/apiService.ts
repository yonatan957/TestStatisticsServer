import AttackTypeModel from "../models/AttackTypeModel";
import StateAttacksModel from "../models/StateAttacksModel";
import YearAttacksModel from "../models/YearAttacksModel";

// question 1
export const getAttackTypes = async ()=>{
    const attackTypes = await AttackTypeModel.find({}).lean().sort({ countKill: -1 });
    return attackTypes
}

// question 2
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
                    $cond: {
                        if: { $gt: ["$count", 0] },
                        then: { $divide: [{ $add: ["$countKill", "$countWound"] }, "$count"] },
                        else: 0
                    }
                }
            }
        },
        {
            $sort: { averageCasualties: -1 }
        }
    ]);

    return stateAttacks;
}

// question 3
export const getIncidentTrendsService = async (year: number, endYear: number)=>{
    return await YearAttacksModel.find({year: {$gte: year, $lte: endYear}}).lean();
}

export const getTopGroups = async ()=>{

}

export const getGroupsByYearService = async ()=>{

}

export const getRegionsByGroup = async ()=>{

}
