import { io } from "../app";
import AttackTypeModel from "../models/AttackTypeModel";
import CountryGroupsModel, { ICountryGroups } from "../models/CountryGroupsModel";
import EventModel, { IEvent } from "../models/EventModel";
import StateAttacksModel from "../models/StateAttacksModel";
import YearAttacksModel from "../models/YearAttacksModel";
import YearGroupsModel from "../models/YearGroupsModel";

export const addEvent = async (event: IEvent) => {
  const result = await addTODataBase(event);
  await Promise.all([
    addToAttackTypeModel(event),
    addToYearAttacksModel(event),
    addToStateAttacksModel(event),
    addToCountryGroupsModel(event),
    addToYearGroupsModel(event),
  ]);
  io.emit('eventUpdate', event)
  return result;
};

export const addTODataBase = async (event: IEvent) => {
    const newEvent = new EventModel(event);
    await newEvent.save();
    return newEvent;
  };
  
// question 1
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

// question 3
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
  
// question 2
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
  
// question 4 & 6
export const addToCountryGroupsModel = async (event: IEvent) => {
  const casualties = (event.nwound ?? 0) + (event.nkill ?? 0);

  let countryGroups = await CountryGroupsModel.findOne({ country_txt: event.country_txt });

  if (countryGroups) {
    const group = countryGroups.groups.find(g => g.gname === event.gname);
    if (group) {
      group.count += casualties;
    } else {
      countryGroups.groups.push({ gname: event.gname, count: casualties });
    }
    await countryGroups.save();
    return countryGroups;
  }

  const response = await fetch(
    `${process.env.LINK_API_COUNTRIES}${encodeURIComponent(event.country_txt)}${process.env.KEY_API_COUNTRIES}`
  );
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const data = await response.json();
  const { lat, lng } = data.results[0].geometry;
  if (!lat || !lng) throw new Error("No coordinates found");

  countryGroups = new CountryGroupsModel({
    country_txt: event.country_txt,
    groups: [{ gname: event.gname, count: casualties }],
    lat,
    lng,
  });

  await countryGroups.save();
  return countryGroups;
};


// question 5
export const addToYearGroupsModel = async (event: IEvent) => {
  const casualties = (event.nwound ?? 0) + (event.nkill ?? 0);
  let yearGroups = await YearGroupsModel.findOne({ year: event.iyear });

  if (yearGroups) {
    const group = yearGroups.groups.find(g => g.gname === event.gname);
    if (group) {
      group.count += casualties;
    } else {
      yearGroups.groups.push({ gname: event.gname, count: casualties });
    }
    await yearGroups.save();
    return yearGroups;
  }

  yearGroups = new YearGroupsModel({
    year: event.iyear,
    groups: [{ gname: event.gname, count: casualties }],
  });

  await yearGroups.save();
  return yearGroups;
};
  
export const sortGroupsByCasualties = async function (
      country_txt?: string,
  ) {
      if (country_txt) {
          const country = await CountryGroupsModel.findOne({ country_txt });  
          if (country) {
            country.groups.sort((a: { count: number }, b: { count: number }) => b.count - a.count);
            await country.save();
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

export const deleteEvent = async (id:string)=>{
  const event = await EventModel.findByIdAndDelete(id).lean() as IEvent;
  if (!event) throw new Error('event not found');
  await decreseForAll(event);
  await sortGroupsByCasualties(event.country_txt);
  io.emit('eventUpdate', event)
  return event
}

const decreseForAll = async (event: IEvent) => {
  const nkill = event.nkill ?? 0;
  const nwound = event.nwound ?? 0;
  const totalDecrease = -(nkill + nwound);

  await Promise.all([
    // question 1
    AttackTypeModel.findOneAndUpdate({ attacktype1_txt: event.attacktype1_txt }, { $inc: { countKill: -nkill, countWound: -nwound } }),

    // question 4,5,6
    YearGroupsModel.findOneAndUpdate({ year: event.iyear, 'groups.gname': event.gname }, { $inc: { 'groups.$.count': totalDecrease } }),
    CountryGroupsModel.findOneAndUpdate({ country_txt: event.country_txt, 'groups.gname': event.gname }, { $inc: { 'groups.$.count': totalDecrease } }),

    // question 2,3
    StateAttacksModel.findOneAndUpdate({ country_txt: event.country_txt }, { $inc: { count: -1, countKill: -nkill, countWound: -nwound } }),
    YearAttacksModel.findOneAndUpdate({ year: event.iyear }, { $inc: { count: -1, countKill: -nkill, countWound: -nwound } }),
  ]);
};


export const updateEvent = async (event: IEvent) => {
  try {
    const existingEvent = await EventModel.findById(event._id);
    if (!existingEvent) throw new Error('event not found');
    const updatedEvent = await EventModel.findOneAndUpdate(
          { _id: event._id },
          { $set: event },
          { new: true }
      );
    await decreseForAll(existingEvent);
    if (!updatedEvent) {
      throw new Error('Updated event not found');
    }
    await Promise.all([
      addToAttackTypeModel(updatedEvent),
      addToYearAttacksModel(updatedEvent),
      addToStateAttacksModel(updatedEvent),
      addToCountryGroupsModel(updatedEvent),
      addToYearGroupsModel(updatedEvent),
    ]);
    io.emit('eventUpdate', event)
  } catch (error) {
      console.error('Error updating event:', error);
      throw error;
  }
};