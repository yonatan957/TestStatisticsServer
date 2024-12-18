import AttackTypeModel from "../models/AttackTypeModel";
import EventModel, { IEvent } from "../models/EventModel";
import StateAttacksModel from "../models/StateAttacksModel";
import YearAttacksModel from "../models/YearAttacksModel";

export const addMany = async (events: IEvent[]) => {
    // for (const event of events) {
        // await addTODataBase(event);
        // await addToAttackTypeModel(event);
        // await addToYearAttacksModel(event);
        // await addToStateAttacksModel(event);
    // }
    console.log("added all events")
}

const addTODataBase = async (event: IEvent) =>{
    const newEvent = new EventModel(event);
    await newEvent.save();
    return newEvent;
}

const addToAttackTypeModel = async (event: IEvent) => {
    const attackType = await AttackTypeModel.findOne({attacktype1_txt: event.attacktype1_txt});
    if(attackType){
        attackType.countKill += event.nkill || 0;
        attackType.countWound += event.nwound || 0;
        await attackType.save();
        return attackType;
    }
    const newAttackType = new AttackTypeModel({attacktype1_txt: event.attacktype1_txt, countKill: event.nkill || 0, countWound: event.nwound || 0});
    await newAttackType.save();
    return newAttackType;
}

const addToYearAttacksModel = async (event: IEvent) => {
    const yearAttacks = await YearAttacksModel.findOne({year: event.iyear});
    if(yearAttacks){
        yearAttacks.count += 1;
        yearAttacks.countKill += event.nkill || 0;
        yearAttacks.countWound += event.nwound || 0;
        await yearAttacks.save();
        return yearAttacks;
    }
    const newYearAttacks = new YearAttacksModel({year: event.iyear, count: 1, countKill: event.nkill || 0, countWound: event.nwound || 0});
    await newYearAttacks.save();
    return newYearAttacks;
}

const addToStateAttacksModel = async (event: IEvent) => {
    const stateAttacks = await StateAttacksModel.findOne({country_txt: event.country_txt});
    if(stateAttacks){
        stateAttacks.count += 1;
        stateAttacks.countKill += event.nkill || 0;
        stateAttacks.countWound += event.nwound || 0;
        await stateAttacks.save();
        return stateAttacks;
    }
    const newStateAttacks = new StateAttacksModel({country_txt: event.country_txt, count: 1, countKill: event.nkill || 0, countWound: event.nwound || 0});
    await newStateAttacks.save();
    return newStateAttacks;
}