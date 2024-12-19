import AttackTypeModel from "../models/AttackTypeModel";
import CountryGroupsModel from "../models/CountryGroupsModel";
import StateAttacksModel from "../models/StateAttacksModel";
import YearAttacksModel from "../models/YearAttacksModel";
import YearGroupsModel from "../models/YearGroupsModel";

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

// question 4
export const getTopGroups = async (country: string, limit: number)=>{
    const countryObject = await CountryGroupsModel.findOne({country_txt: country}).lean();
    if(!countryObject) throw new Error('country not found');

    const result = countryObject.groups.sort((a: { count: number }, b: { count: number }) => b.count - a.count);
    return limit == -1 ? result : result.slice(0, limit);
}

// question 5
export const getGroupsByYearService = async (year : number)=>{
    const result = await YearGroupsModel.findOne({year: year}).lean();
    if(!result) throw new Error('year not found');
    return result.groups.sort((a: { count: number }, b: { count: number }) => b.count - a.count);
}

export const getRegionsByGroup = async ()=>{

}
