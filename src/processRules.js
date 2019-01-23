import { Rules, Alerts } from './connectors';
import { topics, pubsub } from './pubsub';

const processRules = async (measurement, type) => {
  const rules = await Rules.match(measurement, type);
  const station = measurement[`${type}Station`];
  rules.forEach(async (rule) => {
    let operator;
    if (rule.comparison === 0) operator = '=';
    else if (!rule.inclusive) {
      operator = rule.comparison < 0 ? '<' : '>';
    } else {
      operator = rule.comparison < 0 ? '<=' : '>=';
    }
    const value = measurement[rule.attribute];
    const title = `${type.toUpperCase()}: station ${station.id},  ${rule.attribute} = ${Math.floor(value * 100) / 100}`;
    const text = `rule=${rule.id};port=${station.port.id};type=${type};station=${station.id};attribute=${rule.attribute};${value}${operator}${rule.value}`;
    const alert = await Alerts.createAlert(station.port.id, title, text);
    pubsub.publish(topics.NEW_ALERT_TOPIC, { newAlert: alert });
  });
};

export default processRules;
