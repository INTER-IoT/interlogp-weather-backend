import schedule from 'node-schedule';
import Statistics from './connectors/mongo/statistics';
import IntermwMessages from './connectors/mongo/intermwMessages';

const cronjobs = {};

cronjobs.scheduledJobs = new Map();

cronjobs.schedule = ({ name, rule, job }) => {
  console.log(`Scheduling job: ${name}, rule: ${rule}`);
  cronjobs.scheduledJobs.set(name, schedule.scheduleJob(rule, async () => {
    console.log(`Executing cronjob ${name}`);
    try {
      await job();
    } catch (e) {
      console.error(`Error execution cronjob ${name}: ${e}`);
    }
    console.log(`Finished execution of cronjob ${name}`);
  }));
};


cronjobs.jobs = [
  {
    name: 'generate-stats',
    rule: '0 1 * * *',
    job: Statistics.generate,
  },
  {
    name: 'remove-old-intermw-messages',
    rule: '0 2 * * *',
    job: async () => IntermwMessages.purgeOldData(100),
  },
];

cronjobs.scheduleAll = () => {
  cronjobs.jobs.forEach(cronjobs.schedule);
};

export default cronjobs;
