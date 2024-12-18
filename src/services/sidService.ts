import { addToAttackTypeModel, addToCountryGroupsModel, addTODataBase, addToStateAttacksModel, addToYearAttacksModel, addToYearGroupsModel, sortGroupsByCasualties } from "./dataService";

export const initProject = async () => {
    console.time('initProject');
  
    // const eventExists = await EventModel.findOne();
    // if (eventExists) {
    //   return;
    // }
    
    const events = require(process.env.DATA_PATH as string);
    const totalEvents = events.length;
    let i = 0;
    for (const event of events) {
      // await addTODataBase(event);
      // await addToAttackTypeModel(event);
      // await addToYearAttacksModel(event);
      // await addToStateAttacksModel(event);
      // await addToCountryGroupsModel(event);
      // await addToYearGroupsModel(event);
      let procent = Math.floor((i / totalEvents) * 100);
      process.stdout.write(`\r${++i}/${totalEvents} (${procent}%)${ procent < 20 ? '😨' : procent < 40 ? '😭' : procent < 60 ? '😑' : procent < 80 ? '😊' : '😀'} `);
    }

    console.log("\nadded all events 😗");
    await sortGroupsByCasualties();
    console.timeEnd('initProject');
  };