import AttackTypeModel from "../models/AttackTypeModel";
import CountryGroupsModel, { ICountryGroups } from "../models/CountryGroupsModel";
import EventModel, { IEvent } from "../models/EventModel";
import StateAttacksModel from "../models/StateAttacksModel";
import YearAttacksModel from "../models/YearAttacksModel";
import YearGroupsModel from "../models/YearGroupsModel";

export const addTODataBase = async (event: IEvent) => {
    const newEvent = new EventModel(event);
    await newEvent.save();
    return newEvent;
  };
  
export const addToAttackTypeModel = async (event: IEvent) => {
    const attackType = await AttackTypeModel.findOne({
      attacktype1_txt: event.attacktype1_txt,
    });
    if (attackType) {
      attackType.countKill += event.nkill || 0;
      attackType.countWound += event.nwound || 0;
      await attackType.save();
      return attackType;
    }
    const newAttackType = new AttackTypeModel({
      attacktype1_txt: event.attacktype1_txt,
      countKill: event.nkill || 0,
      countWound: event.nwound || 0,
    });
    await newAttackType.save();
    return newAttackType;
  };
  
export const addToYearAttacksModel = async (event: IEvent) => {
    const yearAttacks = await YearAttacksModel.findOne({ year: event.iyear });
    if (yearAttacks) {
      yearAttacks.count += 1;
      yearAttacks.countKill += event.nkill || 0;
      yearAttacks.countWound += event.nwound || 0;
      await yearAttacks.save();
      return yearAttacks;
    }
    const newYearAttacks = new YearAttacksModel({
      year: event.iyear,
      count: 1,
      countKill: event.nkill || 0,
      countWound: event.nwound || 0,
    });
    await newYearAttacks.save();
    return newYearAttacks;
  };
  
export const addToStateAttacksModel = async (event: IEvent) => {
    const stateAttacks = await StateAttacksModel.findOne({
      country_txt: event.country_txt,
    });
    if (stateAttacks) {
      stateAttacks.count += 1;
      stateAttacks.countKill += event.nkill || 0;
      stateAttacks.countWound += event.nwound || 0;
      await stateAttacks.save();
      return stateAttacks;
    }
    const response = await fetch(
      ((process.env.LINK_API_COUNTRIES as string) +
        encodeURIComponent(event.country_txt) +
        process.env.KEY_API_COUNTRIES) as string
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.results[0].geometry.lat || !data.results[0].geometry.lng) {
      throw new Error("no coordinates found");
    }
    
const newStateAttacks = new StateAttacksModel({
      country_txt: event.country_txt,
      count: 1,
      countKill: event.nkill || 0,
      countWound: event.nwound || 0,
      latitude: data.results[0].geometry.lat,
      longitude: data.results[0].geometry.lng,
    });
    await newStateAttacks.save();
    return newStateAttacks;
  };
  
export const addToCountryGroupsModel = async (event: IEvent) => {
    const countryGroups = await CountryGroupsModel.findOne({
      country_txt: event.country_txt,
    });
    if (countryGroups) {
      for (const group of countryGroups.groups) {
        if (group.gname === event.gname) {
          group.count += 1;
          await countryGroups.save();
          return countryGroups;
        }
      }
      countryGroups.groups.push({ gname: event.gname, count: 1 });
      await countryGroups.save();
      return countryGroups;
    }
    const response = await fetch(
      ((process.env.LINK_API_COUNTRIES as string) +
        encodeURIComponent(event.country_txt) +
        process.env.KEY_API_COUNTRIES) as string
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.results[0].geometry.lat || !data.results[0].geometry.lng) {
      throw new Error("no coordinates found");
    }
    const newCountryGroups = new CountryGroupsModel({
      country_txt: event.country_txt,
      groups: [{ gname: event.gname, count: 1 }],
      lat: data.results[0].geometry.lat,
      lng: data.results[0].geometry.lng,
    });
    await newCountryGroups.save();
    return newCountryGroups;
  };
  
export const addToYearGroupsModel = async (event: IEvent) => {
    const yearGroups = await YearGroupsModel.findOne({ year: event.iyear });
    if (yearGroups) {
      for (const group of yearGroups.groups) {
        if (group.gname === event.gname) {
          group.count += 1;
          await yearGroups.save();
          return yearGroups;
        }
      }
      yearGroups.groups.push({ gname: event.gname, count: 1 });
      await yearGroups.save();
      return yearGroups;
    }
    const newYearGroups = new YearGroupsModel({
      year: event.iyear,
      groups: [{ gname: event.gname, count: 1 }],
    });
    await newYearGroups.save();
    return newYearGroups;
  };
  
export const sortGroupsByCasualties = async function (
      country_txt?: string,
      gname?: string
  ) {
      if (country_txt && gname) {
          const country = await CountryGroupsModel.findOne({ country_txt });
  
          if (country) {
              const group = country.groups.find((g: { gname: string }) => g.gname === gname);
              if (group) {
                  country.groups.sort((a: { count: number }, b: { count: number }) => b.count - a.count);
                  await country.save();
              }
          }
      } else {
          const countries = await CountryGroupsModel.find();
  
          await Promise.all(
              countries.map(async (country: ICountryGroups) => {
                  country.groups.sort((a: { count: number }, b: { count: number }) => b.count - a.count);
                  await country.save();
              })
          );
      }
  };