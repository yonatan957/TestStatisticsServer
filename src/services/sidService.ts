import EventModel from "../models/EventModel";
import { addToAttackTypeModel, addToCountryGroupsModel, addTODataBase, addToStateAttacksModel, addToYearAttacksModel, addToYearGroupsModel, sortGroupsByCasualties } from "./dataService";

export const initProject = async () => {
    console.time('initProject');
  
    if (await EventModel.findOne()) return
    
    const events = require(process.env.DATA_PATH as string);
    const totalEvents = events.length;
    let i = 0;
    for (const event of events) {
      await addTODataBase(event);
      await addToAttackTypeModel(event);
      await addToYearAttacksModel(event);
      await addToStateAttacksModel(event);
      await addToCountryGroupsModel(event);
      await addToYearGroupsModel(event);
      let percent = Math.floor((i / totalEvents) * 100);
      process.stdout.write(`\r${++i}/${totalEvents} (${percent}%)${ percent < 20 ? '😨' : percent < 40 ? '😭' : percent < 60 ? '😑' : percent < 80 ? '😊' : '😀'} `);
      if (i === totalEvents) {
        process.stdout.write(`\r 100% ${i}/${totalEvents} 😊\n`);
      }
    }
    await sortGroupsByCasualties();
    console.timeEnd('initProject');
  };