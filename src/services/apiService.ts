import AttackTypeModel from "../models/AttackTypeModel";
import CountryGroupsModel from "../models/CountryGroupsModel";
import EventModel from "../models/EventModel";
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
    return await YearAttacksModel.find({
        year: { $gte: year, $lte: endYear }
      })
        .sort({ year: 1 })
        .lean();
    }

// question 4
export const getTopGroups = async (country: string, limit: number)=>{
    const countryObject = await CountryGroupsModel.findOne({country_txt: country}).lean();
    if(!countryObject) throw new Error('country not found');

    const result = countryObject.groups.sort((a: { count: number }, b: { count: number }) => b.count - a.count);
    return limit == -1 ? result : result.slice(0, limit);
}

// question 5.1
export const getGroupsByYearService = async (year : number, amount: number)=>{
    const result = await YearGroupsModel.findOne({year: year}).lean();
    if(!result) throw new Error('year not found');
    const sortedResult = result.groups.sort((a: { count: number }, b: { count: number }) => b.count - a.count);
    if (amount == -1) return sortedResult;
    return sortedResult.slice(0, amount);
}

// question 5.2
export const getGroupsYears = async (groupName: string) => {
    const results = await YearGroupsModel.find({'groups.gname': groupName}).lean();
    const result: { year: number, count: number }[] = [];
    if (results.length > 0) {
        results.forEach(res => {
            const group = res.groups.find(g => g.gname === groupName);
            result.push({ year: res.year, count: group ? group.count : 0 });
        });
    } else {
        throw new Error('Group not found');
    }
    return result
}

// question 6
export const getRegionsByGroup = async (groupName: string)=>{
    const countries = await CountryGroupsModel.find({
        groups: { $elemMatch: { gname: groupName } }
    }).lean();
    if (!countries) throw new Error('country not found');
    
    const result = [];
    let plusResult = 1;
    for (const country of countries) {
        for (let index = 0; index < country.groups.length; index++) {
            const group = country.groups[index];
            if (group.gname === "Unknown" && groupName !== "Unknown") {
                plusResult = 0;
            }
            if (group.gname === groupName) {
                result.push({ country: country.country_txt,count: group.count, rate: index + plusResult });
                break;
            }
        }
    }
    return result.sort((a: { rate: number }, b: { rate: number }) => a.rate - b.rate);
}

export const getGroupList = async ()=>{
    return await EventModel.distinct('gname')   
}